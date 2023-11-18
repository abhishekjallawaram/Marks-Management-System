import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UpdateDepartmentDto } from './dtos/update-department.dto';
import { CreateDepartmentDto } from './dtos/create-department.dto';
@Injectable()
export class DepartmentService {
  constructor(private prisma: PrismaService) {}

  async create(createDepartmentDto: CreateDepartmentDto) {
    return this.prisma.department.create({
      data: createDepartmentDto,
    });
  }

  async findAll() {
    return this.prisma.department.findMany();
  }

  async findOne(id: number) {
    return this.prisma.department.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateDepartmentDto: UpdateDepartmentDto) {
    return this.prisma.department.update({
      where: { id },
      data: updateDepartmentDto,
    });
  }

  async remove(id: number) {
    return this.prisma.department.delete({
      where: { id },
    });
  }
}
