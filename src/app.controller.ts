import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController() // esconde esta rota do Swagger
@Controller()
export class AppController {
  @Get()
  getRoot() {
    return {
      name: 'Biblioteca API',
      version: '1.0.0',
      status: 'ok',
      docs: '/api-docs',
    };
  }
}
