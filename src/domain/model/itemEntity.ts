import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { Sala } from "./salaEntity";

@Entity("items")
export class Item {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ name: "nome" })
  nome: string;

  @Column({ name: "data_de_incorporacao" })
  dataDeIncorporacao: Date;

  @ManyToOne(() => Sala, (sala) => sala.items, { nullable: true })
  sala?: Sala;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;
}
