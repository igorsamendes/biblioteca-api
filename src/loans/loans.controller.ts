import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { LoansService } from './loans.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { FilterLoansDto } from './dto/filter-loans.dto';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Loans')
@Controller('loans')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @ApiOperation({ summary: 'Registrar empréstimo' })
  @ApiResponse({ status: 201, description: 'Empréstimo criado' })
  @ApiResponse({ status: 404, description: 'Livro ou usuário não encontrado' })
  @ApiResponse({ status: 400, description: 'Livro já emprestado' })
  @Post()
  create(@Body() dto: CreateLoanDto) {
    return this.loansService.create(dto);
  }

  @ApiOperation({ summary: 'Listar empréstimos (com filtros)' })
  @ApiQuery({ name: 'userId', required: false, description: 'ID do usuário' })
  @ApiQuery({ name: 'bookId', required: false, description: 'ID do livro' })
  @ApiQuery({ name: 'returned', required: false, description: 'true = devolvidos, false = em aberto' })
  @ApiResponse({ status: 200, description: 'Lista de empréstimos' })
  @Get()
  findAll(@Query() query: FilterLoansDto) {
    return this.loansService.findAll(query);
  }

  @ApiOperation({ summary: 'Marcar devolução de um livro' })
  @ApiParam({ name: 'id', description: 'ID do empréstimo' })
  @ApiResponse({ status: 200, description: 'Livro devolvido' })
  @ApiResponse({ status: 404, description: 'Empréstimo não encontrado' })
  @ApiResponse({ status: 400, description: 'Empréstimo já devolvido' })
  @Patch(':id/return')
  markReturn(@Param('id') id: string) {
    return this.loansService.markReturn(+id);
  }
}
