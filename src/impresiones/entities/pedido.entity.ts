import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('pedidos')
export class Pedido {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  correo: string;

  @Column()
  nombre: string;

  @Column()
  telefono: string;

  @Column('text')
  direccion: string;

  @Column('text')
  carrito: string;

  @Column('double', { precision: 8, scale: 2, nullable: true })
  descuento: number;

  @Column('double', { precision: 8, scale: 2 })
  envio: number;

  @Column('text', { nullable: true })
  empaque: string;

  @Column('double', { precision: 8, scale: 2 })
  subtotal: number;

  @Column('double', { precision: 8, scale: 2 })
  total: number;

  @Column()
  estatus_pedido: string;

  @Column()
  id_payment: string;

  @Column()
  pedido_mm: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
