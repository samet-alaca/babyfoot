import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Tournament } from './tournament.model';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';

/**
 * Service responsable de la gestion des tournois.
 * * Ce service encapsule toute la logique métier liée aux tournois de babyfoot,
 * incluant la création, la récupération et la suppression via l'ORM Sequelize.
 */
@Injectable()
export class TournamentsService {
  /**
   * @param tournamentModel Le modèle Sequelize injecté pour la table `tournaments`.
   */
  constructor(
    @InjectModel(Tournament)
    private readonly tournamentModel: typeof Tournament,
  ) {}

  /**
   * Enregistre un nouveau tournoi dans la base de données.
   * * @param {CreateTournamentDto} createTournamentDto Les données validées du tournoi.
   * @returns {Promise<Tournament>} Le tournoi créé.
   * @throws {InternalServerErrorException} Si une erreur survient lors de l'interaction avec la base de données.
   */
  async create(createTournamentDto: CreateTournamentDto): Promise<Tournament> {
    try {
      return await this.tournamentModel.create(createTournamentDto as any);
    } catch (error) {
      throw new InternalServerErrorException('Erreur lors de la création du tournoi');
    }
  }

  /**
   * Récupère la liste de tous les tournois.
   * * Les tournois sont triés par date de manière ascendante (du plus ancien au plus récent).
   * * @returns {Promise<Tournament[]>} Un tableau d'instances de tournois.
   */
  async findAll(): Promise<Tournament[]> {
    return this.tournamentModel.findAll({
      order: [['date', 'ASC']],
    });
  }

  /**
   * Recherche un tournoi par son identifiant unique.
   * * @param {number} id L'ID du tournoi à rechercher.
   * @returns {Promise<Tournament>} L'instance du tournoi si trouvée.
   * @throws {NotFoundException} Si aucun tournoi n'est trouvé avec cet ID.
   */
  async findOne(id: number): Promise<Tournament> {
    const tournament = await this.tournamentModel.findByPk(id);
    if (!tournament) {
      throw new NotFoundException(`Le tournoi avec l'id ${id} n'existe pas`);
    }
    return tournament;
  }

  /**
   * Met à jour un tournoi existant.
   * @param id Identifiant du tournoi.
   * @param updateTournamentDto Données à modifier.
   * @returns Le tournoi mis à jour.
   */
  async update(id: number, updateTournamentDto: UpdateTournamentDto): Promise<Tournament> {
    const tournament = await this.findOne(id); // Réutilise findOne pour la 404 automatique
    try {
      return await tournament.update(updateTournamentDto);
    } catch (error) {
      throw new InternalServerErrorException('Erreur lors de la mise à jour du tournoi');
    }
  }
  
  /**
   * Supprime un tournoi de la base de données.
   * * Cette méthode vérifie d'abord l'existence du tournoi avant de tenter la suppression.
   * * @param {number} id L'identifiant du tournoi à supprimer.
   * @returns {Promise<void>}
   * @throws {NotFoundException} Si le tournoi n'existe pas (via findOne).
   * @throws {InternalServerErrorException} Si la suppression échoue techniquement.
   */
  async remove(id: number): Promise<void> {
    const tournament = await this.findOne(id);
    if (!tournament) {
      throw new NotFoundException(`Le tournoi avec l'id ${id} n'existe pas`);
    }
    try {
      await tournament.destroy();
    } catch (error) {
      throw new InternalServerErrorException('Erreur lors de la suppression du tournoi');
    }
  }
}