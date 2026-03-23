import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { MatchesService } from './matches.service';
import { Match } from './match.model';
import { Team } from '../teams/team.model';
import { Tournament } from '../tournaments/tournament.model';
import {
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('MatchesService', () => {
  let service: MatchesService;
  let matchModel: typeof Match;
  let tournamentModel: typeof Tournament;

  const mockTournament = {
    id: 1,
    get: jest.fn().mockReturnValue({
      id: 1,
      teams: [{ id: 10 }, { id: 20 }, { id: 30 }],
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchesService,
        {
          provide: getModelToken(Match),
          useValue: {
            count: jest.fn(),
            bulkCreate: jest.fn(),
            findAll: jest.fn(),
            findByPk: jest.fn(),
          },
        },
        {
          provide: getModelToken(Team),
          useValue: {},
        },
        {
          provide: getModelToken(Tournament),
          useValue: {
            findByPk: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MatchesService>(MatchesService);
    matchModel = module.get(getModelToken(Match));
    tournamentModel = module.get(getModelToken(Tournament));
  });

  describe('generateCalendar', () => {
    it('should throw NotFoundException if the tournament does not exist', async () => {
      jest.spyOn(tournamentModel, 'findByPk').mockResolvedValue(null);

      await expect(service.generateCalendar(999)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if less than 2 teams', async () => {
      const tournamentWithOneTeam = {
        get: jest.fn().mockReturnValue({ teams: [{ id: 1 }] }),
      };
      jest
        .spyOn(tournamentModel, 'findByPk')
        .mockResolvedValue(tournamentWithOneTeam as any);

      await expect(service.generateCalendar(1)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if matches already exist', async () => {
      jest
        .spyOn(tournamentModel, 'findByPk')
        .mockResolvedValue(mockTournament as any);
      jest.spyOn(matchModel, 'count').mockResolvedValue(5);

      await expect(service.generateCalendar(1)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should generate the correct number of matches (n*(n-1)/2)', async () => {
      jest
        .spyOn(tournamentModel, 'findByPk')
        .mockResolvedValue(mockTournament as any);
      jest.spyOn(matchModel, 'count').mockResolvedValue(0);
      const bulkCreateSpy = jest
        .spyOn(matchModel, 'bulkCreate')
        .mockResolvedValue([] as any);

      await service.generateCalendar(1);

      expect(bulkCreateSpy).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ homeTeamId: 10, awayTeamId: 20 }),
          expect.objectContaining({ homeTeamId: 10, awayTeamId: 30 }),
          expect.objectContaining({ homeTeamId: 20, awayTeamId: 30 }),
        ]),
      );
      expect(bulkCreateSpy.mock.calls[0][0].length).toBe(3);
    });

    it('should throw InternalServerErrorException if bulkCreate fails', async () => {
      jest
        .spyOn(tournamentModel, 'findByPk')
        .mockResolvedValue(mockTournament as any);
      jest.spyOn(matchModel, 'count').mockResolvedValue(0);
      jest
        .spyOn(matchModel, 'bulkCreate')
        .mockRejectedValue(new Error('DB Error'));

      await expect(service.generateCalendar(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('update', () => {
    it('should throw NotFoundException if the match does not exist', async () => {
      jest.spyOn(matchModel, 'findByPk').mockResolvedValue(null);

      await expect(service.update(999, { homeScore: 2 })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should call the update method of the model if the match is found', async () => {
      const mockMatch = {
        id: 1,
        update: jest.fn().mockResolvedValue({ id: 1, homeScore: 3 }),
      };
      jest.spyOn(matchModel, 'findByPk').mockResolvedValue(mockMatch as any);

      const result = await service.update(1, { homeScore: 3 });

      expect(mockMatch.update).toHaveBeenCalledWith({ homeScore: 3 });
      expect(result.homeScore).toBe(3);
    });
  });
});
