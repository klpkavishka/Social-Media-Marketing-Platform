import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsObject,
  MinLength,
  IsDateString,
} from 'class-validator';
import { ContentType, ContentStatus } from '../entities/content.entity';

export class CreateContentDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @MinLength(1)
  body: string;

  @IsEnum(ContentType)
  type: ContentType;

  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;

  @IsOptional()
  @IsObject()
  media?: Record<string, any>;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  platforms?: string[];

  @IsOptional()
  @IsDateString()
  scheduledDate?: string;

  @IsOptional()
  @IsObject()
  aiSuggestions?: Record<string, any>;
}
