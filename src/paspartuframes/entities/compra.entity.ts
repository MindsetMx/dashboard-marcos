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
  nombre: string; // Asegúrate de incluir el campo nombre

  @Column('varchar', { length: 255 })
  status: string;

  @Column('double', { precision: 8, scale: 2 }) // Ajuste de precisión y escala
  total: number;

  @Column('varchar', { length: 255, nullable: true })
  tracking: string;

  @Column('text', { nullable: true })
  direccion: string;

  @Column('date', { nullable: true })
  fecha: Date; // Agregar la columna fecha

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
