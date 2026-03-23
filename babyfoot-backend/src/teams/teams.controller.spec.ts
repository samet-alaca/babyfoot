import { Test, TestingModule } from '@nestjs/testing';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('TeamsController', () => {
  let controller: TeamsController;
  let service: TeamsService;

  const mockTeam = { id: 1, name: 'Test Team', tournamentId: 10 };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamsController],
      providers: [
        {
          provide: TeamsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findByTournament: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TeamsController>(TeamsController);
    service = module.get<TeamsService>(TeamsService);
  });

  describe('create', () => {
    it('should call service.create and return the new team', async () => {
      const dto: CreateTeamDto = { name: 'Test Team', tournamentId: 10 };
      jest.spyOn(service, 'create').mockResolvedValue(mockTeam as any);

      expect(await controller.create(dto)).toBe(mockTeam);
      expect(service.create).toHaveBeenCalledWith(dto);
    });

    it('should throw BadRequestException if service fails', async () => {
      jest
        .spyOn(service, 'create')
        .mockRejectedValue(new BadRequestException());
      await expect(controller.create({} as any)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should call service.findAll and return an array of teams', async () => {
      const result = [mockTeam];
      jest.spyOn(service, 'findAll').mockResolvedValue(result as any);

      expect(await controller.findAll()).toBe(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findByTournament', () => {
    it('should call service.findByTournament with tournamentId', async () => {
      const result = [mockTeam];
      jest.spyOn(service, 'findByTournament').mockResolvedValue(result as any);

      expect(await controller.findByTournament(10)).toBe(result);
      expect(service.findByTournament).toHaveBeenCalledWith(10);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne and return a team', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockTeam as any);

      expect(await controller.findOne(1)).toBe(mockTeam);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if team is not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());
      await expect(controller.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should call service.update and return updated team', async () => {
      const dto: UpdateTeamDto = { name: 'Updated Team' };
      const result = { ...mockTeam, ...dto };
      jest.spyOn(service, 'update').mockResolvedValue(result as any);

      expect(await controller.update(1, dto)).toBe(result);
      expect(service.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should call service.remove and return undefined', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      expect(await controller.remove(1)).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if team to remove is not found', async () => {
      jest.spyOn(service, 'remove').mockRejectedValue(new NotFoundException());
      await expect(controller.remove(99)).rejects.toThrow(NotFoundException);
    });
  });
});
