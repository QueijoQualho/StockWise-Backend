import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Sala } from "./salaEntity";

@Entity("Relatorios")
export class Relatorio {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  nome: string;

  @Column()
  url: string;

  @ManyToOne(() => Sala, (sala) => sala.relatorios, { onDelete: 'CASCADE' })
  sala: Sala;

  @CreateDateColumn({ name: 'data_criacao' })
  dataCriacao: Date;
}
