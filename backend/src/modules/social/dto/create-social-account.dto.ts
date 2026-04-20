import {
  IsString,
  IsEnum,
  IsOptional,
  IsObject,
} from 'class-validator';
import { SocialPlatform, AccountStatus } from '../entities/social-account.entity';

export class CreateSocialAccountDto {
  @IsEnum(SocialPlatform)
  platform: SocialPlatform;

  @IsString()
  accountName: string;

  @IsString()
  accountId: string;

  @IsOptional()
  @IsEnum(AccountStatus)
  status?: AccountStatus;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
