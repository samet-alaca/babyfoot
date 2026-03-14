import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT) ?? 3306,
      username: process.env.DB_USERNAME ?? 'root',
      password: process.env.DB_PASSWORD ?? 'root',
      database: process.env.DB_NAME ?? 'babyfoot_db',
      autoLoadModels: true,
      synchronize: true,
      retryAttempts: 10,
      retryDelay: 3000
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
