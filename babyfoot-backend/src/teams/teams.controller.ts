import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, HttpCode, HttpStatus, Patch } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { Team } from './team.model';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateTeamDto } from './dto/update-team.dto';

/**
 * Contrôleur gérant les opérations liées aux équipes.
 * * Permet l'inscription d'équipes à des tournois et la gestion de leurs informations.
 */
@ApiTags('teams')
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  /**
   * Inscrit une nouvelle équipe à un tournoi.
   * * @param createTeamDto Objet contenant le nom de l'équipe et l'ID du tournoi cible.
   * @returns La nouvelle équipe créée.
   * @example POST /teams
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Inscrire une équipe à un tournoi' })
  @ApiResponse({ status: 201, description: 'L\'équipe a été inscrite avec succès.', type: Team })
  @ApiResponse({ status: 400, description: 'Données invalides ou tournoi inexistant.' })
  async create(@Body() createTeamDto: CreateTeamDto): Promise<Team> {
    return this.teamsService.create(createTeamDto);
  }

  /**
   * Récupère la liste de toutes les équipes, tous tournois confondus.
   * * @returns Un tableau d'équipes incluant potentiellement les données du tournoi lié.
   */
  @Get()
  @ApiOperation({ summary: 'Lister toutes les équipes' })
  @ApiResponse({ status: 200, description: 'Liste récupérée.', type: [Team] })
  async findAll(): Promise<Team[]> {
    return this.teamsService.findAll();
  }

  /**
   * Récupère toutes les équipes inscrites à un tournoi spécifique.
   * * @param tournamentId L'identifiant du tournoi.
   * @returns Liste des équipes du tournoi.
   * @example GET /teams/tournament/1
   */
  @Get('tournament/:tournamentId')
  @ApiOperation({ summary: 'Récupérer les équipes d\'un tournoi spécifique' })
  @ApiResponse({ status: 200, description: 'Liste des équipes du tournoi.', type: [Team] })
  async findByTournament(@Param('tournamentId', ParseIntPipe) tournamentId: number): Promise<Team[]> {
    return this.teamsService.findByTournament(tournamentId);
  }

  /**
   * Récupère une équipe par son ID.
   * * @param id L'identifiant de l'équipe.
   * @returns Les détails de l'équipe.
   * @example GET /teams/1
   */
  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une équipe par son ID' })
  @ApiResponse({ status: 200, type: Team })
  @ApiResponse({ status: 404, description: 'Non trouvé' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Team> {
    return this.teamsService.findOne(id);
  }

  /**
   * Met à jour les informations d'une équipe.
   * * @param id L'identifiant de l'équipe à modifier.
   * @param updateTeamDto Les données à mettre à jour (actuellement vide, à compléter selon les besoins).
   * @returns L'équipe mise à jour.
   * @example PATCH /teams/1
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Modifier une équipe' })
  @ApiResponse({ status: 200, type: Team })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTeamDto: UpdateTeamDto,
  ): Promise<Team> {
    return this.teamsService.update(id, updateTeamDto);
  }

  /**
   * Supprime une équipe (désinscription).
   * * @param id Identifiant de l'équipe à supprimer.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer une équipe par son ID' })
  @ApiResponse({ status: 204, description: 'Équipe supprimée.' })
  @ApiResponse({ status: 404, description: 'Équipe non trouvée.' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.teamsService.remove(id);
  }
}