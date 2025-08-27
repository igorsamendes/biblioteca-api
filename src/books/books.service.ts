import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { FilterBooksDto } from './dto/filter-books.dto';
import { BookStatus } from '@prisma/client';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateBookDto) {
    return this.prisma.book.create({
      data: { ...dto, status: 'AVAILABLE' },
    });
  }

  async findAll({ status, search }: FilterBooksDto) {
    return this.prisma.book.findMany({
      where: {
        ...(status ? { status } as any : {}),
        ...(search ? { title: { contains: search, mode: 'insensitive' } } : {}),
      },
      orderBy: { id: 'desc' },
    });
  }

  async toggleStatus(id: number) {
    const book = await this.prisma.book.findUnique({ where: { id } });
    if (!book) throw new NotFoundException('Book not found');

    const newStatus: BookStatus =
      book.status === 'AVAILABLE' ? 'BORROWED' : 'AVAILABLE';

    return this.prisma.book.update({
      where: { id },
      data: { status: newStatus },
    });
  }
}
