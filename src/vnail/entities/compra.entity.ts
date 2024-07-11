import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('pedidos')
export class Compra {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  estatus_id: number;

  @Column('json')
  resumen: object;

  @Column('json')
  direccion: object;

  @Column('double', { precision: 8, scale: 2 })
  subtotal: number;

  @Column('double', { precision: 8, scale: 2 })
  envio: number;

  @Column('double', { precision: 8, scale: 2 })
  total: number;

  @Column({ length: 255 })
  metodo: string;

  @Column({ length: 255 })
  paqueteria: string;

  @Column({ length: 255 })
  descuento: string;

  @Column('double', { precision: 8, scale: 2 })
  descuentoValor: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column('text')
  oxxo: string;

  @Column({ length: 255 })
  guia: string;

  @Column('tinyint')
  factura: boolean;

  @Column('json')
  datosPago: object;
}
