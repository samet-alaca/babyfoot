import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { Match } from './match.model';
import { Team } from '../teams/team.model';
import { Tournament } from '../tournaments/tournament.model';

@Module({
  // On s'assure que Match est le PREMIER de la liste
  imports: [SequelizeModule.forFeature([Match, Team, Tournament])],
  providers: [MatchesService],
  controllers: [MatchesController],
  exports: [MatchesService],
})
export class MatchesModule {}
