import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Delete,
  Patch,
} from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { Tournament } from './tournament.model';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateTournamentDto } from './dto/update-tournament.dto';

/**
 * * Contrôleur gérant le cycle de vie des tournois.
 */
@ApiTags('tournaments')
@Controller('tournaments')
export class TournamentsController {
  /**
   * @param tournamentsService Service de gestion des tournois injecté.
   */
  constructor(private readonly tournamentsService: TournamentsService) {}

  /**
   * Endpoint pour la création d'un nouveau tournoi.
   * * @param {CreateTournamentDto} createTournamentDto Données nécessaires à la création.
   * @returns {Promise<Tournament>} Instance du tournoi créé.
   * @example POST /tournaments
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer un nouveau tournoi' })
  @ApiResponse({
    status: 201,
    description: 'Le tournoi a été créé avec succès.',
    type: Tournament,
  })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  async create(
    @Body() createTournamentDto: CreateTournamentDto,
  ): Promise<Tournament> {
    return this.tournamentsService.create(createTournamentDto);
  }

  /**
   * Récupère l'intégralité des tournois enregistrés.
   * * @returns {Promise<Tournament[]>} Liste d'objets tournois triés par date.
   * @example GET /tournaments
   */
  @Get()
  @ApiOperation({ summary: 'Récupérer la liste de tous les tournois' })
  @ApiResponse({
    status: 200,
    description: 'Liste des tournois récupérée avec succès.',
    type: [Tournament],
  })
  async findAll(): Promise<Tournament[]> {
    return this.tournamentsService.findAll();
  }

  /**
   * Récupère les informations détaillées d'un tournoi spécifique.
   * * @param {number} id Identifiant unique du tournoi (doit être un entier).
   * @returns {Promise<Tournament>} Le tournoi correspondant.
   * @throws {NotFoundException} Géré par le service si l'ID n'existe pas.
   * @example GET /tournaments/1
   */
  @Get(':id')
  @ApiOperation({ summary: "Récupérer les détails d'un tournoi par son ID" })
  @ApiResponse({
    status: 200,
    description: 'Détails du tournoi récupérés avec succès.',
    type: Tournament,
  })
  @ApiResponse({ status: 404, description: 'Tournoi non trouvé' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Tournament> {
    return this.tournamentsService.findOne(id);
  }

  /**
   * Met à jour les informations d'un tournoi existant.
   * * @param id Identifiant du tournoi à modifier.
   * @param updateTournamentDto Données à mettre à jour.
   * @return Le tournoi mis à jour.
   * @throws NotFoundException Si le tournoi n'existe pas.
   * */
  @Patch(':id')
  @ApiOperation({ summary: 'Modifier un tournoi existant' })
  @ApiResponse({
    status: 200,
    description: 'Tournoi mis à jour avec succès.',
    type: Tournament,
  })
  @ApiResponse({ status: 404, description: 'Tournoi non trouvé' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTournamentDto: UpdateTournamentDto,
  ): Promise<Tournament> {
    return this.tournamentsService.update(id, updateTournamentDto);
  }

  /**
   * Supprime un tournoi de la base de données.
   * * @param {number} id Identifiant unique du tournoi à supprimer.
   * @returns {Promise<void>} Réponse vide avec code HTTP 204.
   * @example DELETE /tournaments/1
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer un tournoi par son ID' })
  @ApiResponse({ status: 204, description: 'Tournoi supprimé avec succès.' })
  @ApiResponse({ status: 404, description: 'Tournoi non trouvé' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.tournamentsService.remove(id);
  }

  /**
   * Clôture officiellement un tournoi, calcule le vainqueur et fige les résultats.
   * @param id L'identifiant du tournoi à fermer.
   */
  @Post(':id/close')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Clôturer un tournoi',
    description:
      'Vérifie que tous les matchs sont finis, désigne le vainqueur et change le statut en FINISHED.',
  })
  @ApiResponse({ status: 200, description: 'Tournoi clôturé avec succès.' })
  @ApiResponse({
    status: 400,
    description: 'Certains matchs ne sont pas encore terminés.',
  })
  async close(@Param('id', ParseIntPipe) id: number) {
    return this.tournamentsService.closeTournament(id);
  }
}
