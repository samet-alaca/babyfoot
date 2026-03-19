import { Test, TestingModule } from '@nestjs/testing';
import { TournamentsController } from './tournaments.controller';
import { TournamentsService } from './tournaments.service';

describe('TournamentsController', () => {
  let controller: TournamentsController;
  let service: TournamentsService;

  const mockTournamentsService = {
    create: jest.fn(dto => ({ id: 1, ...dto })),
    findAll: jest.fn(() => [{ id: 1, name: 'Tournoi Test' }]),
    findOne: jest.fn(id => ({ id, name: 'Tournoi Test' })),
    update: jest.fn((id, dto) => ({ id, ...dto })),
    remove: jest.fn(() => Promise.resolve()),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TournamentsController],
      providers: [
        {
          provide: TournamentsService,
          useValue: mockTournamentsService,
        },
      ],
    }).compile();

    controller = module.get<TournamentsController>(TournamentsController);
    service = module.get<TournamentsService>(TournamentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return the new tournament', async () => {
      const dto = { name: 'Tournoi Test', date: '2026-06-01', description: 'Test' };
      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ id: 1, ...dto });
    });
  });

  describe('findAll', () => {
    it('should return an array of tournaments', async () => {
      const result = await controller.findAll();
      
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([{ id: 1, name: 'Tournoi Test' }]);
    });
  });

  describe('findOne', () => {
    it('should return a single tournament by id', async () => {
      const id = 1;
      const result = await controller.findOne(id);
      
      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual({ id, name: 'Tournoi Test' });
    });
  });

  describe('update', () => {
    it('should update a tournament and return the updated tournament', async () => {
      const id = 1;
      const dto = { name: 'Tournoi Mis à Jour' };
      const result = await controller.update(id, dto);

      expect(service.update).toHaveBeenCalledWith(id, dto);
      expect(result).toEqual({ id, ...dto });
    });
  });

  describe('remove', () => {
    it('should call service.remove with the correct id', async () => {
      const id = 1;
      const result = await controller.remove(id);

      expect(service.remove).toHaveBeenCalledWith(id);
      expect(result).toBeUndefined();
    });
  });
});