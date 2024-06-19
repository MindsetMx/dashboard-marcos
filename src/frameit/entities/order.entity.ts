import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  direccion: string;

  @Column('double', { precision: 8, scale: 2 })
  total: number;

  @Column('text')
  productos: string;

  @Column('text')
  tracking: string;

  @Column('date')
  fecha: Date;

  @Column('varchar', { length: 255 })
  status: string;

  @Column('varchar', { length: 255 })
  nombreC: string;

  @Column('varchar', { length: 15 })
  cel: string;

  @Column('varchar', { length: 255 })
  correo: string;

  @Column('varchar', { length: 255 })
  descuento: string;

  @Column('text')
  caja: string;

  @Column('float')
  especial: number;

  @Column('varchar', { length: 255 })
  tipo: string;
}
