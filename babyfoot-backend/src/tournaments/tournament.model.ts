import {
  Column,
  Model,
  Table,
  DataType,
  HasMany,
  ForeignKey,
} from 'sequelize-typescript';
import { Team } from '../teams/team.model';
import { Match } from '../matches/match.model';

/**
 * Représente la structure d'un tournoi en base de données.
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
   * Statut actuel du tournoi.
   * Valeurs possibles : 'PENDING' (en attente), 'FINISHED' (terminé).
   */
  @Column({
    type: DataType.ENUM('PENDING', 'FINISHED'),
    defaultValue: 'PENDING',
  })
  status: string;

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

  @ForeignKey(() => Team)
  @Column({
    type: DataType.INTEGER,
    onDelete: 'SET NULL',
    allowNull: true,
  })
  winnerId: number;

  @HasMany(() => Team)
  teams: Team[];

  @HasMany(() => Match)
  matches: Match[];
}
