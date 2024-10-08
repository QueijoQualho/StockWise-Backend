import { User } from "@model/userEntity";

export class UserResponseDTO {
  id: number;
  nome: string;
  email: string;
  role: string;

  constructor(user: User) {
    this.id = user.id;
    this.nome = user.nome;
    this.email = user.email;
    this.role = user.role;
  }
}
