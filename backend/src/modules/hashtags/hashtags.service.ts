import { Injectable, BadRequestException, ServiceUnavailableException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import FormData from 'form-data';
import { HashtagPredictionDto } from './dto';

@Injectable()
export class HashtagsService {
  private readonly logger = new Logger(HashtagsService.name);
  private readonly ai: AxiosInstance;

  constructor(private config: ConfigService) {
    this.ai = axios.create({
      baseURL: this.config.get('AI_SERVICE_URL', 'http://localhost:8000'),
      timeout: 30_000,
    });
  }

  async predict(file: Express.Multer.File): Promise<HashtagPredictionDto> {
    if (!['image/jpeg','image/png','image/webp'].includes(file.mimetype)) {
      throw new BadRequestException(`Invalid type: ${file.mimetype}`);
    }

    const form = new FormData();
    form.append('file', file.buffer, {
      filename:    file.originalname,
      contentType: file.mimetype,
    });

    try {
      this.logger.log(`📤 Sending file to AI service: ${file.originalname} (${file.size} bytes)`);
      const { data } = await this.ai.post('/predict', form, {
        headers: form.getHeaders(),
      });
      this.logger.log(`✅ AI prediction success: ${data.category} (${data.confidence}%) ${data.processing_ms}ms`);
      return data;
    } catch (err) {
      this.logger.error(`❌ AI prediction failed:`, err);
      
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 400) {
          this.logger.error(`Bad request from AI service: ${err.response.data?.detail}`);
          throw new BadRequestException(err.response.data?.detail || 'Invalid image');
        }
        this.logger.error(`AI service error (${err.response?.status}): ${JSON.stringify(err.response?.data)}`);
      }
      
      this.logger.error(`Full error:`, err instanceof Error ? err.message : err);
      throw new ServiceUnavailableException('AI service unavailable');
    }
  }
}
