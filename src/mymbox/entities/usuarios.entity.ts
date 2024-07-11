import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ type: 'timestamp', nullable: true })
  email_verified_at: Date;

  @Column()
  password: string;

  @Column('text', { nullable: true })
  two_factor_secret: string;

  @Column('text', { nullable: true })
  two_factor_recovery_codes: string;

  @Column({ type: 'timestamp', nullable: true })
  two_factor_confirmed_at: Date;

  @Column('longtext', { nullable: true })
  jsonData: string;

  @Column({ nullable: true })
  remember_token: string;

  @Column({ type: 'bigint', nullable: true })
  current_team_id: number;

  @Column({ type: 'varchar', length: 2048, nullable: true })
  profile_photo_path: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
