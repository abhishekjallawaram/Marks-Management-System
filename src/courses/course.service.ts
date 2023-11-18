import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCourseDto } from './dtos/course-register.dto';
import { UpdateCourseDto } from './dtos/course-update.dto';
import { AssignCourseDto } from './dtos/course.assign.dto';
import { UserEntity } from '../auth/auth.model';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

  async create(createCourseDto: CreateCourseDto) {
    return this.prisma.courseList.create({
      data: createCourseDto,
    });
  }

  async update(id: number, updateCourseDto: UpdateCourseDto) {
    return this.prisma.courseList.update({
      where: { id: Number(id) },
      data: updateCourseDto,
    });
  }

  async remove(id: number) {
    return this.prisma.courseList.delete({
      where: { id: Number(id) },
    });
  }

  async assign(courseId: number, assignCourseDto: AssignCourseDto) {
    const { userId, courseIdentifier } = assignCourseDto;

    const user = await this.prisma.customUser.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isStudent) {
      const studentProfile = await this.prisma.studentProfile.findFirst({
        where: { userId: userId },
      });
      if (!studentProfile) {
        throw new NotFoundException('Student profile not found');
      }
      const today = new Date();
      return this.prisma.courseEnrollment.create({
        data: {
          courseListId: Number(courseId),
          studentProfileId: studentProfile.id,
          courseIdentifier: courseIdentifier,
          year: today.getFullYear(),
        },
      });
    } else if (user.isFaculty) {
      return this.prisma.courseList.update({
        where: { id: Number(courseId) },
        data: {
          instructorId: userId,
        },
      });
    } else {
      throw new Error('User must be a student or faculty to assign a course.');
    }
  }

  // async findFacultyCourses(user: UserEntity) {
  //   return this.prisma.courseList.findMany({
  //     where: { instructorId: user.id },
  //     select: {
  //       id: true,
  //       name: true,
  //       type: true,
  //       credits: true,
  //       level: true,
  //     },
  //   });
  // }

  async courseDetails(user: UserEntity, id: number) {
    const course = await this.prisma.courseList.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        name: true,
        type: true,
        credits: true,
        level: true,
        startDate: true,
        endDate: true,
        term: true,
        section: true,
        instructorId: true,
        maxStrength: true,
        departmentId: true,
        instructor: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!course) {
      throw new Error('Course not found');
    }

    if (user.isFaculty) {
      if (course.instructor.userId !== user.id) {
        throw new UnauthorizedException('User is not authorized to view');
      }
    }

    const students = await this.prisma.courseEnrollment.findMany({
      where: {
        courseListId: Number(id),
      },
      select: {
        id: true,
        studentProfile: {
          select: {
            id: true,
            collegeId: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    const studentDetails = students.map((enrollment) => ({
      id: enrollment.studentProfile.id,
      enrollmentId: enrollment.id,
      collegeId: enrollment.studentProfile.collegeId,
      firstName: enrollment.studentProfile.user.firstName,
      lastName: enrollment.studentProfile.user.lastName,
    }));

    return {
      courseDetails: course,
      students: studentDetails,
    };
  }

  async findStudentCourses(user: UserEntity) {
    console.log('#####', user.id);
    const studentProfile = await this.prisma.studentProfile.findFirst({
      where: { userId: user.id },
      select: {
        id: true,
      },
    });

    if (!studentProfile) {
      return [];
    }
    const courses = await this.prisma.courseEnrollment.findMany({
      where: {
        studentProfileId: studentProfile.id,
      },
      select: {
        id: true,
        course: {
          select: {
            name: true,
          },
        },
      },
    });

    return courses.map((enrollment) => ({
      enrollmentId: enrollment.id,
      courseName: enrollment.course.name,
    }));
  }

  async findAll(user: UserEntity) {
    if (user.isAdmin) {
      return this.prisma.courseList.findMany({
        select: {
          id: true,
          name: true,
          type: true,
          credits: true,
          level: true,
        },
      });
    }
    if (user.isFaculty) {
      return this.prisma.courseList.findMany({
        where: { instructorId: user.id },
        select: {
          id: true,
          name: true,
          type: true,
          credits: true,
          level: true,
        },
      });
    } else {
      throw new Error('Invalid user');
    }
  }
}
