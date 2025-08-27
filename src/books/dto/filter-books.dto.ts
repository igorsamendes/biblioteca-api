import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BookStatus } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterBooksDto {
  @ApiPropertyOptional({ enum: BookStatus, description: 'Filtrar por status do livro' })
  @IsOptional()
  @IsEnum(BookStatus)
  status?: BookStatus;

  @ApiPropertyOptional({ example: 'clean', description: 'Busca por título (contém, case-insensitive)' })
  @IsOptional()
  @IsString()
  search?: string;
}
