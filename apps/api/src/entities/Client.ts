import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, OneToMany } from 'typeorm';
import { Estimate } from './Estimate.js';
import { Invoice } from './Invoice.js';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn()
  id!: number;

  // Multi-tenancy: Every client belongs to a user (Issue #2)
  @Column({ type: 'varchar', length: 255, nullable: false })
  @Index() // Index for faster queries
  user_id!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Index() // Index for email searches (Issue #24)
  email?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  phone?: string;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  company?: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at!: Date;

  // Relations
  @OneToMany(() => Estimate, (estimate) => estimate.client)
  estimates?: Estimate[];

  @OneToMany(() => Invoice, (invoice) => invoice.client)
  invoices?: Invoice[];
}
