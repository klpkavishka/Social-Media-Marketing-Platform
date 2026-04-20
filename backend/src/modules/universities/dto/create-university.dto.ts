import {
  IsString,
  IsOptional,
  IsObject,
  MinLength,
  IsUrl,
} from 'class-validator';

export class CreateUniversityDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  branding?: Record<string, any>;

  @IsOptional()
  @IsObject()
  settings?: Record<string, any>;
}
