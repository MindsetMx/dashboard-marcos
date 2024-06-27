import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('compras') // Asegúrate de que el nombre de la tabla coincide
export class Compra {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  productos: string;

  @Column('varchar', { length: 255, nullable: true })
  descuento: string;

  @Column('varchar', { length: 255 })
  correo: string;

  @Column('varchar', { length: 255 })
  status: string;

  @Column('decimal', { precision: 10, scale: 0 })
  total: number;

  @Column('varchar', { length: 255, nullable: true })
  tracking: string;

  @Column('text')
  direccion: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
