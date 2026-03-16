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

  it('should call service.create with correct data', async () => {
    const dto = { name: 'Tournoi test', date: '2026-03-20', description: 'Desc' };
    await controller.create(dto as any);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return an array of tournaments', async () => {
    const result = await controller.findAll();
    expect(result).toBeInstanceOf(Array);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should call service.findOne with the correct ID', async () => {
    await controller.findOne(1);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should update a tournament', async () => {
    const updateDto = { name: 'Tournoi mis à Jour' };
    const result = await controller.update(1, updateDto);

    expect(result.name).toEqual('Tournoi mis à Jour');
    expect(service.update).toHaveBeenCalledWith(1, updateDto);
  });

  it('should call service.remove with the correct ID', async () => {
    await controller.remove(1);
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});