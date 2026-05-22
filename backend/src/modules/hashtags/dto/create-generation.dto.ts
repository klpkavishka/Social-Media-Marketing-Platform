import { IsString, IsNumber, IsOptional, IsArray, IsBoolean } from 'class-validator';

export class CreateGenerationDto {
  @IsString()
  imageFilename: string;

  @IsOptional()
  @IsNumber()
  imageSize?: number;

  @IsOptional()
  @IsString()
  platform?: string;

  // Stage 1 — ML Model results
  @IsOptional()
  @IsString()
  mlCategory?: string;

  @IsOptional()
  @IsNumber()
  mlConfidence?: number;

  @IsOptional()
  @IsString()
  mlCaption?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  mlHashtags?: string[];

  // Stage 2 — AI Enhanced results
  @IsOptional()
  @IsString()
  enhancedCaption?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  enhancedHashtags?: string[];

  @IsOptional()
  @IsString()
  tone?: string;

  @IsOptional()
  @IsString()
  modelUsed?: string;

  // Final — What the user actually used/edited
  @IsOptional()
  @IsString()
  finalCaption?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  finalHashtags?: string[];

  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @IsOptional()
  @IsString()
  imageBase64?: string;
}
