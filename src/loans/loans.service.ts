import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FilterLoansDto } from './dto/filter-loans.dto';

@Injectable()
export class LoansService {
  constructor(private prisma: PrismaService) {}

  async create({ bookId, userId }: { bookId: number; userId: number }) {
    return this.prisma.$transaction(async (tx) => {
      const book = await tx.book.findUnique({ where: { id: bookId } });
      if (!book) throw new NotFoundException('Book not found');
      if (book.status === 'BORROWED') throw new BadRequestException('Book already borrowed');

      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) throw new NotFoundException('User not found');

      const loan = await tx.loan.create({ data: { bookId, userId } });

      await tx.book.update({ where: { id: bookId }, data: { status: 'BORROWED' } });

      return loan;
    });
  }

  async markReturn(id: number) {
    return this.prisma.$transaction(async (tx) => {
      const loan = await tx.loan.findUnique({ where: { id } });
      if (!loan) throw new NotFoundException('Loan not found');
      if (loan.returnDate) throw new BadRequestException('Loan already returned');

      await tx.loan.update({ where: { id }, data: { returnDate: new Date() } });
      await tx.book.update({ where: { id: loan.bookId }, data: { status: 'AVAILABLE' } });

      return { message: 'Book returned' };
    });
  }
  findAll({ userId, bookId, returned }: FilterLoansDto) {
    return this.prisma.loan.findMany({
      where: {
        ...(userId ? { userId } : {}),
        ...(bookId ? { bookId } : {}),
        ...(returned === true
          ? { returnDate: { not: null } }
          : returned === false
          ? { returnDate: null }
          : {}),
      },
      orderBy: { id: 'desc' },
      include: { book: true, user: true }, // ajuda na visualização
    });
  }
}
