import { Test, TestingModule } from '@nestjs/testing';
import { LoansService } from './loans.service';
import { PrismaService } from '../prisma/prisma.service';
import { createPrismaMock } from '../test/prisma-mock';

describe('LoansService', () => {
  let service: LoansService;
  let prisma: ReturnType<typeof createPrismaMock>;

  beforeEach(async () => {
    prisma = createPrismaMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoansService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<LoansService>(LoansService);
  });

  it('deve criar empréstimo quando livro AVAILABLE e usuário existe', async () => {
    prisma.book.findUnique.mockResolvedValue({ id: 1, status: 'AVAILABLE' });
    prisma.user.findUnique.mockResolvedValue({ id: 1 });
    prisma.loan.create.mockResolvedValue({ id: 10, bookId: 1, userId: 1 });
    prisma.book.update.mockResolvedValue({ id: 1, status: 'BORROWED' });

    const res = await service.create({ bookId: 1, userId: 1 });

    expect(prisma.loan.create).toHaveBeenCalled();
    expect(prisma.book.update).toHaveBeenCalledWith({ where: { id: 1 }, data: { status: 'BORROWED' } });
    expect(res.id).toBe(10);
  });

  it('deve falhar se livro não existe', async () => {
    prisma.book.findUnique.mockResolvedValue(null);

    await expect(service.create({ bookId: 999, userId: 1 })).rejects.toMatchObject({
      status: 404,
      response: { message: 'Book not found' },
    });
  });

  it('deve falhar se livro já emprestado', async () => {
    prisma.book.findUnique.mockResolvedValue({ id: 1, status: 'BORROWED' });

    await expect(service.create({ bookId: 1, userId: 1 })).rejects.toMatchObject({
      status: 400,
      response: { message: 'Book already borrowed' },
    });
  });

  it('deve falhar se usuário não existe', async () => {
    prisma.book.findUnique.mockResolvedValue({ id: 1, status: 'AVAILABLE' });
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(service.create({ bookId: 1, userId: 999 })).rejects.toMatchObject({
      status: 404,
      response: { message: 'User not found' },
    });
  });

  it('deve marcar devolução e tornar livro AVAILABLE', async () => {
    prisma.loan.findUnique.mockResolvedValue({ id: 10, bookId: 1, returnDate: null });
    prisma.loan.update.mockResolvedValue({ id: 10, returnDate: new Date() });
    prisma.book.update.mockResolvedValue({ id: 1, status: 'AVAILABLE' });

    const res = await service.markReturn(10);

    expect(prisma.loan.update).toHaveBeenCalled();
    expect(prisma.book.update).toHaveBeenCalledWith({ where: { id: 1 }, data: { status: 'AVAILABLE' } });
    expect(res).toEqual({ message: 'Book returned' });
  });

  it('deve falhar ao devolver um loan inexistente', async () => {
    prisma.loan.findUnique.mockResolvedValue(null);

    await expect(service.markReturn(999)).rejects.toMatchObject({
      status: 404,
      response: { message: 'Loan not found' },
    });
  });

  it('deve falhar ao devolver um loan já devolvido', async () => {
    prisma.loan.findUnique.mockResolvedValue({ id: 10, bookId: 1, returnDate: new Date() });

    await expect(service.markReturn(10)).rejects.toMatchObject({
      status: 400,
      response: { message: 'Loan already returned' },
    });
  });
});
