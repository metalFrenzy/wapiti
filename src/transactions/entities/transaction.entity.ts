import { LargeNumberLike } from "crypto";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column()
    description: string;

    @Column({ type: 'enum', enum: ['income', 'expense'] })
    type: 'income' | 'expense';

    @Column()
    category: string;

    @Column({ type: 'date' })
    date: Date;

    @ManyToOne(() => User)
    user: User

    @Column()
    userId: string;

    @CreateDateColumn()
    createdAt: Date;
}