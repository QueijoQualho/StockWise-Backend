import { ItemController } from "@controller/itemController";
import { ItemRepositoryType } from "@repository/itemRepository";
import { SalaRepositoryType } from "@repository/salaRepository";
import { FileService } from "@service/fileService";
import { ItemService } from "@service/itemService";
import { expectErrorHandling } from "@tests/utils/helpers/testUtils";
import { mockFileService, mockItem, mockRepositories } from "@tests/utils/mocks/mockData";
import { BadRequestError, NotFoundError, ServerError } from "@utils/errors";
import { Request, Response } from "express";

describe("ItemController", () => {
  let itemController: ItemController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let itemService: ItemService;


  beforeEach(() => {
    itemService = new ItemService(
      mockRepositories.item as unknown as ItemRepositoryType,
      mockFileService as unknown as FileService,
      mockRepositories.sala as unknown as SalaRepositoryType
    );

    itemController = new ItemController(itemService);
    req = { query: {}, params: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };

    jest.spyOn(itemService, 'getPaginatedItems').mockResolvedValue({
      data: [mockItem],
      totalItems: 1,
      totalPages: 1,
      currentPage: 1,
    });
    jest.spyOn(itemService, 'findOne').mockResolvedValue(mockItem);
    jest.spyOn(itemService, 'update').mockResolvedValue(undefined);
    jest.spyOn(itemService, 'delete').mockResolvedValue(undefined);
  });

  const callControllerMethod = async (
    controllerMethod: keyof ItemController,
    params: Partial<Request['params']> = {},
    body: Partial<Request['body']> = {}
  ) => {
    req.params = params;
    req.body = body;
    await itemController[controllerMethod](req as Request, res as Response);
  };

  const controllerToServiceMethodMap = {
    getItem: 'getPaginatedItems',
    getItemByID: 'findOne',
    updateItem: 'update',
    deleteItem: 'delete',
  };

  const runErrorTest = (
    controllerMethod: keyof ItemController,
    params: Partial<Request['params']>,
    mockError: Error,
    expectedStatus: number
  ) => {
    it(`deve retornar erro ${expectedStatus} em caso de erro no serviço para ${controllerMethod}`, async () => {
      const serviceMethod = controllerToServiceMethodMap[controllerMethod];

      jest.spyOn(itemService, serviceMethod as keyof ItemService).mockRejectedValue(mockError);

      await callControllerMethod(controllerMethod, params);
      expectErrorHandling( res,expectedStatus, mockError);
    });
  };


  describe("getItem", () => {
    it("deve retornar os itens paginados", async () => {
      const paginatedItems = {
        data: [mockItem],
        totalItems: 1,
        totalPages: 1,
        currentPage: 1,
      };

      jest.spyOn(itemService, 'getPaginatedItems').mockResolvedValue(paginatedItems);

      await itemController.getItem(req as Request, res as Response);

      expect(itemService.getPaginatedItems).toHaveBeenCalledWith({ page: 1, limit: 10 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(paginatedItems);
    });

    it("deve retornar status 204 se nenhum item for encontrado", async () => {
      jest.spyOn(itemService, 'getPaginatedItems').mockRejectedValue(new NotFoundError("No items found"));

      await itemController.getItem(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    runErrorTest('getItem', {}, new ServerError("Erro no serviço"), 500);
  });

  describe("getItemByID", () => {
    it("deve retornar o item pelo ID", async () => {
      await callControllerMethod('getItemByID', { id: "1" });
      expect(itemService.findOne).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockItem);
    });

    it("deve retornar erro 400 se o ID for inválido", async () => {
      const error = new BadRequestError('Invalid item ID', []);
      await callControllerMethod('getItemByID', { id: "abc" });
      expectErrorHandling(res, 400, error);
    });

    runErrorTest('getItemByID', { id: "1" }, new ServerError("Erro no serviço"), 500);
  });

  describe("updateItem", () => {
    it("deve atualizar o item com sucesso", async () => {
      await callControllerMethod('updateItem', { id: "1" }, { nome: "Item atualizado" });

      expect(itemService.update).toHaveBeenCalledWith(1, { nome: "Item atualizado" }, undefined);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it("deve retornar erro 400 se o ID for inválido", async () => {
      const error = new BadRequestError('Invalid item ID', []);
      await callControllerMethod('updateItem', { id: "abc" });
      expectErrorHandling(res, 400, error);
    });

    runErrorTest('updateItem', { id: "7" }, new NotFoundError("Item not found"), 404);
    runErrorTest('updateItem', { id: "1" }, new ServerError("Erro no serviço"), 500);
  });

  describe("deleteItem", () => {
    it("deve deletar o item com sucesso", async () => {
      await callControllerMethod('deleteItem', { id: "1" });
      expect(itemService.delete).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it("deve retornar erro 400 se o ID for inválido", async () => {
      const error = new BadRequestError('Invalid item ID', []);
      await callControllerMethod('deleteItem', { id: "abc" });
      expectErrorHandling(res, 400, error);
    });

    runErrorTest('deleteItem', { id: "4" }, new NotFoundError("Item not found"), 404);
    runErrorTest('deleteItem', { id: "1" }, new ServerError("Erro no serviço"), 500);
  });
});
