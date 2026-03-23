import { IsInt, IsOptional, IsEnum, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMatchDto {
  @ApiProperty({ example: 2 })
  @IsOptional()
  @IsInt()
  @Min(0)
  homeScore?: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(0)
  awayScore?: number;

  @ApiProperty({ enum: ['PENDING', 'FINISHED'] })
  @IsOptional()
  @IsEnum(['PENDING', 'FINISHED'])
  status?: string;
}
