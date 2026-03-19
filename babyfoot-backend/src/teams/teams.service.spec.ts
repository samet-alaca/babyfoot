import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { TeamsService } from './teams.service';
import { Team } from './team.model';
import { Tournament } from '../tournaments/tournament.model';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { create } from 'domain';

describe('TeamsService', () => {
  let service: TeamsService;
  let teamModel: typeof Team;
  let tournamentModel: typeof Tournament;

  const mockTeam = {
    id: 1,
    name: 'Team Test',
    tournamentId: 10,
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn().mockReturnThis(),
    destroy: jest.fn().mockResolvedValue(undefined),
  };

  const mockTournament = { id: 10, name: 'Tournoi test' };

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
    teamModel = module.get<typeof Team>(getModelToken(Team));
    tournamentModel = module.get<typeof Tournament>(getModelToken(Tournament));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto = { name: 'New Team', tournamentId: 10 };

    it('should create a team successfully if tournament exists', async () => {
      jest.spyOn(tournamentModel, 'findByPk').mockResolvedValue(mockTournament as any);
      jest.spyOn(teamModel, 'create').mockResolvedValue(mockTeam as any);

      const result = await service.create(createDto);

      expect(tournamentModel.findByPk).toHaveBeenCalledWith(10);
      expect(teamModel.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockTeam);
    });

    it('should throw BadRequestException if tournament does not exist', async () => {
      jest.spyOn(tournamentModel, 'findByPk').mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
      expect(teamModel.create).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException if database error occurs during creation', async () => {
      jest.spyOn(tournamentModel, 'findByPk').mockResolvedValue(mockTournament as any);
      jest.spyOn(teamModel, 'create').mockRejectedValue(new Error('DB Error'));

      await expect(service.create(createDto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findAll', () => {
    it('should return an array of teams with tournament included', async () => {
      jest.spyOn(teamModel, 'findAll').mockResolvedValue([mockTeam] as any);

      const result = await service.findAll();

      expect(result).toEqual([mockTeam]);
      expect(teamModel.findAll).toHaveBeenCalledWith({
        include: [Tournament],
        order: [['createdAt', 'DESC']],
      });
    });
  });

  describe('findByTournament', () => {
    it('should return teams filtered by tournamentId', async () => {
      jest.spyOn(teamModel, 'findAll').mockResolvedValue([mockTeam] as any);

      const result = await service.findByTournament(10);

      expect(result).toEqual([mockTeam]);
      expect(teamModel.findAll).toHaveBeenCalledWith({
        where: { tournamentId: 10 },
        include: [Tournament],
      });
    });
  });

  describe('findOne', () => {
    it('should return a team if it exists', async () => {
      jest.spyOn(teamModel, 'findByPk').mockResolvedValue(mockTeam as any);

      const result = await service.findOne(1);

      expect(result).toEqual(mockTeam);
      expect(teamModel.findByPk).toHaveBeenCalledWith(1, { include: [Tournament] });
    });

    it('should throw NotFoundException if team is not found', async () => {
      jest.spyOn(teamModel, 'findByPk').mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateDto = { name: 'Updated Team' };

    it('should update the team name successfully', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockTeam as any);
      
      const result = await service.update(1, updateDto);

      expect(mockTeam.update).toHaveBeenCalledWith(updateDto);
      expect(result).toEqual(mockTeam);
    });

    it('should verify tournament existence if tournamentId is changed', async () => {
      const updateWithNewTournament = { tournamentId: 20 };
      jest.spyOn(service, 'findOne').mockResolvedValue(mockTeam as any);
      jest.spyOn(tournamentModel, 'findByPk').mockResolvedValue({ id: 20 } as any);

      await service.update(1, updateWithNewTournament);

      expect(tournamentModel.findByPk).toHaveBeenCalledWith(20);
      expect(mockTeam.update).toHaveBeenCalledWith(updateWithNewTournament);
    });

    it('should throw BadRequestException if the new tournament does not exist', async () => {
      const updateWithInvalidTournament = { tournamentId: 99 };
      jest.spyOn(service, 'findOne').mockResolvedValue(mockTeam as any);
      jest.spyOn(tournamentModel, 'findByPk').mockResolvedValue(null);

      await expect(service.update(1, updateWithInvalidTournament)).rejects.toThrow(BadRequestException);
    });

    it('should throw InternalServerErrorException if update fails', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockTeam as any);
      mockTeam.update.mockRejectedValue(new Error('Update failed'));

      await expect(service.update(1, updateDto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('remove', () => {
    it('should remove the team successfully', async () => {
      jest.spyOn(teamModel, 'findByPk').mockResolvedValue(mockTeam as any);

      await service.remove(1);

      expect(mockTeam.destroy).toHaveBeenCalled();
    });

    it('should throw NotFoundException if team to remove does not exist', async () => {
      jest.spyOn(teamModel, 'findByPk').mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException if deletion fails', async () => {
      jest.spyOn(teamModel, 'findByPk').mockResolvedValue(mockTeam as any);
      mockTeam.destroy.mockRejectedValue(new Error('Delete failed'));

      await expect(service.remove(1)).rejects.toThrow(InternalServerErrorException);
    });
  });
});