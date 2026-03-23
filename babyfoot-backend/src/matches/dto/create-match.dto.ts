import { IsInt, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMatchDto {
  @ApiProperty({ description: 'ID du tournoi parent', example: 1 })
  @IsNotEmpty()
  @IsInt()
  tournamentId: number;

  @ApiProperty({ description: "ID de l'équipe à domicile", example: 10 })
  @IsNotEmpty()
  @IsInt()
  homeTeamId: number;

  @ApiProperty({ description: "ID de l'équipe à l'extérieur", example: 11 })
  @IsNotEmpty()
  @IsInt()
  awayTeamId: number;

  @ApiProperty({
    description: 'Statut initial du match',
    enum: ['PENDING', 'FINISHED'],
    default: 'PENDING',
  })
  @IsOptional()
  @IsEnum(['PENDING', 'FINISHED'])
  status?: string = 'PENDING';
}
