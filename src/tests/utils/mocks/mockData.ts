import { Item, Status } from "@model/itemEntity";
import { Sala } from "@model/salaEntity";

export const mockItem: Item = {
  id: 1,
  externalId: 123,
  nome: "Item 1",
  dataDeIncorporacao: new Date(),
  status: Status.DISPONIVEL,
  url: "http://example.com/image.jpg",
  sala: { id: 1, nome: "Sala 1" } as Sala,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockRepositories = {
  item: {
    find: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    findAndCount: jest.fn(),
  },
  sala: { findOne: jest.fn() },
};

export const mockSala: Sala = {
  id: 1,
  localizacao: 101,
  nome: "Sala 101",
  quantidadeDeItens: 10,
  itens: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};
