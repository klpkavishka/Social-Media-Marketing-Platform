import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { University } from './entities/university.entity';
import { CreateUniversityDto } from './dto/create-university.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';

@Injectable()
export class UniversitiesService {
  constructor(
    @InjectRepository(University)
    private readonly universityRepository: Repository<University>,
  ) {}

  async create(createUniversityDto: CreateUniversityDto) {
    const university = this.universityRepository.create(createUniversityDto);
    return this.universityRepository.save(university);
  }

  async findAll(options: { page: number; limit: number; search?: string }) {
    const { page, limit, search } = options;
    const skip = (page - 1) * limit;

    const where = search
      ? [{ name: Like(`%${search}%`) }, { location: Like(`%${search}%`) }]
      : {};

    const [universities, total] = await this.universityRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: universities,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const university = await this.universityRepository.findOne({
      where: { id },
    });

    if (!university) {
      throw new NotFoundException(`University with ID ${id} not found`);
    }

    return university;
  }

  async update(id: string, updateUniversityDto: UpdateUniversityDto) {
    const university = await this.findOne(id);
    Object.assign(university, updateUniversityDto);
    return this.universityRepository.save(university);
  }

  async remove(id: string) {
    const university = await this.findOne(id);
    await this.universityRepository.remove(university);
    return { message: 'University deleted successfully' };
  }
}
