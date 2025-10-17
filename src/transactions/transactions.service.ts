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

    async findAllWithFilters(userId: string, filters: FilterTransactionDto) {
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

    async getStatistics(userId: string, startDate?: string, endDate?: string) {
        const queryBuilder = this.transactionRepository.createQueryBuilder('transaction').where('transaction.userId = :userId', { userId });
        this.applyDateFilter(queryBuilder, startDate, endDate)

        const totals = await this.transactionRepository
            .createQueryBuilder('transaction')
            .select('transaction.type', 'type')
            .addSelect('SUM(transaction.amount)', 'total')
            .where('transaction.userId = :userId', { userId })
            .groupBy('transaction.type')
            .getRawMany();

        const income = totals.find(t => t.type === 'income')?.total || 0;
        const expense = totals.find(t => t.type === 'expense')?.total || 0;

        const spendingByCategory = await this.transactionRepository
            .createQueryBuilder('transaction')
            .select('transaction.category', 'category')
            .addSelect('transaction.type', 'type')
            .addSelect('SUM(transaction.amount)', 'total')
            .where('transaction.userId = :userId', { userId })
            .groupBy('transaction.category')
            .orderBy('total', 'DESC')
            .getRawMany();

        return {
            totalIncome: parseFloat(income),
            totalExpense: parseFloat(expense),
            balance: parseFloat(income) - parseFloat(expense),
            spendingByCategory: spendingByCategory.map(item => ({
                category: item.category,
                type: item.type,
                total: parseFloat(item.total)
            })),
        };
    }


    private applyFilters(queryBuilder: any, filters: any) {
        const { type, category, startDate, endDate } = filters;
        if (type) {
            queryBuilder.andWhere('transaction.type = :type', { type });
        }
        if (category) {
            queryBuilder.andWhere('transaction.category = :category', { category });
        }


        this.applyDateFilter(queryBuilder, startDate, endDate);
    }


    private applyDateFilter(queryBuilder: any, startDate?: string, endDate?: string) {
        if (startDate && endDate) {
            queryBuilder.andWhere('transaction.date BETWEEN :startDate AND :endDate', {
                startDate,
                endDate,
            });
        } else if (startDate) {
            queryBuilder.andWhere('transaction.date >= :startDate', { startDate });
        } else if (endDate) {
            queryBuilder.andWhere('transaction.date <= :endDate', { endDate });
        }
    }


}