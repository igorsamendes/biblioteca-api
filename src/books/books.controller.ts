import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { FilterBooksDto } from './dto/filter-books.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  create(@Body() dto: CreateBookDto) {
    return this.booksService.create(dto);
  }

  @Get()
  findAll(@Query() query: FilterBooksDto) {
    return this.booksService.findAll(query);
  }

  @Patch(':id/status')
  toggleStatus(@Param('id') id: string) {
    return this.booksService.toggleStatus(+id);
  }
}
