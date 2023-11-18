import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class UpdateAssignmentDto {
  @IsNotEmpty()
  readonly courseEnrollmentId: number;
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly marks: number;
}
