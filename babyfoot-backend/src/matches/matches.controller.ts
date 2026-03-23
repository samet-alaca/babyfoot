import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MatchesService } from './matches.service';
import { UpdateMatchDto } from './dto/update-match.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Match } from './match.model';

/**
 * Contrôleur gérant le cycle de vie des matchs.
 * Permet la génération automatisée des calendriers et la mise à jour des résultats.
 */
@ApiTags('matches')
@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  /**
   * Génère automatiquement toutes les rencontres pour un tournoi donné.
   * * @param tournamentId L'identifiant unique du tournoi parent.
   * @returns Un tableau des matchs créés.
   * @throws {NotFoundException} Si le tournoi n'existe pas.
   * @throws {BadRequestException} Si les matchs sont déjà générés ou si le nombre d'équipes est insuffisant.
   */
  @Post('generate/:tournamentId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Générer le calendrier des matchs',
    description:
      'Crée toutes les combinaisons de matchs possibles pour les équipes inscrites à un tournoi.',
  })
  @ApiParam({
    name: 'tournamentId',
    description: 'ID du tournoi pour lequel générer les matchs',
  })
  @ApiResponse({
    status: 201,
    description: 'Calendrier généré avec succès.',
    type: [Match],
  })
  @ApiResponse({
    status: 400,
    description: "Génération impossible (déjà généré ou pas assez d'équipes).",
  })
  @ApiResponse({ status: 404, description: 'Tournoi introuvable.' })
  async generate(@Param('tournamentId', ParseIntPipe) tournamentId: number) {
    return this.matchesService.generateCalendar(tournamentId);
  }

  /**
   * Récupère la liste exhaustive des matchs d'un tournoi spécifique.
   * Les données incluent les informations détaillées des équipes (Home/Away).
   * * @param tournamentId L'identifiant du tournoi.
   * @returns Liste des matchs ordonnée par date de création.
   */
  @Get('tournament/:tournamentId')
  @ApiOperation({
    summary: 'Lister les matchs d’un tournoi',
    description:
      'Récupère tous les matchs liés à un tournoi avec les détails des équipes participantes.',
  })
  @ApiParam({ name: 'tournamentId', description: 'ID du tournoi cible' })
  @ApiResponse({
    status: 200,
    description: 'Liste des matchs récupérée.',
    type: [Match],
  })
  async findByTournament(
    @Param('tournamentId', ParseIntPipe) tournamentId: number,
  ) {
    return this.matchesService.findAllByTournament(tournamentId);
  }

  /**
   * Met à jour les informations d'un match (scores ou statut).
   * * @param id L'identifiant unique du match.
   * @param updateMatchDto Objet contenant les scores ou le nouveau statut (PENDING, FINISHED).
   * @returns Le match mis à jour.
   * @throws {NotFoundException} Si le match n'existe pas.
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Mettre à jour un match',
    description:
      "Permet de saisir les scores ou de changer l'état d'avancement d'une rencontre.",
  })
  @ApiParam({ name: 'id', description: 'ID du match à modifier' })
  @ApiResponse({
    status: 200,
    description: 'Match mis à jour avec succès.',
    type: Match,
  })
  @ApiResponse({ status: 404, description: 'Match introuvable.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMatchDto: UpdateMatchDto,
  ) {
    return this.matchesService.update(id, updateMatchDto);
  }
}
