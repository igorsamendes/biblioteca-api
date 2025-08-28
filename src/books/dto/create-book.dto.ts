import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({ example: 'Senhor dos Aneis', description: 'Título do livro' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'J.R.R. Tolkien', description: 'Autor do livro' })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiProperty({ example: 1937, description: 'Ano de publicação' })
  @IsInt()
  @Min(0)
  publishedYear: number;
}
