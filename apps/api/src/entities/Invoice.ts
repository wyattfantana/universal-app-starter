import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { Client } from './Client.js';
import { InvoiceItem } from './InvoiceItem.js';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn()
  id!: number;

  // Multi-tenancy
  @Column({ type: 'varchar', length: 255, nullable: false })
  @Index()
  user_id!: string;

  @Column({ type: 'int', nullable: false })
  @Index()
  client_id!: number;

  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  invoice_number!: string;

  @Column({ type: 'varchar', length: 20, nullable: false, default: 'draft' })
  status!: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

  @Column({ type: 'date', nullable: true })
  issue_date?: Date;

  @Column({ type: 'date', nullable: true })
  due_date?: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false, default: 0 })
  total!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false, default: 0 })
  paid_amount!: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at!: Date;

  // Relations
  @ManyToOne(() => Client, (client) => client.invoices)
  @JoinColumn({ name: 'client_id' })
  client?: Client;

  @OneToMany(() => InvoiceItem, (item) => item.invoice, { cascade: true })
  items?: InvoiceItem[];
}
