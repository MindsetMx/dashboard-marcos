import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ventas')
export class Venta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  cliente: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'timestamp' })
  fechaPedido: Date;

  @Column({ type: 'timestamp', nullable: true })
  fechaEnvio: Date;

  @Column({ type: 'varchar', length: 255 })
  calleynumero: string;

  @Column({ type: 'varchar', length: 255 })
  referencia: string;

  @Column({ type: 'varchar', length: 255 })
  colonia: string;

  @Column({ type: 'varchar', length: 10 })
  cp: string;

  @Column({ type: 'varchar', length: 255 })
  municipio_ciudad: string;

  @Column({ type: 'varchar', length: 255 })
  estado: string;

  @Column({ type: 'varchar', length: 15 })
  notel: string;

  @Column({ type: 'text' })
  productos: string;

  @Column({ type: 'varchar', length: 50 })
  noRastreo: string;

  @Column({ type: 'int' })
  estadoProducto: number;

  @Column({ type: 'boolean' })
  esRegalo: boolean;

  @Column({ type: 'varchar', length: 255 })
  recibe: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  telRecibe: string;

  @Column({ type: 'text', nullable: true })
  dedicatoria: string;

  @Column({ type: 'varchar', length: 255 })
  cupon: string;

  @Column({ type: 'boolean' })
  entregado: boolean;

  @Column({ type: 'varchar', length: 50 })
  metodo_pago: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  oxxoPago: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  kueskiPago: string;

  @Column({ type: 'timestamp' })
  actualizado: Date;
}
