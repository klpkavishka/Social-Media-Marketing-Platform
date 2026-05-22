import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GenerationDocument = Generation & Document;

@Schema({ timestamps: true, collection: 'generations' })
export class Generation {
  @Prop({ required: true })
  imageFilename: string;

  @Prop()
  imageSize?: number;

  @Prop()
  platform?: string;

  // Stage 1 — ML Model results
  @Prop()
  mlCategory?: string;

  @Prop()
  mlConfidence?: number;

  @Prop()
  mlCaption?: string;

  @Prop([String])
  mlHashtags?: string[];

  // Stage 2 — AI Enhanced results
  @Prop()
  enhancedCaption?: string;

  @Prop([String])
  enhancedHashtags?: string[];

  @Prop()
  tone?: string;

  @Prop()
  modelUsed?: string;

  // Final — What the user actually used/edited
  @Prop()
  finalCaption?: string;

  @Prop([String])
  finalHashtags?: string[];

  @Prop({ default: false })
  published: boolean;

  @Prop()
  imageBase64?: string;
}

export const GenerationSchema = SchemaFactory.createForClass(Generation);

// Indexes for fast lookups
GenerationSchema.index({ createdAt: -1 });
GenerationSchema.index({ platform: 1, createdAt: -1 });
