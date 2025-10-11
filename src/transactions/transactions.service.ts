import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/transaction.dto';

@Injectable()
export class TransactionsService {
    constructor(@InjectRepository(Transaction) private readonly transactionRepository: Repository<Transaction>,) { }

    async findAllByUser(userId: string): Promise<Transaction[]> {
        return this.transactionRepository.find({
            where: {userId},
            order: { date: 'DESC' }
        });
    }

    async findById(id: string, userId: string): Promise<Transaction | null> {
        return this.transactionRepository.findOne({ where: { id , userId} })
    }

    async create(transactionData: CreateTransactionDto,userId: string,): Promise<Transaction> {
        const transaction = this.transactionRepository.create(transactionData)
        return this.transactionRepository.save(transaction);
    }

    async delete(id: string, userId: string): Promise<void> {
        await this.transactionRepository.delete({ id, userId });
    }
}