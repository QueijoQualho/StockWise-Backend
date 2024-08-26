import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Sala } from "./salaEntity";

export enum Status {
  DISPONIVEL = "Disponivel",
  BAIXA = "Baixa",
  EM_MANUTENCAO = "Em manutenção",
}

@Entity("items")
export class Item {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ name: "nome" })
  nome: string;

  @Column({ name: "data_de_incorporacao" })
  dataDeIncorporacao: Date;

  @Column({
    type: "enum",
    enum: Status,
    default: Status.DISPONIVEL,
  })
  status: Status;

  @Column({ nullable: true })
  url?: string;

  @ManyToOne(() => Sala, (sala) => sala.items, { nullable: true })
  sala?: Sala;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;
}
