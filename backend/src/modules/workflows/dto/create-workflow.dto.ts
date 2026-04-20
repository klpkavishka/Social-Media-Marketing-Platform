import {
  IsString,
  IsOptional,
  IsEnum,
  IsObject,
  IsArray,
  MinLength,
} from 'class-validator';
import { WorkflowStatus } from '../entities/workflow.entity';

export class CreateWorkflowDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(WorkflowStatus)
  status?: WorkflowStatus;

  @IsObject()
  triggers: Record<string, any>;

  @IsArray()
  actions: Record<string, any>[];
}
