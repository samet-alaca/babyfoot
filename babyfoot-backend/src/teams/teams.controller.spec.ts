import { Test, TestingModule } from '@nestjs/testing';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

describe('TeamsController', () => {
  let controller: TeamsController;
  let service: TeamsService;

  const mockTeam = { id: 1, name: 'Team Rocket', tournamentId: 10 };
  const mockTeamsArray = [mockTeam, { id: 2, name: 'Team Plasma', tournamentId: 10 }];

  const mockTeamsService = {
    create: jest.fn().mockResolvedValue(mockTeam),
    findAll: jest.fn().mockResolvedValue(mockTeamsArray),
    findByTournament: jest.fn().mockResolvedValue(mockTeamsArray),
    findOne: jest.fn().mockResolvedValue(mockTeam),
    update: jest.fn().mockResolvedValue({ ...mockTeam, name: 'Updated Name' }),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamsController],
      providers: [
        {
          provide: TeamsService,
          useValue: mockTeamsService,
        },
      ],
    }).compile();

    controller = module.get<TeamsController>(TeamsController);
    service = module.get<TeamsService>(TeamsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return the new team', async () => {
      const dto: CreateTeamDto = { name: 'Team Rocket', tournamentId: 10 };
      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockTeam);
    });
  });

  describe('findAll', () => {
    it('should return an array of teams', async () => {
      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockTeamsArray);
    });
  });

  describe('findByTournament', () => {
    it('should call service.findByTournament with correct tournamentId', async () => {
      const tournamentId = 10;
      const result = await controller.findByTournament(tournamentId);

      expect(service.findByTournament).toHaveBeenCalledWith(tournamentId);
      expect(result).toEqual(mockTeamsArray);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne and return a team', async () => {
      const id = 1;
      const result = await controller.findOne(id);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockTeam);
    });
  });

  describe('update', () => {
    it('should call service.update with correct id and dto', async () => {
      const id = 1;
      const dto: UpdateTeamDto = { name: 'Updated Name' };
      const result = await controller.update(id, dto);

      expect(service.update).toHaveBeenCalledWith(id, dto);
      expect(result.name).toEqual('Updated Name');
    });
  });

  describe('remove', () => {
    it('should call service.remove and return undefined', async () => {
      const id = 1;
      const result = await controller.remove(id);

      expect(service.remove).toHaveBeenCalledWith(id);
      expect(result).toBeUndefined();
    });
  });
});