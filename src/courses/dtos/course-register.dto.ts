import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { CourseEntity } from '../course.models';

export enum LevelEnum {
  UNDERGRAD = 'undergrad',
  GRAD = 'grad',
  PHD = 'phd',
}

export enum CourseTypeEnum {
  ONLINE = 'online',
  OFFLINE = 'offline',
  DISANT = 'distant',
}

export enum TermTypeEnum {
  SPRING = 'spring',
  FALL = 'fall',
  SUMMER = 'summer',
}

export class CreateCourseDto implements CourseEntity {
  createdAt: Date;
  id: number;
  updatedAt: Date;
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly level: LevelEnum;

  @IsNotEmpty()
  readonly type: CourseTypeEnum;

  @IsNumber()
  @IsPositive()
  readonly credits: number;

  @IsDateString()
  @IsNotEmpty()
  readonly startDate: Date;

  @IsDateString()
  @IsNotEmpty()
  readonly endDate: Date;

  @IsNotEmpty()
  readonly term: TermTypeEnum;

  @IsString()
  @IsNotEmpty()
  readonly section: string;

  @IsNumber()
  @IsPositive()
  readonly maxStrength: number;

  @IsNotEmpty()
  @IsNumber()
  readonly instructorId: number;

  @IsNotEmpty()
  @IsNumber()
  readonly departmentId: number;
}
