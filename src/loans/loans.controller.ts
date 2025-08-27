import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { LoansService } from './loans.service';
import { CreateLoanDto } from './dto/create-loan.dto';

@Controller('loans')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Post()
  create(@Body() dto: CreateLoanDto) {
    return this.loansService.create(dto);
  }

  @Patch(':id/return')
  markReturn(@Param('id') id: string) {
    return this.loansService.markReturn(+id);
  }
}
