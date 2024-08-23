import {
  AfterLoad,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { Item } from "./itemEntity";

@Entity("sala")
export class Sala {
  @PrimaryColumn({ name: "localizacao" })
  localizacao: number;

  @Column({ name: "nome" })
  nome: string;

  @Column({ name: "quantidadeDeItens", default: 0 })
  quantidadeDeItens: number;

  @OneToMany(() => Item, (item) => item.sala)
  items?: Item[];

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  @AfterLoad()
  private updateQuantidadeDeItens() {
    if (this.items) {
      this.quantidadeDeItens = this.items.length;
    }
  }
}
