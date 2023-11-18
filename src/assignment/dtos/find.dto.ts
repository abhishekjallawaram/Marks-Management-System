import { IsNotEmpty } from 'class-validator';

export class FindDto {
  @IsNotEmpty()
  readonly courseEnrollmentId: number;
}
