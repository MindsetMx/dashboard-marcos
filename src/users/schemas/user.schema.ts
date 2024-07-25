// user.schema.ts
import { Schema } from 'mongoose';

export const UserSchema = new Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  tipo: { type: String, required: true },
  acceso: { type: [String], required: true },
});
