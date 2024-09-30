import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { UserRole } from './enum/roles';

@Entity("usuarios")
export class User {

  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  nome: string;

  @Column({ unique: true })
  email: string;

  @Column()
  senha: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER
  })
  role: UserRole;
}
