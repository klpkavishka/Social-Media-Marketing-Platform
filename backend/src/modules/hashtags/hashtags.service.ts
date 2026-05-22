import { Injectable, BadRequestException, ServiceUnavailableException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios, { AxiosInstance } from 'axios';
import FormData from 'form-data';
import { HashtagPredictionDto, CaptionResultDto, CreateGenerationDto } from './dto';
import { Generation, GenerationDocument } from './schemas/generation.schema';

@Injectable()
export class HashtagsService {
  private readonly logger = new Logger(HashtagsService.name);
  private readonly ai: AxiosInstance;

  constructor(
    private config: ConfigService,
    @InjectModel(Generation.name)
    private generationModel: Model<GenerationDocument>,
  ) {
    this.ai = axios.create({
      baseURL: this.config.get('AI_SERVICE_URL', 'http://localhost:8000'),
      timeout: 60_000, // Increased timeout for OpenRouter API calls
    });
  }

  /**
   * Stage 1: ML Model prediction — classifies image and generates hashtags + basic caption
   */
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
      this.logger.log(`📤 [Stage 1] Sending file to AI service: ${file.originalname} (${file.size} bytes)`);
      this.logger.debug(`🔗 AI Service URL: ${this.config.get('AI_SERVICE_URL')}`);
      
      const { data } = await this.ai.post('/predict', form, {
        headers: form.getHeaders(),
      });
      
      this.logger.log(`✅ [Stage 1] ML prediction: ${data.category} (${data.confidence}%) in ${data.processing_ms}ms`);
      return data;
    } catch (err) {
      this.logger.error(`❌ [Stage 1] ML prediction failed:`, err instanceof Error ? err.message : err);
      
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 400) {
          const detail = err.response.data?.detail || err.response.data?.error || 'Invalid image';
          throw new BadRequestException(detail);
        }
        
        if (err.response?.status === 500) {
          const errorMsg = err.response.data?.detail || err.response.data?.error || 'Internal server error';
          throw new ServiceUnavailableException(`AI service error: ${errorMsg}`);
        }
        
        throw new ServiceUnavailableException(`AI service error: ${err.response?.statusText || 'Unknown error'}`);
      }
      
      if (err instanceof Error) {
        throw new ServiceUnavailableException(`Failed to connect to AI service: ${err.message}`);
      }
      
      throw new ServiceUnavailableException('AI service unavailable');
    }
  }

  /**
   * Stage 2: AI-enhanced caption — sends image + ML results + tone to OpenRouter API
   */
  async generateCaption(
    file: Express.Multer.File,
    tone: string,
    hashtags: string,
    category: string,
  ): Promise<CaptionResultDto> {
    if (!['image/jpeg','image/png','image/webp'].includes(file.mimetype)) {
      throw new BadRequestException(`Invalid type: ${file.mimetype}`);
    }

    const form = new FormData();
    form.append('file', file.buffer, {
      filename:    file.originalname,
      contentType: file.mimetype,
    });
    form.append('tone', tone || 'chill');
    form.append('hashtags', hashtags || '');
    form.append('category', category || '');

    try {
      this.logger.log(`✨ [Stage 2] Enhancing caption: tone=${tone}, category=${category}`);

      const { data } = await this.ai.post('/generate-caption', form, {
        headers: form.getHeaders(),
      });

      this.logger.log(`✅ [Stage 2] Enhanced caption generated (${data.tone} tone, model: ${data.model_used})`);
      return data;
    } catch (err) {
      this.logger.error(`❌ [Stage 2] Caption enhancement failed:`, err instanceof Error ? err.message : err);

      if (axios.isAxiosError(err)) {
        if (err.response?.status === 400) {
          const detail = err.response.data?.detail || err.response.data?.error || 'Invalid request';
          throw new BadRequestException(detail);
        }

        if (err.response?.status === 503) {
          const detail = err.response.data?.detail || 'OpenRouter API not configured';
          throw new ServiceUnavailableException(detail);
        }

        const errorMsg = err.response?.data?.detail || err.response?.statusText || 'Unknown error';
        throw new ServiceUnavailableException(`AI caption service error: ${errorMsg}`);
      }

      if (err instanceof Error) {
        throw new ServiceUnavailableException(`Failed to connect to AI service: ${err.message}`);
      }

      throw new ServiceUnavailableException('AI caption service unavailable');
    }
  }

  /**
   * Save a generation record in MongoDB
   */
  async saveGeneration(dto: CreateGenerationDto): Promise<GenerationDocument> {
    try {
      this.logger.log(`💾 Saving generation to MongoDB: ${dto.imageFilename}`);
      const generation = new this.generationModel(dto);
      return await generation.save();
    } catch (error: any) {
      this.logger.error(`❌ Failed to save generation: ${error.message}`);
      throw new BadRequestException(`Failed to save generation: ${error.message}`);
    }
  }

  /**
   * Fetch all generations (newest first)
   */
  async getGenerations(): Promise<GenerationDocument[]> {
    try {
      this.logger.log(`🔍 Fetching all generations from MongoDB`);
      return await this.generationModel.find().sort({ createdAt: -1 }).exec();
    } catch (error: any) {
      this.logger.error(`❌ Failed to fetch generations: ${error.message}`);
      return [];
    }
  }

  /**
   * Fetch a single generation by ID
   */
  async getGeneration(id: string): Promise<GenerationDocument | null> {
    try {
      this.logger.log(`🔍 Fetching generation by ID: ${id}`);
      return await this.generationModel.findById(id).exec();
    } catch (error: any) {
      this.logger.error(`❌ Failed to fetch generation ${id}: ${error.message}`);
      return null;
    }
  }

  /**
   * Delete a generation by ID
   */
  async deleteGeneration(id: string): Promise<{ success: boolean }> {
    try {
      this.logger.log(`🗑️ Deleting generation from MongoDB: ${id}`);
      const result = await this.generationModel.findByIdAndDelete(id).exec();
      if (!result) {
        throw new BadRequestException(`Generation with ID ${id} not found`);
      }
      return { success: true };
    } catch (error: any) {
      this.logger.error(`❌ Failed to delete generation ${id}: ${error.message}`);
      throw new BadRequestException(`Failed to delete generation: ${error.message}`);
    }
  }
}
