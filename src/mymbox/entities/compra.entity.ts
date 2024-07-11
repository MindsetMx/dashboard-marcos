import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('compras')
export class Compra {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  email: string;

  @Column('longtext')
  productos: string;

  @Column('longtext')
  informacion_envio: string;

  @Column('longtext')
  status_pago: string;

  @Column('longtext')
  direccion: string;

  @Column('double', { precision: 8, scale: 2 })
  total: number;

  @Column()
  estatus_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
