import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('visualizaciones_cotizadors')
export class VisualizacionCotizador {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'longtext' })
  datos_consulta: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
