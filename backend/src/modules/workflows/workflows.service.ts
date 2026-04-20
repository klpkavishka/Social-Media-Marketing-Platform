import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workflow, WorkflowStatus } from './entities/workflow.entity';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';

@Injectable()
export class WorkflowsService {
  constructor(
    @InjectRepository(Workflow)
    private readonly workflowRepository: Repository<Workflow>,
  ) {}

  async create(createWorkflowDto: CreateWorkflowDto) {
    const workflow = this.workflowRepository.create(createWorkflowDto);
    return this.workflowRepository.save(workflow);
  }

  async findAll(options: { page: number; limit: number; status?: string }) {
    const { page, limit, status } = options;
    const skip = (page - 1) * limit;

    const queryBuilder = this.workflowRepository
      .createQueryBuilder('workflow')
      .skip(skip)
      .take(limit)
      .orderBy('workflow.createdAt', 'DESC');

    if (status) {
      queryBuilder.andWhere('workflow.status = :status', { status });
    }

    const [workflows, total] = await queryBuilder.getManyAndCount();

    return {
      data: workflows,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const workflow = await this.workflowRepository.findOne({
      where: { id },
    });

    if (!workflow) {
      throw new NotFoundException(`Workflow with ID ${id} not found`);
    }

    return workflow;
  }

  async update(id: string, updateWorkflowDto: UpdateWorkflowDto) {
    const workflow = await this.findOne(id);
    Object.assign(workflow, updateWorkflowDto);
    return this.workflowRepository.save(workflow);
  }

  async remove(id: string) {
    const workflow = await this.findOne(id);
    await this.workflowRepository.remove(workflow);
    return { message: 'Workflow deleted successfully' };
  }

  async execute(id: string) {
    const workflow = await this.findOne(id);
    
    // TODO: Implement workflow execution logic
    workflow.lastExecutedAt = new Date();
    await this.workflowRepository.save(workflow);

    return {
      message: 'Workflow executed successfully',
      workflowId: workflow.id,
    };
  }

  async activate(id: string) {
    const workflow = await this.findOne(id);
    workflow.status = WorkflowStatus.ACTIVE;
    return this.workflowRepository.save(workflow);
  }

  async deactivate(id: string) {
    const workflow = await this.findOne(id);
    workflow.status = WorkflowStatus.INACTIVE;
    return this.workflowRepository.save(workflow);
  }
}
