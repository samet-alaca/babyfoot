import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { TeamsService } from './teams.service';
import { Team } from './team.model';
import { Tournament } from '../tournaments/tournament.model';
import {
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

describe('TeamsService', () => {
  let service: TeamsService;
  let teamModel: typeof Team;
  let tournamentModel: typeof Tournament;

  const mockTeam = {
    id: 1,
    name: 'Test Team',
    tournamentId: 10,
    update: jest.fn(),
    destroy: jest.fn(),
  };

  const mockTournament = {
    id: 10,
    name: 'Test Tournament',
    status: 'PENDING',
    teams: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamsService,
        {
          provide: getModelToken(Team),
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findByPk: jest.fn(),
          },
        },
        {
          provide: getModelToken(Tournament),
          useValue: {
            findByPk: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TeamsService>(TeamsService);
    teamModel = module.get(getModelToken(Team));
    tournamentModel = module.get(getModelToken(Tournament));
  });

  describe('create', () => {
    const createDto = { name: 'New Team', tournamentId: 10 };

    it('should throw BadRequestException if tournament does not exist', async () => {
      jest.spyOn(tournamentModel, 'findByPk').mockResolvedValue(null);
      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if tournament is finished', async () => {
      jest
        .spyOn(tournamentModel, 'findByPk')
        .mockResolvedValue({ ...mockTournament, status: 'FINISHED' } as any);
      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if tournament is full (8 teams)', async () => {
      const fullTeams = Array(8).fill({ id: 1 });
      jest
        .spyOn(tournamentModel, 'findByPk')
        .mockResolvedValue({ ...mockTournament, teams: fullTeams } as any);
      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should create and return the team if all checks pass', async () => {
      jest
        .spyOn(tournamentModel, 'findByPk')
        .mockResolvedValue(mockTournament as any);
      jest.spyOn(teamModel, 'create').mockResolvedValue(mockTeam as any);

      const result = await service.create(createDto);
      expect(result).toBe(mockTeam);
      expect(teamModel.create).toHaveBeenCalledWith(createDto);
    });

    it('should throw InternalServerErrorException if creation fails', async () => {
      jest
        .spyOn(tournamentModel, 'findByPk')
        .mockResolvedValue(mockTournament as any);
      jest.spyOn(teamModel, 'create').mockRejectedValue(new Error('DB Error'));
      await expect(service.create(createDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findAll', () => {
    it('should return a list of teams', async () => {
      const teams = [mockTeam];
      jest.spyOn(teamModel, 'findAll').mockResolvedValue(teams as any);
      expect(await service.findAll()).toBe(teams);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if team does not exist', async () => {
      jest.spyOn(teamModel, 'findByPk').mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });

    it('should return the team if found', async () => {
      jest.spyOn(teamModel, 'findByPk').mockResolvedValue(mockTeam as any);
      expect(await service.findOne(1)).toBe(mockTeam);
    });
  });

  describe('update', () => {
    it('should throw BadRequestException if new tournamentId does not exist', async () => {
      jest.spyOn(teamModel, 'findByPk').mockResolvedValue(mockTeam as any);
      jest.spyOn(tournamentModel, 'findByPk').mockResolvedValue(null);

      await expect(service.update(1, { tournamentId: 99 })).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should update the team successfully', async () => {
      jest.spyOn(teamModel, 'findByPk').mockResolvedValue(mockTeam as any);
      mockTeam.update.mockResolvedValue({ ...mockTeam, name: 'Updated' });

      const result = await service.update(1, { name: 'Updated' });
      expect(mockTeam.update).toHaveBeenCalled();
      expect(result.name).toBe('Updated');
    });

    it('should throw InternalServerErrorException if update fails', async () => {
      jest.spyOn(teamModel, 'findByPk').mockResolvedValue(mockTeam as any);
      mockTeam.update.mockRejectedValue(new Error());

      await expect(service.update(1, { name: 'Fail' })).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException if team to remove does not exist', async () => {
      jest.spyOn(teamModel, 'findByPk').mockResolvedValue(null);
      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
    });

    it('should destroy the team successfully', async () => {
      jest.spyOn(teamModel, 'findByPk').mockResolvedValue(mockTeam as any);
      await service.remove(1);
      expect(mockTeam.destroy).toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException if destroy fails', async () => {
      jest.spyOn(teamModel, 'findByPk').mockResolvedValue(mockTeam as any);
      mockTeam.destroy.mockRejectedValue(new Error());
      await expect(service.remove(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
