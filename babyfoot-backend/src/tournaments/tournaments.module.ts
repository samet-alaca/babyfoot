import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TournamentsService } from './tournaments.service';
import { TournamentsController } from './tournaments.controller';
import { Tournament } from './tournament.model';

/**
 * Module de gestion des tournois.
 * * Ce module encapsule tout ce qui concerne les tournois :
 * - Modèles Sequelize (Tournament)
 * - Contrôleurs REST
 * - Services de logique métier
 * * Il est importé par le module racine (AppModule).
 */
@Module({
  imports: [SequelizeModule.forFeature([Tournament])],
  providers: [TournamentsService],
  controllers: [TournamentsController],
  exports: [TournamentsService],
})
export class TournamentsModule {}
