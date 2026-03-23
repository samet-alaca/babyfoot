import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Tournament } from '../tournaments/tournament.model';
import { Match } from '../matches/match.model';

@Table
export class Team extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @ForeignKey(() => Tournament)
  @Column({
    type: DataType.INTEGER,
    onDelete: 'CASCADE',
    allowNull: false,
  })
  tournamentId: number;

  @BelongsTo(() => Tournament)
  tournament: Tournament;

  @HasMany(() => Match)
  matches: Match[];
}
