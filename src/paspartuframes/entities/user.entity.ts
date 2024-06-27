import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users') // Asegúrate de que el nombre de la tabla coincide
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255 })
  name: string;

  @Column('varchar', { length: 255, unique: true })
  email: string;

  @Column('timestamp', { nullable: true })
  email_verified_at: Date;

  @Column('varchar', { length: 255 })
  password: string;

  @Column('varchar', { length: 100, nullable: true })
  remember_token: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
