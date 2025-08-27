import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLoanDto {
  @ApiProperty({ example: 1, description: 'ID do livro a ser emprestado' })
  @IsInt()
  @Min(1)
  bookId: number;

  @ApiProperty({ example: 1, description: 'ID do usuário que pega o livro' })
  @IsInt()
  @Min(1)
  userId: number;
}
