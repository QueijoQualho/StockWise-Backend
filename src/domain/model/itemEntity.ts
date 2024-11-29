import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Sala } from "./salaEntity";
import { Status } from "./enum/status";

@Entity("itens")
export class Item {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ name: "external_id", nullable: true })
  externalId?: number;

  @Column({ name: "nome" })
  nome: string;

  @Column({ name: "data_de_incorporacao", type: "date" })
  dataDeIncorporacao: Date;

  @Column({
    type: "enum",
    enum: Status,
    default: Status.DISPONIVEL,
  })
  status: Status;

  @Column({ nullable: true })
  url?: string;

  @ManyToOne(() => Sala, (sala) => sala.itens)
  sala: Sala;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;
}
