import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { TournamentsService } from './tournaments.service';
import { Tournament } from './tournament.model';
import {
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('TournamentsService', () => {
  let service: TournamentsService;
  let model: typeof Tournament;

  const mockTournament = {
    id: 1,
    name: 'Tournament 1',
    status: 'PENDING',
    teams: [],
    matches: [],
    get: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TournamentsService,
        {
          provide: getModelToken(Tournament),
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findByPk: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TournamentsService>(TournamentsService);
    model = module.get(getModelToken(Tournament));
  });

  describe('create', () => {
    it('should successfully create a tournament', async () => {
      const dto = { name: 'Tournament 1' };
      jest.spyOn(model, 'create').mockResolvedValue(mockTournament as any);

      const result = await service.create(dto as any);
      expect(result).toEqual(mockTournament);
    });

    it('should throw InternalServerErrorException if creation fails', async () => {
      jest.spyOn(model, 'create').mockRejectedValue(new Error());
      await expect(service.create({ name: 'X' } as any)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a tournament if found', async () => {
      jest.spyOn(model, 'findByPk').mockResolvedValue(mockTournament as any);
      const result = await service.findOne(1);
      expect(result).toEqual(mockTournament);
    });

    it('should throw NotFoundException if not found', async () => {
      jest.spyOn(model, 'findByPk').mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should throw InternalServerErrorException if update fails', async () => {
      jest.spyOn(model, 'findByPk').mockResolvedValue(mockTournament as any);
      mockTournament.update.mockRejectedValue(new Error());
      await expect(service.update(1, { name: 'New' })).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('remove', () => {
    it('should successfully destroy a tournament', async () => {
      jest.spyOn(model, 'findByPk').mockResolvedValue(mockTournament as any);
      await service.remove(1);
      expect(mockTournament.destroy).toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException if destroy fails', async () => {
      jest.spyOn(model, 'findByPk').mockResolvedValue(mockTournament as any);
      mockTournament.destroy.mockRejectedValue(new Error());
      await expect(service.remove(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('closeTournament', () => {
    const teams = [
      { id: 1, name: 'Team A' },
      { id: 2, name: 'Team B' },
    ];
    const matches = [
      {
        homeTeamId: 1,
        awayTeamId: 2,
        homeScore: 2,
        awayScore: 0,
        status: 'FINISHED',
      },
    ];

    it('should throw BadRequestException if matches are not finished', async () => {
      const unfinishedMatches = [{ status: 'PENDING' }];
      mockTournament.get.mockReturnValue({ teams, matches: unfinishedMatches });
      jest.spyOn(model, 'findByPk').mockResolvedValue(mockTournament as any);

      await expect(service.closeTournament(1)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should calculate winner and update tournament status', async () => {
      mockTournament.get.mockReturnValue({ teams, matches });
      jest.spyOn(model, 'findByPk').mockResolvedValue(mockTournament as any);
      mockTournament.update.mockResolvedValue({
        ...mockTournament,
        status: 'FINISHED',
        winnerId: 1,
      });

      const result = await service.closeTournament(1);
      expect(mockTournament.update).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'FINISHED',
          winnerId: 1,
        }),
      );
    });

    it('should correctly handle ties using goal difference', async () => {
      const tieMatches = [
        {
          homeTeamId: 1,
          awayTeamId: 2,
          homeScore: 1,
          awayScore: 1,
          status: 'FINISHED',
        },
        {
          homeTeamId: 1,
          awayTeamId: 2,
          homeScore: 5,
          awayScore: 0,
          status: 'FINISHED',
        },
      ];
      mockTournament.get.mockReturnValue({ teams, matches: tieMatches });
      jest.spyOn(model, 'findByPk').mockResolvedValue(mockTournament as any);

      await service.closeTournament(1);
      expect(mockTournament.update).toHaveBeenCalledWith(
        expect.objectContaining({
          winnerId: 1,
        }),
      );
    });
  });
});
