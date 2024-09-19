import { SalaController } from "@controller/salaController";
import { SalaRepositoryType } from "@repository/salaRepository";
import { SalaService } from "@service/salaService";
import { expectErrorHandling } from "@tests/utils/helpers/testUtils";
import {
  mockSala,
  mockRepositories,
  mockItem,
} from "@tests/utils/mocks/mockData";
import { BadRequestError, NotFoundError, ServerError } from "@utils/errors";
import { Pageable } from "@utils/interfaces";
import { Request, Response } from "express";

describe("SalaController", () => {
  let salaController: SalaController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let salaService: SalaService;

  beforeEach(() => {
    salaService = new SalaService(
      mockRepositories.sala as unknown as SalaRepositoryType,
    );

    salaController = new SalaController(salaService);
    req = { query: {}, params: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };

    jest.spyOn(salaService, "getPaginatedSalas").mockResolvedValue({
      data: [mockSala],
      totalItems: 1,
      totalPages: 1,
      currentPage: 1,
    });
    jest.spyOn(salaService, "findOne").mockResolvedValue(mockSala);
    jest.spyOn(salaService, "update").mockResolvedValue(undefined);
    jest.spyOn(salaService, "delete").mockResolvedValue(undefined);
    jest
      .spyOn(salaService, "getPaginatedItensSala")
      .mockResolvedValue({
        data: [],
        totalItems: 0,
        totalPages: 1,
        currentPage: 1,
      });
  });

  const callControllerMethod = async (
    controllerMethod: keyof SalaController,
    params: Partial<Request["params"]> = {},
    body: Partial<Request["body"]> = {},
  ) => {
    req.params = params;
    req.body = body;
    await salaController[controllerMethod](req as Request, res as Response);
  };

  const controllerToServiceMethodMap = {
    getSala: "getPaginatedSalas",
    getSalaByID: "findOne",
    updateSala: "update",
    deleteSala: "delete",
    getItensSala: "getPaginatedItensSala",
  };

  const runErrorTest = (
    controllerMethod: keyof SalaController,
    params: Partial<Request["params"]>,
    mockError: Error,
    expectedStatus: number,
  ) => {
    it(`deve retornar erro ${expectedStatus} em caso de erro no serviço para ${controllerMethod}`, async () => {
      const serviceMethod = controllerToServiceMethodMap[controllerMethod];

      jest
        .spyOn(salaService, serviceMethod as keyof SalaService)
        .mockRejectedValue(mockError);

      await callControllerMethod(controllerMethod, params);
      expectErrorHandling(res, expectedStatus, mockError);
    });
  };

  describe("getSala", () => {
    it("deve retornar as salas paginadas", async () => {
      const paginatedSalas = {
        data: [mockSala],
        totalItems: 1,
        totalPages: 1,
        currentPage: 1,
      };

      jest
        .spyOn(salaService, "getPaginatedSalas")
        .mockResolvedValue(paginatedSalas);

      await callControllerMethod("getSala");

      expect(salaService.getPaginatedSalas).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(paginatedSalas);
    });

    runErrorTest("getSala", {}, new ServerError("Erro no serviço"), 500);
  });

  describe("getSalaByID", () => {
    it("deve retornar a sala pelo ID", async () => {
      await callControllerMethod("getSalaByID", { id: "1" });
      expect(salaService.findOne).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockSala);
    });

    it("deve retornar erro 400 se o ID for inválido", async () => {
      const error = new BadRequestError("Invalid sala ID", []);
      await callControllerMethod("getSalaByID", { id: "abc" });
      expectErrorHandling(res, 400, error);
    });

    runErrorTest(
      "getSalaByID",
      { id: "1" },
      new ServerError("Erro no serviço"),
      500,
    );
  });

  describe("updateSala", () => {
    it("deve atualizar a sala com sucesso", async () => {
      await callControllerMethod(
        "updateSala",
        { id: "1" },
        { nome: "Sala atualizada" },
      );

      expect(salaService.update).toHaveBeenCalledWith(1, {
        nome: "Sala atualizada",
      });
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it("deve retornar erro 400 se o ID for inválido", async () => {
      const error = new BadRequestError("Invalid sala ID", []);
      await callControllerMethod("updateSala", { id: "abc" });
      expectErrorHandling(res, 400, error);
    });

    runErrorTest(
      "updateSala",
      { id: "7" },
      new NotFoundError("Sala not found"),
      404,
    );
    runErrorTest(
      "updateSala",
      { id: "1" },
      new ServerError("Erro no serviço"),
      500,
    );
  });

  describe("deleteSala", () => {
    it("deve deletar a sala com sucesso", async () => {
      await callControllerMethod("deleteSala", { id: "1" });
      expect(salaService.delete).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it("deve retornar erro 400 se o ID for inválido", async () => {
      const error = new BadRequestError("Invalid sala ID", []);
      await callControllerMethod("deleteSala", { id: "abc" });
      expectErrorHandling(res, 400, error);
    });

    runErrorTest(
      "deleteSala",
      { id: "4" },
      new NotFoundError("Sala not found"),
      404,
    );
    runErrorTest(
      "deleteSala",
      { id: "1" },
      new ServerError("Erro no serviço"),
      500,
    );
  });

  describe("getItensSala", () => {
    it("deve retornar os itens da sala", async () => {
      const mockResponse: Pageable<any> = {
        data: [mockItem],
        totalItems: 1,
        totalPages: 1,
        currentPage: 1,
      };

      req.params = { id: "1" };

      jest
        .spyOn(salaService, "getPaginatedItensSala")
        .mockResolvedValue(mockResponse);

      await salaController.getItensSala(req as Request, res as Response);

      expect(salaService.getPaginatedItensSala).toHaveBeenCalledWith(1, {
        page: 1,
        limit: 10,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResponse);
    });

    it("deve retornar erro 400 se a localização da sala for inválida", async () => {
      const error = new BadRequestError("Invalid sala ID", []);
      await salaController.getItensSala(req as Request, res as Response);
      expectErrorHandling(res, 400, error);
    });

    runErrorTest(
      "getItensSala",
      { id: "1" },
      new NotFoundError("Sala not found"),
      404,
    );
    runErrorTest(
      "getItensSala",
      { id: "1" },
      new ServerError("Erro no serviço"),
      500,
    );
  });
});
