import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { FilterBooksDto } from './dto/filter-books.dto';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @ApiOperation({ summary: 'Cadastrar novo livro' })
  @ApiResponse({ status: 201, description: 'Livro criado com sucesso' })
  @Post()
  create(@Body() dto: CreateBookDto) {
    return this.booksService.create(dto);
  }

  @ApiOperation({ summary: 'Listar livros com filtros' })
  @ApiQuery({ name: 'status', required: false, description: 'AVAILABLE ou BORROWED' })
  @ApiQuery({ name: 'search', required: false, description: 'Busca por título (contém)' })
  @ApiResponse({ status: 200, description: 'Lista de livros' })
  @Get()
  findAll(@Query() query: FilterBooksDto) {
    return this.booksService.findAll(query);
  }

  @ApiOperation({ summary: 'Alternar status do livro (AVAILABLE ↔ BORROWED)' })
  @ApiParam({ name: 'id', description: 'ID do livro' })
  @ApiResponse({ status: 200, description: 'Status atualizado' })
  @ApiResponse({ status: 404, description: 'Livro não encontrado' })
  @Patch(':id/status')
  toggleStatus(@Param('id') id: string) {
    return this.booksService.toggleStatus(+id);
  }
}
