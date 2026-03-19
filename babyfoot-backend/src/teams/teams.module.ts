import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { Team } from './team.model';
import { Tournament } from '../tournaments/tournament.model';

@Module({
  imports: [SequelizeModule.forFeature([Team, Tournament])],
  providers: [TeamsService],
  controllers: [TeamsController],
  exports: [TeamsService],
})
export class TeamsModule {}
