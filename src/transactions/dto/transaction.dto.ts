import { IsEnum, IsString, IsNumber, IsDateString, Min, IsOptional } from 'class-validator';

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

export class UpdateTransactionDto {
  @IsNumber()
  @Min(0.01)
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsEnum(['income', 'expense'])
  type?: 'income' | 'expense';

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsDateString()
  date?: string;
}




export class FilterTransactionDto {
  @IsOptional()
  @IsEnum(['income', 'expense'])
  type?: 'income' | 'expense';

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;


  @IsOptional()
  page?: number = 1;

  @IsOptional()
  limit?: number = 10;
}