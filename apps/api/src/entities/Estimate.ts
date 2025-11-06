import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { Client } from './Client.js';
import { EstimateItem } from './EstimateItem.js';

@Entity('estimates')
export class Estimate {
  @PrimaryGeneratedColumn()
  id!: number;

  // Multi-tenancy
  @Column({ type: 'varchar', length: 255, nullable: false })
  @Index()
  user_id!: string;

  @Column({ type: 'int', nullable: false })
  @Index() // Index for foreign key (Issue #24)
  client_id!: number;

  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  estimate_number!: string;

  @Column({ type: 'varchar', length: 20, nullable: false, default: 'draft' })
  status!: 'draft' | 'sent' | 'accepted' | 'rejected';

  @Column({ type: 'date', nullable: true })
  issue_date?: Date;

  @Column({ type: 'date', nullable: true })
  expiry_date?: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false, default: 0 })
  total!: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at!: Date;

  // Relations
  @ManyToOne(() => Client, (client) => client.estimates)
  @JoinColumn({ name: 'client_id' })
  client?: Client;

  @OneToMany(() => EstimateItem, (item) => item.estimate, { cascade: true })
  items?: EstimateItem[];
}
