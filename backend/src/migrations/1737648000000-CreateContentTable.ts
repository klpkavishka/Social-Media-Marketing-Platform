import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateContentTable1737648000000 implements MigrationInterface {
  name = 'CreateContentTable1737648000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create campaign status enum
    await queryRunner.query(`
      CREATE TYPE "campaign_status_enum" AS ENUM ('draft', 'active', 'paused', 'completed');
    `);

    // Create social platform enum
    await queryRunner.query(`
      CREATE TYPE "social_platform_enum" AS ENUM ('instagram', 'facebook', 'tiktok', 'linkedin', 'youtube', 'twitter');
    `);

    // Create campaigns table (before content because content references it)
    await queryRunner.query(`
      CREATE TABLE "campaigns" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" varchar NOT NULL,
        "description" text,
        "goals" jsonb,
        "status" "campaign_status_enum" NOT NULL DEFAULT 'draft',
        "startDate" TIMESTAMP,
        "endDate" TIMESTAMP,
        "budget" numeric DEFAULT 0,
        "spend" numeric DEFAULT 0,
        "platforms" text,
        "targetAudience" jsonb,
        "targeting" jsonb,
        "impressions" integer DEFAULT 0,
        "clicks" integer DEFAULT 0,
        "engagements" integer DEFAULT 0,
        "conversions" integer DEFAULT 0,
        "reach" integer DEFAULT 0,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    // Create indexes for campaigns
    await queryRunner.query(`
      CREATE INDEX "IDX_campaign_status" ON "campaigns" ("status")
    `);

    // Create content status enum
    await queryRunner.query(`
      CREATE TYPE "content_status_enum" AS ENUM ('draft', 'scheduled', 'published', 'failed');
    `);

    // Create content type enum
    await queryRunner.query(`
      CREATE TYPE "content_type_enum" AS ENUM ('post', 'story', 'reel', 'video', 'image');
    `);

    // Create contents table
    await queryRunner.query(`
      CREATE TABLE "contents" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "title" varchar NOT NULL,
        "body" text NOT NULL,
        "type" "content_type_enum" NOT NULL DEFAULT 'post',
        "status" "content_status_enum" NOT NULL DEFAULT 'draft',
        "media" jsonb,
        "platforms" jsonb,
        "scheduledDate" TIMESTAMP,
        "publishedDate" TIMESTAMP,
        "aiSuggestions" jsonb,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    // Create indexes for better query performance
    await queryRunner.query(`
      CREATE INDEX "IDX_content_status" ON "contents" ("status")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_content_type" ON "contents" ("type")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_content_scheduledDate" ON "contents" ("scheduledDate")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_content_createdAt" ON "contents" ("createdAt")
    `);

    // Create campaign_contents junction table
    await queryRunner.query(`
      CREATE TABLE "campaign_contents" (
        "campaignId" uuid NOT NULL,
        "contentId" uuid NOT NULL,
        CONSTRAINT "PK_campaign_contents" PRIMARY KEY ("campaignId", "contentId"),
        CONSTRAINT "FK_campaign_contents_campaign" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "FK_campaign_contents_content" FOREIGN KEY ("contentId") REFERENCES "contents"("id") ON DELETE CASCADE ON UPDATE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_campaign_contents_campaign_id" ON "campaign_contents" ("campaignId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_campaign_contents_content_id" ON "campaign_contents" ("contentId")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop campaign_contents junction table
    await queryRunner.query(`DROP INDEX "IDX_campaign_contents_content_id"`);
    await queryRunner.query(`DROP INDEX "IDX_campaign_contents_campaign_id"`);
    await queryRunner.query(`DROP TABLE "campaign_contents"`);

    // Drop content indexes
    await queryRunner.query(`DROP INDEX "IDX_content_createdAt"`);
    await queryRunner.query(`DROP INDEX "IDX_content_scheduledDate"`);
    await queryRunner.query(`DROP INDEX "IDX_content_type"`);
    await queryRunner.query(`DROP INDEX "IDX_content_status"`);

    // Drop contents table
    await queryRunner.query(`DROP TABLE "contents"`);

    // Drop campaign indexes
    await queryRunner.query(`DROP INDEX "IDX_campaign_status"`);

    // Drop campaigns table
    await queryRunner.query(`DROP TABLE "campaigns"`);

    // Drop enums
    await queryRunner.query(`DROP TYPE "content_type_enum"`);
    await queryRunner.query(`DROP TYPE "content_status_enum"`);
    await queryRunner.query(`DROP TYPE "social_platform_enum"`);
    await queryRunner.query(`DROP TYPE "campaign_status_enum"`);
  }
}

