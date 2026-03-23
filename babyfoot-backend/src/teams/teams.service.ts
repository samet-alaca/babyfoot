import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Team } from './team.model';
import { Tournament } from '../tournaments/tournament.model';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

/**
 * Service gérant la logique métier des équipes.
 * * Assure la liaison entre les joueurs (équipes) et les événements (tournois).
 */
@Injectable()
export class TeamsService {
  constructor(
    @InjectModel(Team)
    private readonly teamModel: typeof Team,
    @InjectModel(Tournament)
    private readonly tournamentModel: typeof Tournament,
  ) {}

  /**
   * Inscrit une équipe à un tournoi.
   * * Vérifie d'abord si le tournoi cible existe réellement avant de créer l'entrée.
   * * @param createTeamDto Données de l'équipe (nom et ID du tournoi).
   * @returns L'instance de l'équipe créée.
   * @throws {BadRequestException} Si le tournoi associé n'existe pas.
   * @throws {BadRequestException} Si le tournoi est déjà terminé (status FINISHED).
   * @throws {BadRequestException} Si le tournoi a déjà atteint sa capacité maximale de 8 équipes.
   * @throws {InternalServerErrorException} En cas d'erreur de base de données.
   */
  async create(createTeamDto: CreateTeamDto): Promise<Team> {
    const tournament = await this.tournamentModel.findByPk(
      createTeamDto.tournamentId,
      {
        include: [Team],
      },
    );

    if (!tournament) {
      throw new BadRequestException(
        `Impossible d'inscrire une équipe : le tournoi ${createTeamDto.tournamentId} n'existe pas.`,
      );
    }

    const tournamentData =
      tournament instanceof Tournament
        ? tournament.get({ plain: true })
        : tournament;

    if (tournamentData.status === 'FINISHED') {
      throw new BadRequestException(
        `Impossible d'inscrire une équipe : le tournoi ${createTeamDto.tournamentId} est fermé.`,
      );
    }

    if (tournamentData.teams && tournamentData.teams.length >= 8) {
      throw new BadRequestException(
        `Impossible d'inscrire une équipe : le tournoi ${createTeamDto.tournamentId} a atteint sa capacité maximale de 8 équipes.`,
      );
    }

    try {
      return await this.teamModel.create(createTeamDto as any);
    } catch (error) {
      throw new InternalServerErrorException(
        "Erreur lors de l'enregistrement de l'équipe.",
      );
    }
  }

  /**
   * Liste toutes les équipes avec les informations de leur tournoi respectif.
   * * Utilise un 'Left Join' via Sequelize pour inclure le modèle Tournament.
   * * @returns Un tableau d'équipes enrichies.
   */
  async findAll(): Promise<Team[]> {
    return this.teamModel.findAll({
      include: [Tournament],
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * Récupère les membres d'un tournoi spécifique.
   * * @param tournamentId ID du tournoi parent.
   * @returns Liste des équipes filtrées par tournoi.
   */
  async findByTournament(tournamentId: number): Promise<Team[]> {
    return this.teamModel.findAll({
      where: { tournamentId },
      include: [Tournament],
    });
  }

  /**
   * Trouve une équipe par son ID avec les détails de son tournoi.
   * @param id Identifiant de l'équipe.
   * @throws {NotFoundException} Si l'équipe n'existe pas.
   * @returns L'équipe correspondante avec les données du tournoi associé.
   */
  async findOne(id: number): Promise<Team> {
    const team = await this.teamModel.findByPk(id, { include: [Tournament] });
    if (!team) {
      throw new NotFoundException(`L'équipe avec l'id ${id} n'existe pas`);
    }
    return team;
  }

  /**
   * Met à jour une équipe.
   * Si le tournamentId est modifié, vérifie l'existence du nouveau tournoi.
   * * @param id Identifiant de l'équipe à mettre à jour.
   * * @param updateTeamDto Données à mettre à jour (nom ou tournoiId).
   * * @returns L'équipe mise à jour.
   * * @throws {NotFoundException} Si l'équipe n'existe pas.
   * * @throws {BadRequestException} Si le nouveau tournoiId est fourni mais n'existe pas.
   * * @throws {InternalServerErrorException} En cas d'erreur lors de la mise à jour en base de données.
   */
  async update(id: number, updateTeamDto: UpdateTeamDto): Promise<Team> {
    const team = await this.findOne(id);

    if (
      updateTeamDto.tournamentId !== undefined &&
      updateTeamDto.tournamentId !== null &&
      updateTeamDto.tournamentId !== team.tournamentId
    ) {
      const tournamentExists = await this.tournamentModel.findByPk(
        updateTeamDto.tournamentId,
      );
      if (!tournamentExists) {
        throw new BadRequestException(`Le tournoi cible n'existe pas.`);
      }
    }

    try {
      return await team.update(updateTeamDto);
    } catch (error) {
      throw new InternalServerErrorException(
        "Erreur lors de la mise à jour de l'équipe.",
      );
    }
  }

  /**
   * Supprime une équipe de la base de données.
   * * @param id Identifiant de l'équipe à supprimer.
   * @throws {NotFoundException} Si l'équipe est introuvable.
   * @throws {InternalServerErrorException} En cas d'erreur lors de la suppression en base de données.
   */
  async remove(id: number): Promise<void> {
    const team = await this.teamModel.findByPk(id);
    if (!team) {
      throw new NotFoundException(`Équipe avec l'id ${id} non trouvée.`);
    }

    try {
      await team.destroy();
    } catch (error) {
      throw new InternalServerErrorException(
        "Erreur lors de la suppression de l'équipe.",
      );
    }
  }
}
