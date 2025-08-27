export function createPrismaMock() {
  const mock: any = {
    book: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    loan: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    // $transaction chamará o callback com o "mesmo" mock (suficiente para nossos testes)
    $transaction: jest.fn(async (cb: (tx: any) => any) => cb(mock)),
  };
  return mock;
}
