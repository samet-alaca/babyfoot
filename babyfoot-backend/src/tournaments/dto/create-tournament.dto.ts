import {
  IsString,
  IsNotEmpty,
  IsDateString,
  MinLength,
  MaxLength,
  IsOptional,
  MinDate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTournamentDto {
  @ApiProperty({
    description: 'Le nom du tournoi',
    minLength: 3,
    maxLength: 50,
    example: 'Tournoi test',
  })
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le nom du tournoi est obligatoire' })
  @MinLength(3, { message: 'Le nom doit contenir au moins 3 caractères' })
  @MaxLength(50, { message: 'Le nom doit contenir au maximum 50 caractères' })
  name: string;

  @ApiProperty({
    description: 'La date de début du tournoi au format ISO',
    example: '2026-06-01',
  })
  @IsDateString({}, { message: 'La date doit être au format ISO valide' })
  @IsNotEmpty({ message: 'La date de début du tournoi est obligatoire' })
  date: string;

  @ApiProperty({
    description: 'Une description du tournoi',
    maxLength: 500,
    required: false,
  })
  @IsString({ message: 'La description doit être une chaîne de caractères' })
  @IsOptional()
  @MaxLength(500, {
    message: 'La description doit contenir au maximum 500 caractères',
  })
  description?: string;
}
