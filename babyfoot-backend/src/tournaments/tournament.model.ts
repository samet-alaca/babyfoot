import { Column, Model, Table, DataType, HasMany } from 'sequelize-typescript';
import { Team } from '../teams/team.model';

/**
 * Représente la structure d'un tournoi en base de données.
 * * Cette entité stocke les informations de base et sert de pivot pour les équipes et les matchs.
 */
@Table
export class Tournament extends Model {
  /**
   * Nom officiel du tournoi.
   * @example "Tournoi de test"
   */
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  /**
   * Date prévue pour l'événement.
   * Stockée au format DATE (sans heure si géré ainsi).
   */
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  date: Date;

  /**
   * Description optionnelle détaillant les règles ou le contexte.
   */
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @HasMany(() => Team)
  teams: Team[];
}