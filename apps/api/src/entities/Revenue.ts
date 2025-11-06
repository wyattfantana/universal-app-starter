import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('revenue')
export class Revenue {
  @PrimaryGeneratedColumn()
  id!: number;

  // Multi-tenancy
  @Column({ type: 'varchar', length: 255, nullable: false })
  @Index()
  user_id!: string;

  @Column({ type: 'date', nullable: false })
  @Index() // Index for date-based queries (Issue #24)
  date!: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  amount!: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  source?: string;
}
