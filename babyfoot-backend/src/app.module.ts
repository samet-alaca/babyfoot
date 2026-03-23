import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TournamentsModule } from './tournaments/tournaments.module';
import { TeamsModule } from './teams/teams.module';
import { MatchesModule } from './matches/matches.module';
import { Tournament } from './tournaments/tournament.model';
import { Team } from './teams/team.model';
import { Match } from './matches/match.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),

    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        dialect: 'mysql',
        host: config.get('IS_DOCKER') ? config.get<string>('DB_HOST') : 'localhost',
        port: config.get<number>('DB_PORT', 3306),
        username: config.get<string>('MYSQL_USER'),
        password: config.get<string>('MYSQL_PASSWORD'),
        database: config.get<string>('MYSQL_DATABASE'),
        autoLoadModels: true,
        synchronize: true,
        retryAttempts: 10,
        retryDelay: 3000,
        models: [Tournament, Team, Match],
      }),
    }),

    TournamentsModule,
    TeamsModule,
    MatchesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
