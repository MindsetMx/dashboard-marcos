import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectConnection('paspartuframesConnection') private readonly paspartuframesConnection: Connection,
    @InjectConnection('enmarktConnection') private readonly enmarktConnection: Connection,
  ) {}

  async getFrameitData() {
    return this.connection.query('SELECT * FROM compras');
  }

  async getPaspartuframesData() {
    return this.paspartuframesConnection.query('SELECT * FROM compras');
  }

  async getEnmarktData() {
    return this.enmarktConnection.query('SELECT * FROM ventas');
  }
}
