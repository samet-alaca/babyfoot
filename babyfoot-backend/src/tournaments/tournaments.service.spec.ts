import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { TournamentsService } from './tournaments.service';
import { Tournament } from './tournament.model';
import { InternalServerErrorException } from '@nestjs/common/exceptions/internal-server-error.exception';

describe('TournamentsService', () => {
  let service: TournamentsService;
  let model: typeof Tournament;

  const mockTournamentModel = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TournamentsService,
        {
          provide: getModelToken(Tournament),
          useValue: mockTournamentModel,
        },
      ],
    }).compile();

    service = module.get<TournamentsService>(TournamentsService);
    model = module.get<typeof Tournament>(getModelToken(Tournament));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully insert a tournament', async () => {
      const dto = { name: 'Tournoi test', date: '2026-06-01', description: 'Test' };
      mockTournamentModel.create.mockReturnValue(dto);
      
      const result = await service.create(dto as any);
      
      expect(result).toEqual(dto);
      expect(mockTournamentModel.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should successfully update a tournament', async () => {
      const mockTournament = {
        id: 1,
        name: 'Ancien Nom',
        update: jest.fn().mockResolvedValue({ id: 1, name: 'Nouveau Nom' }),
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockTournament as any);

      const result = await service.update(1, { name: 'Nouveau Nom' });

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(mockTournament.update).toHaveBeenCalledWith({ name: 'Nouveau Nom' });
      expect(result.name).toEqual('Nouveau Nom');
    });

    it('should throw InternalServerErrorException if update fails', async () => {
      const mockTournament = {
        update: jest.fn().mockRejectedValue(new Error()),
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(mockTournament as any);

      await expect(service.update(1, {})).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('remove', () => {
    it('should successfully remove a tournament', async () => {
      const tournament = { id: 1, name: 'Tournoi test', destroy: jest.fn() };
      mockTournamentModel.findByPk.mockReturnValue(tournament);
      await service.remove(1);
      expect(tournament.destroy).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if tournament not found', async () => {
      mockTournamentModel.findByPk.mockReturnValue(null);
      
      await expect(service.findOne(999)).rejects.toThrow('Le tournoi avec l\'id 999 n\'existe pas');
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException if tournament not found', async () => {
      mockTournamentModel.findByPk.mockReturnValue(null);
      await expect(service.remove(999)).rejects.toThrow('Le tournoi avec l\'id 999 n\'existe pas');
    });
  });
});