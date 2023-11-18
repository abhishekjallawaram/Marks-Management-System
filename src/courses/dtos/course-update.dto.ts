import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { CourseTypeEnum, LevelEnum, TermTypeEnum } from './course-register.dto';

export class UpdateCourseDto {
  updatedAt: Date;
  @IsString()
  @IsNotEmpty()
  readonly name?: string;

  @IsNotEmpty()
  readonly level?: LevelEnum;

  @IsNotEmpty()
  readonly type?: CourseTypeEnum;

  @IsNumber()
  @IsPositive()
  readonly credits?: number;

  @IsDateString()
  @IsNotEmpty()
  readonly startDate?: Date;

  @IsDateString()
  @IsNotEmpty()
  readonly endDate?: Date;

  @IsNotEmpty()
  readonly term?: TermTypeEnum;

  @IsString()
  @IsNotEmpty()
  readonly section?: string;

  @IsNumber()
  @IsPositive()
  readonly maxStrength?: number;

  @IsNotEmpty()
  @IsNumber()
  readonly instructorId?: number;

  @IsNotEmpty()
  @IsNumber()
  readonly departmentId?: number;
}
