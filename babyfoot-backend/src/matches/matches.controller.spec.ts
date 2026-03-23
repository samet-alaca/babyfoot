import { Test, TestingModule } from '@nestjs/testing';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { UpdateMatchDto } from './dto/update-match.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('MatchesController', () => {
  let controller: MatchesController;
  let service: MatchesService;

  const mockMatch = {
    id: 1,
    tournamentId: 10,
    homeScore: 0,
    awayScore: 0,
    status: 'PENDING',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchesController],
      providers: [
        {
          provide: MatchesService,
          useValue: {
            generateCalendar: jest.fn(),
            findAllByTournament: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MatchesController>(MatchesController);
    service = module.get<MatchesService>(MatchesService);
  });

  describe('generate', () => {
    it('should call service.generateCalendar and return the result', async () => {
      const result = [mockMatch];
      jest.spyOn(service, 'generateCalendar').mockResolvedValue(result as any);

      expect(await controller.generate(10)).toBe(result);
      expect(service.generateCalendar).toHaveBeenCalledWith(10);
    });

    it('should throw NotFoundException if service throws it', async () => {
      jest
        .spyOn(service, 'generateCalendar')
        .mockRejectedValue(new NotFoundException());
      await expect(controller.generate(10)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if service throws it', async () => {
      jest
        .spyOn(service, 'generateCalendar')
        .mockRejectedValue(new BadRequestException());
      await expect(controller.generate(10)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findByTournament', () => {
    it('should call service.findAllByTournament and return matches', async () => {
      const result = [mockMatch];
      jest
        .spyOn(service, 'findAllByTournament')
        .mockResolvedValue(result as any);

      expect(await controller.findByTournament(10)).toBe(result);
      expect(service.findAllByTournament).toHaveBeenCalledWith(10);
    });
  });

  describe('update', () => {
    it('should call service.update with correct parameters', async () => {
      const dto: UpdateMatchDto = { homeScore: 2, awayScore: 1 };
      const result = { ...mockMatch, ...dto };
      jest.spyOn(service, 'update').mockResolvedValue(result as any);

      expect(await controller.update(1, dto)).toBe(result);
      expect(service.update).toHaveBeenCalledWith(1, dto);
    });

    it('should throw NotFoundException if match does not exist', async () => {
      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException());
      await expect(controller.update(99, {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
