import { CourseList } from '@prisma/client';

export class CourseEntity implements CourseList {
  createdAt: Date;
  credits: number;
  departmentId: number;
  endDate: Date;
  id: number;
  instructorId: number;
  level: string;
  maxStrength: number;
  name: string;
  section: string;
  startDate: Date;
  term: string;
  type: string;
  updatedAt: Date;
}
