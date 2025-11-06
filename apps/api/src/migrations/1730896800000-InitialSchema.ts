import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1730896800000 implements MigrationInterface {
  name = 'InitialSchema1730896800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create clients table
    await queryRunner.query(`
      CREATE TABLE "clients" (
        "id" SERIAL PRIMARY KEY,
        "user_id" VARCHAR(255) NOT NULL,
        "name" VARCHAR(255) NOT NULL,
        "email" VARCHAR(255),
        "phone" VARCHAR(50),
        "address" TEXT,
        "company" VARCHAR(255),
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_clients_user_id" ON "clients" ("user_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_clients_email" ON "clients" ("email")`);

    // Create estimates table
    await queryRunner.query(`
      CREATE TABLE "estimates" (
        "id" SERIAL PRIMARY KEY,
        "user_id" VARCHAR(255) NOT NULL,
        "client_id" INTEGER NOT NULL,
        "estimate_number" VARCHAR(50) NOT NULL UNIQUE,
        "status" VARCHAR(20) NOT NULL DEFAULT 'draft',
        "issue_date" DATE,
        "expiry_date" DATE,
        "total" DECIMAL(10,2) NOT NULL DEFAULT 0,
        "notes" TEXT,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
        CONSTRAINT "FK_estimates_client" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_estimates_user_id" ON "estimates" ("user_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_estimates_client_id" ON "estimates" ("client_id")`);

    // Create estimate_items table
    await queryRunner.query(`
      CREATE TABLE "estimate_items" (
        "id" SERIAL PRIMARY KEY,
        "estimate_id" INTEGER NOT NULL,
        "description" VARCHAR(255) NOT NULL,
        "quantity" INTEGER NOT NULL DEFAULT 1,
        "unit_price" DECIMAL(10,2) NOT NULL,
        "total" DECIMAL(10,2) NOT NULL,
        CONSTRAINT "FK_estimate_items_estimate" FOREIGN KEY ("estimate_id") REFERENCES "estimates"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_estimate_items_estimate_id" ON "estimate_items" ("estimate_id")`);

    // Create invoices table
    await queryRunner.query(`
      CREATE TABLE "invoices" (
        "id" SERIAL PRIMARY KEY,
        "user_id" VARCHAR(255) NOT NULL,
        "client_id" INTEGER NOT NULL,
        "invoice_number" VARCHAR(50) NOT NULL UNIQUE,
        "status" VARCHAR(20) NOT NULL DEFAULT 'draft',
        "issue_date" DATE,
        "due_date" DATE,
        "total" DECIMAL(10,2) NOT NULL DEFAULT 0,
        "paid_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
        "notes" TEXT,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
        CONSTRAINT "FK_invoices_client" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_invoices_user_id" ON "invoices" ("user_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_invoices_client_id" ON "invoices" ("client_id")`);

    // Create invoice_items table
    await queryRunner.query(`
      CREATE TABLE "invoice_items" (
        "id" SERIAL PRIMARY KEY,
        "invoice_id" INTEGER NOT NULL,
        "description" VARCHAR(255) NOT NULL,
        "quantity" INTEGER NOT NULL DEFAULT 1,
        "unit_price" DECIMAL(10,2) NOT NULL,
        "total" DECIMAL(10,2) NOT NULL,
        CONSTRAINT "FK_invoice_items_invoice" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_invoice_items_invoice_id" ON "invoice_items" ("invoice_id")`);

    // Create products table
    await queryRunner.query(`
      CREATE TABLE "products" (
        "id" SERIAL PRIMARY KEY,
        "user_id" VARCHAR(255) NOT NULL,
        "name" VARCHAR(255) NOT NULL,
        "description" TEXT,
        "sku" VARCHAR(100),
        "price" DECIMAL(10,2) NOT NULL,
        "category" VARCHAR(50),
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_products_user_id" ON "products" ("user_id")`);

    // Create revenue table
    await queryRunner.query(`
      CREATE TABLE "revenue" (
        "id" SERIAL PRIMARY KEY,
        "user_id" VARCHAR(255) NOT NULL,
        "date" DATE NOT NULL,
        "amount" DECIMAL(10,2) NOT NULL,
        "source" VARCHAR(100)
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_revenue_user_id" ON "revenue" ("user_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_revenue_date" ON "revenue" ("date")`);

    // Create settings table
    await queryRunner.query(`
      CREATE TABLE "settings" (
        "id" SERIAL PRIMARY KEY,
        "user_id" VARCHAR(255) NOT NULL UNIQUE,
        "company_name" VARCHAR(255),
        "company_address" TEXT,
        "company_email" VARCHAR(255),
        "company_phone" VARCHAR(50),
        "tax_number" VARCHAR(100),
        "currency" VARCHAR(10) DEFAULT 'USD',
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_settings_user_id" ON "settings" ("user_id")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "settings"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "revenue"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "products"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "invoice_items"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "invoices"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "estimate_items"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "estimates"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "clients"`);
  }
}
