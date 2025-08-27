import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { PrismaService } from '../prisma/prisma.service';
import { createPrismaMock } from '../test/prisma-mock';

describe('BooksService', () => {
  let service: BooksService;
  let prisma: ReturnType<typeof createPrismaMock>;

  beforeEach(async () => {
    prisma = createPrismaMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  it('deve criar livro com status AVAILABLE', async () => {
    prisma.book.create.mockResolvedValue({
      id: 1,
      title: 'Clean Code',
      author: 'Robert C. Martin',
      publishedYear: 2008,
      status: 'AVAILABLE',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await service.create({
      title: 'Clean Code',
      author: 'Robert C. Martin',
      publishedYear: 2008,
    });

    expect(prisma.book.create).toHaveBeenCalledWith({
      data: { title: 'Clean Code', author: 'Robert C. Martin', publishedYear: 2008, status: 'AVAILABLE' },
    });
    expect(result.status).toBe('AVAILABLE');
  });

  it('deve listar livros com filtro e busca', async () => {
    prisma.book.findMany.mockResolvedValue([{ id: 1 }]);

    const res = await service.findAll({ status: 'AVAILABLE' as any, search: 'clean' });

    expect(prisma.book.findMany).toHaveBeenCalledWith({
      where: {
        status: 'AVAILABLE',
        title: { contains: 'clean', mode: 'insensitive' },
      },
      orderBy: { id: 'desc' },
    });
    expect(res).toHaveLength(1);
  });

  it('deve alternar status de AVAILABLE para BORROWED', async () => {
    prisma.book.findUnique.mockResolvedValue({ id: 1, status: 'AVAILABLE' });
    prisma.book.update.mockResolvedValue({ id: 1, status: 'BORROWED' });

    const res = await service.toggleStatus(1);

    expect(prisma.book.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(prisma.book.update).toHaveBeenCalledWith({ where: { id: 1 }, data: { status: 'BORROWED' } });
    expect(res.status).toBe('BORROWED');
  });

  it('deve lançar NotFoundException quando livro não existe no toggle', async () => {
    prisma.book.findUnique.mockResolvedValue(null);

    await expect(service.toggleStatus(999)).rejects.toMatchObject({
      status: 404,
    });
  });
});
