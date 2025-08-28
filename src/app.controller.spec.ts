import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(() => {
    appController = new AppController();
  });

  describe('root', () => {
    it('should return landing payload', () => {
      const res = appController.getRoot();
      expect(res).toEqual(
        expect.objectContaining({
          name: 'Biblioteca API',
          status: 'ok',
        }),
      );
      expect(typeof res.version).toBe('string');
      expect(res.docs).toBe('/api-docs');
    });
  });
});
