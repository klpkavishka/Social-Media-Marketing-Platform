import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1737561600000 implements MigrationInterface {
  name = 'InitialSchema1737561600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create permissions table
    await queryRunner.query(`
      CREATE TABLE "permissions" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" varchar NOT NULL UNIQUE,
        "description" varchar NOT NULL,
        "resource" varchar NOT NULL,
        "action" varchar NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    // Create roles table
    await queryRunner.query(`
      CREATE TABLE "roles" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" varchar NOT NULL UNIQUE,
        "description" varchar NOT NULL,
        "level" integer NOT NULL DEFAULT 1,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    // Create users table
    await queryRunner.query(`
      CREATE TYPE "user_role_enum" AS ENUM ('super_admin', 'marketing_admin', 'department_coordinator', 'content_creator', 'viewer');
      CREATE TYPE "user_status_enum" AS ENUM ('active', 'inactive', 'suspended', 'pending');
      
      CREATE TABLE "users" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "firstName" varchar NOT NULL,
        "lastName" varchar NOT NULL,
        "email" varchar NOT NULL UNIQUE,
        "password" varchar NOT NULL,
        "role" "user_role_enum" NOT NULL DEFAULT 'content_creator',
        "status" "user_status_enum" NOT NULL DEFAULT 'active',
        "universityName" varchar,
        "department" varchar,
        "jobTitle" varchar,
        "phoneNumber" varchar,
        "avatarUrl" varchar,
        "refreshToken" varchar,
        "lastLoginAt" TIMESTAMP,
        "isEmailVerified" boolean NOT NULL DEFAULT true,
        "emailVerificationToken" varchar,
        "passwordResetToken" varchar,
        "passwordResetExpires" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    // Create index on email
    await queryRunner.query(`
      CREATE INDEX "IDX_user_email" ON "users" ("email")
    `);

    // Create role_permissions junction table
    await queryRunner.query(`
      CREATE TABLE "role_permissions" (
        "role_id" uuid NOT NULL,
        "permission_id" uuid NOT NULL,
        CONSTRAINT "PK_role_permissions" PRIMARY KEY ("role_id", "permission_id"),
        CONSTRAINT "FK_role" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_permission" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE
      )
    `);

    // Create user_roles junction table
    await queryRunner.query(`
      CREATE TABLE "user_roles" (
        "user_id" uuid NOT NULL,
        "role_id" uuid NOT NULL,
        CONSTRAINT "PK_user_roles" PRIMARY KEY ("user_id", "role_id"),
        CONSTRAINT "FK_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_role_user" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE
      )
    `);

    // Create user_permissions junction table
    await queryRunner.query(`
      CREATE TABLE "user_permissions" (
        "user_id" uuid NOT NULL,
        "permission_id" uuid NOT NULL,
        CONSTRAINT "PK_user_permissions" PRIMARY KEY ("user_id", "permission_id"),
        CONSTRAINT "FK_user_perm" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_permission_user" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE
      )
    `);

    // Seed initial permissions
    await queryRunner.query(`
      INSERT INTO "permissions" ("name", "description", "resource", "action") VALUES
        ('create_content', 'Create new content', 'content', 'create'),
        ('read_content', 'View content', 'content', 'read'),
        ('update_content', 'Edit content', 'content', 'update'),
        ('delete_content', 'Delete content', 'content', 'delete'),
        ('publish_content', 'Publish content', 'content', 'publish'),
        ('approve_content', 'Approve content for publishing', 'content', 'approve'),
        ('manage_users', 'Manage user accounts', 'users', 'manage'),
        ('view_analytics', 'View analytics and reports', 'analytics', 'read'),
        ('manage_campaigns', 'Manage marketing campaigns', 'campaigns', 'manage'),
        ('manage_social_accounts', 'Connect and manage social accounts', 'social', 'manage')
    `);

    // Seed initial roles
    await queryRunner.query(`
      INSERT INTO "roles" ("name", "description", "level") VALUES
        ('Super Admin', 'Full system access', 1),
        ('Marketing Admin', 'Manage marketing operations', 2),
        ('Department Coordinator', 'Coordinate department content', 3),
        ('Content Creator', 'Create and manage content', 4),
        ('Viewer', 'View-only access', 5)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user_permissions"`);
    await queryRunner.query(`DROP TABLE "user_roles"`);
    await queryRunner.query(`DROP TABLE "role_permissions"`);
    await queryRunner.query(`DROP INDEX "IDX_user_email"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "user_status_enum"`);
    await queryRunner.query(`DROP TYPE "user_role_enum"`);
    await queryRunner.query(`DROP TABLE "roles"`);
    await queryRunner.query(`DROP TABLE "permissions"`);
  }
}
