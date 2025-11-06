import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('settings')
export class Settings {
  @PrimaryGeneratedColumn()
  id!: number;

  // Multi-tenancy: Each user has their own settings
  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  @Index()
  user_id!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  company_name?: string;

  @Column({ type: 'text', nullable: true })
  company_address?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  company_email?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  company_phone?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  tax_number?: string;

  @Column({ type: 'varchar', length: 10, nullable: true, default: 'USD' })
  currency?: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at!: Date;
}
