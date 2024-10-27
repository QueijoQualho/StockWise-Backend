import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Item } from "./itemEntity";
import { Relatorio } from "./relatorioEntity";

@Entity("salas")
export class Sala {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ name: "localizacao", unique: true })
  localizacao: number;

  @Column({ name: "nome" })
  nome: string;

  @Column({ name: "qtd_itens", default: 0 })
  quantidadeDeItens: number;

  @OneToMany(() => Item, (item) => item.sala)
  itens: Item[];

  @OneToMany(() => Relatorio, (documento) => documento.sala)
  relatorios: Relatorio[];

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;
}
