import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { CreateTransactionDto, FilterTransactionDto } from './dto/transaction.dto';

@Injectable()
export class TransactionsService {
    constructor(@InjectRepository(Transaction) private readonly transactionRepository: Repository<Transaction>,) { }

    async findAllByUser(userId: string): Promise<Transaction[]> {
        return this.transactionRepository.find({
            where: { userId },
            order: { date: 'DESC' }
        });
    }

    async findById(id: string, userId: string): Promise<Transaction | null> {
        return this.transactionRepository.findOne({ where: { id, userId } })
    }

    async create(transactionData: CreateTransactionDto, userId: string,): Promise<Transaction> {
        const transaction = this.transactionRepository.create(transactionData)
        return this.transactionRepository.save(transaction);
    }

    async delete(id: string, userId: string): Promise<void> {
        await this.transactionRepository.delete({ id, userId });
    }

    async getStatistics(userId: string, filters: FilterTransactionDto) {
        const { type, category, startDate, endDate, page = 1, limit = 10 } = filters
        const queryBuilder = this.transactionRepository.createQueryBuilder('transaction').where('transaction.userId = :userId', { userId });
        this.applyFilters(queryBuilder, { type, category, startDate, endDate });

        const skip = (page - 1) * limit;
        queryBuilder.skip(skip).take(limit).orderBy('transaction.date', 'DESC');
        const [data, total] = await queryBuilder.getManyAndCount();

        return {
            data,
            meta: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / limit),
            }
        };

    }
}