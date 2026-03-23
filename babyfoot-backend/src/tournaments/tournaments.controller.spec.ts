import { Test, TestingModule } from '@nestjs/testing';
import { TournamentsController } from './tournaments.controller';
import { TournamentsService } from './tournaments.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('TournamentsController', () => {
  let controller: TournamentsController;
  let service: TournamentsService;

  const mockTournament = {
    id: 1,
    name: 'Summer Cup',
    date: '2026-06-01',
    status: 'PENDING',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TournamentsController],
      providers: [
        {
          provide: TournamentsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            closeTournament: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TournamentsController>(TournamentsController);
    service = module.get<TournamentsService>(TournamentsService);
  });

  describe('create', () => {
    it('should call service.create and return a tournament', async () => {
      const dto: CreateTournamentDto = {
        name: 'Summer Cup',
        date: '2026-06-01',
      };
      jest.spyOn(service, 'create').mockResolvedValue(mockTournament as any);

      expect(await controller.create(dto)).toBe(mockTournament);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll and return an array', async () => {
      const result = [mockTournament];
      jest.spyOn(service, 'findAll').mockResolvedValue(result as any);

      expect(await controller.findAll()).toBe(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call service.findOne and return a tournament', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockTournament as any);

      expect(await controller.findOne(1)).toBe(mockTournament);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if tournament is not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());
      await expect(controller.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should call service.update and return updated tournament', async () => {
      const dto: UpdateTournamentDto = { name: 'Updated Name' };
      const result = { ...mockTournament, ...dto };
      jest.spyOn(service, 'update').mockResolvedValue(result as any);

      expect(await controller.update(1, dto)).toBe(result);
      expect(service.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should call service.remove and return void', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      expect(await controller.remove(1)).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if service.remove fails', async () => {
      jest.spyOn(service, 'remove').mockRejectedValue(new NotFoundException());
      await expect(controller.remove(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('close', () => {
    it('should call service.closeTournament', async () => {
      jest
        .spyOn(service, 'closeTournament')
        .mockResolvedValue({ ...mockTournament, status: 'FINISHED' } as any);

      expect(await controller.close(1)).toEqual(
        expect.objectContaining({ status: 'FINISHED' }),
      );
      expect(service.closeTournament).toHaveBeenCalledWith(1);
    });

    it('should throw BadRequestException if matches are not finished', async () => {
      jest
        .spyOn(service, 'closeTournament')
        .mockRejectedValue(new BadRequestException());
      await expect(controller.close(1)).rejects.toThrow(BadRequestException);
    });
  });
});
