import { Body, Controller, Post, UseGuards, Request, Get, Param, Delete, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateTransactionDto, FilterTransactionDto } from './dto/transaction.dto';

@Controller('transactions')
export class TransactionsController {
    constructor(private readonly transactionService: TransactionsService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    createTransaction(@Body() createTransaction: CreateTransactionDto, @Request() req) {
        return this.transactionService.create(createTransaction, req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    getAllTransactions(@Request() req, @Query() filters: FilterTransactionDto) {
        return this.transactionService.findAllWithFilters(req.user.id, filters);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    getTransactionById(@Request() req, @Param('id') id: string) {
        return this.transactionService.findById(id, req.user.id);
    }

    @Delete(':id')
    delete(@Param('id') id: string, @Request() req) {
        return this.transactionService.delete(id, req.user.userId);
    }

    @Get('statistics')
    getStatistics(@Request() req, @Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
        return this.transactionService.getStatistics(req.user.id, startDate, endDate)
    }

}


