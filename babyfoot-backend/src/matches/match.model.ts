import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Tournament } from '../tournaments/tournament.model';
import { Team } from '../teams/team.model';

/**
 * Représente la structure d'un match en base de données
 */
@Table({ tableName: 'matches' })
export class Match extends Model {
  /**
   * Clé étrangère vers le tournoi auquel appartient le match.
   */
  @ForeignKey(() => Tournament)
  @Column({
    type: DataType.INTEGER,
    onDelete: 'CASCADE',
    allowNull: false,
  })
  tournamentId: number;

  /**
   * Clé étrangère vers l'équipe à domicile (home team). Représente l'équipe qui joue à domicile.
   */
  @ForeignKey(() => Team)
  @Column({
    type: DataType.INTEGER,
    onDelete: 'CASCADE',
    allowNull: false,
  })
  homeTeamId: number;

  /**
   * Clé étrangère vers l'équipe à l'extérieur (away team). Représente l'adversaire de l'équipe à domicile.
   */
  @ForeignKey(() => Team)
  @Column({
    type: DataType.INTEGER,
    onDelete: 'CASCADE',
    allowNull: false,
  })
  awayTeamId: number;

  /**
   * Score de l'équipe à domicile. Par défaut, 0 au début du match.
   */
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  homeScore: number;

  /**
   * Score de l'équipe à l'extérieur. Par défaut, 0 au début du match.
   */
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  awayScore: number;

  /**
   * Statut actuel du match.
   * Valeurs possibles : 'PENDING' (en attente),  'FINISHED' (terminé).
   */
  @Column({
    type: DataType.ENUM('PENDING', 'FINISHED'),
    defaultValue: 'PENDING',
  })
  status: string;

  @BelongsTo(() => Tournament, { onDelete: 'CASCADE' })
  tournament: Tournament;

  @BelongsTo(() => Team, {
    foreignKey: 'homeTeamId',
    as: 'homeTeam',
    onDelete: 'CASCADE',
  })
  homeTeam: Team;

  @BelongsTo(() => Team, {
    foreignKey: 'awayTeamId',
    as: 'awayTeam',
    onDelete: 'CASCADE',
  })
  awayTeam: Team;
}
