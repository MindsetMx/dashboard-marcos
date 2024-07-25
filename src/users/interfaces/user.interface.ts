// user.interface.ts
import { Document } from 'mongoose';

export interface User extends Document {
  nombre: string;
  correo: string;
  password: string;
  tipo: string;
  acceso: string[];
}
