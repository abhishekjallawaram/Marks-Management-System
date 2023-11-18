import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateAssignmentDto } from './dtos/create-assignment.dto';
import { UserEntity } from '../auth/auth.model';
import { FindDto } from './dtos/find.dto';
import { UpdateAssignmentDto } from './dtos/update-assignment.dto';

@Injectable()
export class AssignmentsService {
  constructor(private prisma: PrismaService) {}

  async create(createAssignmentDto: CreateAssignmentDto, user: UserEntity) {
    const course = await this.prisma.courseList.findUnique({
      where: { id: createAssignmentDto.courseId },
      include: {
        instructor: {
          select: { userId: true },
        },
      },
    });

    if (!course || course.instructor.userId !== user.id) {
      throw new UnauthorizedException(
        'User is not authorized to create assignments for this course',
      );
    } else {
      const enrollments = await this.prisma.courseEnrollment.findMany({
        where: { courseListId: createAssignmentDto.courseId },
        select: {
          id: true,
        },
      });

      const assignmentCreationPromises = enrollments.map((enrollment) =>
        this.prisma.assignment.create({
          data: {
            name: createAssignmentDto.name,
            category: createAssignmentDto.category,
            maxGrade: createAssignmentDto.maxGrade,
            weightage: createAssignmentDto.weightage,
            deadline: createAssignmentDto.deadline,
            penalty: createAssignmentDto.penalty,
            courseId: enrollment.id,
          },
          include: {
            course: {},
          },
        }),
      );

      return await Promise.all(assignmentCreationPromises);
    }
  }

  async findStudent(user: UserEntity, id: number, findDto: FindDto) {
    const courseEnrollment = await this.prisma.courseEnrollment.findUnique({
      where: { id: findDto.courseEnrollmentId },
      include: {
        studentProfile: true,
        course: {
          include: {
            instructor: {
              select: {
                userId: true,
              },
            },
          },
        },
      },
    });

    if (!courseEnrollment) {
      throw new UnauthorizedException('Enrollment not found');
    }
    if (user.isFaculty) {
      if (courseEnrollment.course.instructor.userId !== user.id) {
        throw new UnauthorizedException('Faculty is not teaching this course');
      }
    }
    console.log(courseEnrollment.studentProfile.id);
    console.log(id);
    if (!(courseEnrollment.studentProfile.id === Number(id))) {
      throw new UnauthorizedException('Student is not enrolled in this course');
    }

    return this.prisma.assignment.findMany({
      where: {
        courseId: findDto.courseEnrollmentId,
      },
      select: {
        id: true,
        name: true,
        category: true,
        marks: true,
        maxGrade: true,
        weightage: true,
        deadline: true,
        penalty: true,
      },
    });
  }

  async update(
    user: UserEntity,
    id: number,
    updateAssignmentDto: UpdateAssignmentDto,
  ) {
    const courseEnrollment = await this.prisma.courseEnrollment.findUnique({
      where: { id: updateAssignmentDto.courseEnrollmentId },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                userId: true,
              },
            },
          },
        },
      },
    });

    if (!courseEnrollment) {
      throw new Error('Course enrollment not found');
    }

    if (courseEnrollment.course.instructor.userId === user.id) {
      throw new UnauthorizedException(
        'Faculty is not authorized to update marks for this course',
      );
    }

    return this.prisma.assignment.update({
      where: { id: Number(id) },
      data: { marks: updateAssignmentDto.marks },
      select: {
        id: true,
        marks: true,
      },
    });
  }
  async findAll(user: UserEntity, courseEnrollmentId: number) {
    const enrollment = await this.prisma.courseEnrollment.findFirst({
      where: {
        id: Number(courseEnrollmentId),
        studentProfile: {
          userId: user.id,
        },
      },
    });
    console.log(enrollment);
    if (!enrollment) {
      throw new NotFoundException(
        'Enrollment not found or does not belong to the student',
      );
    }
    return this.prisma.assignment.findMany({
      where: { courseId: Number(courseEnrollmentId) },
      select: {
        id: true,
        name: true,
        category: true,
        marks: true,
        maxGrade: true,
        weightage: true,
        deadline: true,
      },
    });
  }
}
