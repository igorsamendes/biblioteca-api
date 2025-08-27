import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({ example: 'Clean Code', description: 'Título do livro' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Robert C. Martin', description: 'Autor do livro' })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiProperty({ example: 2008, description: 'Ano de publicação' })
  @IsInt()
  @Min(0)
  publishedYear: number;
}
