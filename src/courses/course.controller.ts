import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  Patch,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { CreateCourseDto } from './dtos/course-register.dto';
import { UpdateCourseDto } from './dtos/course-update.dto';
import { AssignCourseDto } from './dtos/course.assign.dto';
import { CourseService } from './course.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('courses')
@UseGuards(AuthGuard, RolesGuard)
@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}
  @Get()
  @Roles(Role.Admin, Role.Faculty)
  findAll(@Req() req: Request) {
    return this.courseService.findAll(req['user']);
  }
  // @Get('faculty')
  // @Roles(Role.Faculty)
  // findFacultyCourses(@Req() req: Request) {
  //   return this.courseService.findFacultyCourses(req['user']);
  // }

  @Get('student')
  @Roles(Role.Student)
  findStudentCourses(@Req() req: Request) {
    return this.courseService.findStudentCourses(req['user']);
  }

  @Get(':id')
  @Roles(Role.Admin, Role.Faculty)
  courseDetails(@Param('id') id: number, @Req() req: Request) {
    return this.courseService.courseDetails(req['user'], id);
  }

  @Post()
  @Roles(Role.Admin)
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create(createCourseDto);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  update(@Param('id') id: number, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(id, updateCourseDto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id') id: number) {
    return this.courseService.remove(id);
  }

  @Post(':id/assign')
  @Roles(Role.Admin)
  assign(
    @Param('id') courseId: number,
    @Body() assignCourseDto: AssignCourseDto,
  ) {
    return this.courseService.assign(courseId, assignCourseDto);
  }
}
