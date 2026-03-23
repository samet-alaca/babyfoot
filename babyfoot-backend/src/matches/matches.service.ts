import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Match } from './match.model';
import { Team } from '../teams/team.model';
import { Tournament } from '../tournaments/tournament.model';
import { UpdateMatchDto } from './dto/update-match.dto';

/**
 * Service responsable de la gestion des matchs.
 * Gère la génération automatique des calendriers et le suivi des scores.
 */
@Injectable()
export class MatchesService {
  constructor(
    @InjectModel(Match) private readonly matchModel: typeof Match,
    @InjectModel(Team) private readonly teamModel: typeof Team,
    @InjectModel(Tournament)
    private readonly tournamentModel: typeof Tournament,
  ) {}

  /**
   * Génère un calendrier complet pour un tournoi.
   * Chaque équipe affronte toutes les autres une fois.
   * * @param tournamentId - L'identifiant du tournoi cible.
   * @returns Une promesse contenant le tableau des matchs créés en base.
   * @throws {NotFoundException} Si le tournoi n'est pas trouvé.
   * @throws {BadRequestException} Si le nombre d'équipes est insuffisant (< 2)
   * ou si des matchs existent déjà pour ce tournoi.
   * @throws {InternalServerErrorException} En cas d'échec lors de l'insertion en base (bulkCreate).
   */
  async generateCalendar(tournamentId: number): Promise<Match[]> {
    const tournament = await this.tournamentModel.findByPk(tournamentId, {
      include: [Team],
    });

    if (!tournament) throw new NotFoundException('Tournoi introuvable.');

    const tournamentData = tournament.get({ plain: true });

    if (tournamentData.teams.length < 2)
      throw new BadRequestException(
        'Il faut au moins 2 équipes pour générer des matchs.',
      );

    const existingMatches = await this.matchModel.count({
      where: { tournamentId },
    });
    if (existingMatches > 0)
      throw new BadRequestException(
        'Le calendrier a déjà été généré pour ce tournoi.',
      );

    const teams = tournamentData.teams;
    const matchesData: Partial<Match>[] = [];

    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        matchesData.push({
          tournamentId,
          homeTeamId: teams[i].id,
          awayTeamId: teams[j].id,
          status: 'PENDING',
        });
      }
    }

    try {
      return await this.matchModel.bulkCreate(matchesData);
    } catch (error) {
      throw new InternalServerErrorException(
        'Erreur lors de la génération des matchs.',
      );
    }
  }

  /**
   * Récupère tous les matchs associés à un tournoi spécifique.
   * Inclut les informations détaillées (aliasées) des équipes à domicile et à l'extérieur.
   * * @param tournamentId - L'identifiant du tournoi.
   * @returns Liste des matchs triée par ordre chronologique de création.
   */
  async findAllByTournament(tournamentId: number): Promise<Match[]> {
    return this.matchModel.findAll({
      where: { tournamentId },
      include: [
        { model: Team, as: 'homeTeam' },
        { model: Team, as: 'awayTeam' },
      ],
      order: [['createdAt', 'ASC']],
    });
  }

  /**
   * Met à jour les informations d'un match (scores ou statut).
   * * @param id - L'identifiant du match à modifier.
   * @param updateMatchDto - Les données de mise à jour (homeScore, awayScore, status).
   * @returns L'instance du match mis à jour.
   * @throws {NotFoundException} Si le match n'existe pas en base de données.
   */
  async update(id: number, updateMatchDto: UpdateMatchDto): Promise<Match> {
    const match = await this.matchModel.findByPk(id);
    if (!match) throw new NotFoundException('Match introuvable.');

    return await match.update(updateMatchDto);
  }
}
