export class CreateExamDto {
  readonly examDate: Date;
  readonly category: string;
  readonly maxGrade: number;
  readonly weightage: number;
  readonly marks: number;
  readonly courseId: number;
}
