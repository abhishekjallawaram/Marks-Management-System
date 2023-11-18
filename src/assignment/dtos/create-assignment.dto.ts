import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateAssignmentDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;
  @IsNotEmpty()
  @IsString()
  readonly category: string;
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly maxGrade: number;
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly weightage: number;
  @IsNotEmpty()
  @IsDateString()
  readonly deadline: Date;
  @IsNotEmpty()
  @IsDateString()
  readonly penalty: Date;
  @IsNotEmpty()
  readonly courseId: number;
}
