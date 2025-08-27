import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FilterUsersDto {
  @ApiPropertyOptional({ description: 'Busca por nome ou e-mail', example: 'igor' })
  @IsOptional()
  @IsString()
  search?: string;
}
