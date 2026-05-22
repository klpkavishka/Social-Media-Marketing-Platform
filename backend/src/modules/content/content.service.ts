import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Content, ContentStatus } from './entities/content.entity';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,
  ) {}

  async create(createContentDto: CreateContentDto) {
    const content = this.contentRepository.create(createContentDto);
    return this.contentRepository.save(content);
  }

  async findAll(options: {
    page: number;
    limit: number;
    status?: string;
    type?: string;
  }) {
    const { page, limit, status, type } = options;
    const skip = (page - 1) * limit;

    const queryBuilder = this.contentRepository
      .createQueryBuilder('content')
      .skip(skip)
      .take(limit)
      .orderBy('content.createdAt', 'DESC');

    if (status) {
      queryBuilder.andWhere('content.status = :status', { status });
    }

    if (type) {
      queryBuilder.andWhere('content.type = :type', { type });
    }

    const [contents, total] = await queryBuilder.getManyAndCount();

    return {
      data: contents,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getCalendar(startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setUTCHours(23, 59, 59, 999);

    const contents = await this.contentRepository.find({
      where: {
        scheduledDate: Between(start, end),
      },
      order: {
        scheduledDate: 'ASC',
      },
    });

    return { data: contents };
  }

  async findOne(id: string) {
    const content = await this.contentRepository.findOne({
      where: { id },
    });

    if (!content) {
      throw new NotFoundException(`Content with ID ${id} not found`);
    }

    return content;
  }

  async update(id: string, updateContentDto: UpdateContentDto) {
    const content = await this.findOne(id);
    Object.assign(content, updateContentDto);
    return this.contentRepository.save(content);
  }

  async remove(id: string) {
    const content = await this.findOne(id);
    await this.contentRepository.remove(content);
    return { message: 'Content deleted successfully' };
  }

  async publish(id: string) {
    const content = await this.findOne(id);
    content.status = ContentStatus.PUBLISHED;
    content.publishedDate = new Date();
    return this.contentRepository.save(content);
  }

  async schedule(id: string, scheduledDate: Date) {
    const content = await this.findOne(id);
    content.status = ContentStatus.SCHEDULED;
    content.scheduledDate = scheduledDate;
    return this.contentRepository.save(content);
  }
}
