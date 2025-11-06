import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Estimate } from './Estimate.js';

@Entity('estimate_items')
export class EstimateItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int', nullable: false })
  @Index()
  estimate_id!: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  description!: string;

  @Column({ type: 'int', nullable: false, default: 1 })
  quantity!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  unit_price!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  total!: number;

  @ManyToOne(() => Estimate, (estimate) => estimate.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'estimate_id' })
  estimate?: Estimate;
}
