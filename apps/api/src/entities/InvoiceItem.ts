import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Invoice } from './Invoice.js';

@Entity('invoice_items')
export class InvoiceItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int', nullable: false })
  @Index()
  invoice_id!: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  description!: string;

  @Column({ type: 'int', nullable: false, default: 1 })
  quantity!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  unit_price!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  total!: number;

  @ManyToOne(() => Invoice, (invoice) => invoice.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'invoice_id' })
  invoice?: Invoice;
}
