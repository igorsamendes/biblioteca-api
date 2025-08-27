import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BookStatus } from '@prisma/client';

export class FilterBooksDto {
  @IsOptional()
  @IsEnum(BookStatus)
  status?: BookStatus;

  @IsOptional()
  @IsString()
  search?: string; // busca por título
}
