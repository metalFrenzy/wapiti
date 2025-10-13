import { Body, Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateTransactionDto } from './dto/transaction.dto';

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
    getAllTransactions(@Request() req) {
        return this.transactionService.findAllByUser(req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    getTransactionById(@Request() req) {
        return this.transactionService.findById(req.params.id, req.user.id);
    }
}


