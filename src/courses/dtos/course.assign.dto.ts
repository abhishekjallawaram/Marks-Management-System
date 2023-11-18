import { IsNotEmpty, IsString } from 'class-validator';

export class AssignCourseDto {
  @IsNotEmpty()
  readonly userId: number;
  @IsNotEmpty()
  @IsString()
  readonly courseIdentifier: string;
}
