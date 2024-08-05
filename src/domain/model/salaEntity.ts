import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Item } from "./itemEntity"

@Entity('sala')
export class Sala {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: "localizacao" })
  localizacao: string

  @Column({ name: "quantidade" })
  quantidade: number

  @OneToMany(() => Item, item => item.sala)
  items: Item[]

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
