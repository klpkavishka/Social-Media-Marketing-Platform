import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  IsNumber,
  IsObject,
  MinLength,
  IsArray,
  Min,
} from 'class-validator';
import { CampaignStatus, SocialPlatform } from '../entities/campaign.entity';

export class TargetAudienceDto {
  @IsOptional()
  @IsObject()
  ageRange?: { min: number; max: number };

  @IsOptional()
  @IsArray()
  gender?: string[];

  @IsOptional()
  @IsArray()
  locations?: string[];

  @IsOptional()
  @IsArray()
  interests?: string[];

  @IsOptional()
  @IsArray()
  languages?: string[];
}

export class CreateCampaignDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  goals?: string[];

  @IsOptional()
  @IsEnum(CampaignStatus)
  status?: CampaignStatus;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  budget?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  spend?: number;

  @IsOptional()
  @IsArray()
  @IsEnum(SocialPlatform, { each: true })
  platforms?: SocialPlatform[];

  @IsOptional()
  @IsObject()
  targetAudience?: TargetAudienceDto;

  @IsOptional()
  @IsObject()
  targeting?: Record<string, any>;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  contentIds?: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  impressions?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  clicks?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  engagements?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  conversions?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  reach?: number;
}
