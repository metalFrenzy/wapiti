import { IsEnum, IsString, IsNumber, IsDateString, Min } from 'class-validator';

export class CreateTransactionDto {
  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsString()
  description: string;

  @IsEnum(['income', 'expense'])
  type: 'income' | 'expense';

  @IsString()
  category: string;

  @IsDateString()
  date: string;
}