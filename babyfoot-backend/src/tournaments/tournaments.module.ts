import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TournamentsService } from './tournaments.service';
import { TournamentsController } from './tournaments.controller';
import { Tournament } from './tournament.model';

@Module({
  imports: [SequelizeModule.forFeature([Tournament])],
  providers: [TournamentsService],
  controllers: [TournamentsController],
  exports: [TournamentsService],
})
export class TournamentsModule {}
