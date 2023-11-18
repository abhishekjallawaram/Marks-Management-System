import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateExamDto } from './dtos/create-exam.dto';

@Injectable()
export class ExamsService {
  constructor(private prisma: PrismaService) {}

  async create(createExamDto: CreateExamDto) {
    const exam = await this.prisma.exams.create({
      data: createExamDto,
    });

    return exam.id;
  }

  async findAll() {
    return this.prisma.exams.findMany();
  }

  async findOne(id: number) {
    return this.prisma.exams.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateExamDto: CreateExamDto) {
    return this.prisma.exams.update({
      where: { id },
      data: updateExamDto,
    });
  }

  async remove(id: number) {
    return this.prisma.exams.delete({
      where: { id },
    });
  }
}
