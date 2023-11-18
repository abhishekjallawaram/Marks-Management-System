import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dtos/create-assignment.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { Request } from 'express';
import { FindDto } from './dtos/find.dto';
import { UpdateAssignmentDto } from './dtos/update-assignment.dto';

@ApiTags('assignments')
@UseGuards(AuthGuard, RolesGuard)
@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Post()
  @Roles(Role.Faculty)
  create(
    @Body() createAssignmentDto: CreateAssignmentDto,
    @Req() req: Request,
  ) {
    return this.assignmentsService.create(createAssignmentDto, req['user']);
  }

  @Get('student/:id')
  @Roles(Role.Student)
  findAll(@Req() req: Request, @Param('id') id: number) {
    return this.assignmentsService.findAll(req['user'], id);
  }

  @Put(':id')
  @Roles(Role.Faculty, Role.Admin)
  findStudent(
    @Req() req: Request,
    @Param('id') id: number,
    @Body() findDto: FindDto,
  ) {
    return this.assignmentsService.findStudent(req['user'], id, findDto);
  }

  @Patch(':id')
  @Roles(Role.Faculty)
  update(
    @Param('id') id: number,
    @Req() req: Request,
    @Body() updateAssignmentDto: UpdateAssignmentDto,
  ) {
    return this.assignmentsService.update(req['user'], id, updateAssignmentDto);
  }
}
