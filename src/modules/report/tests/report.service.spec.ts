import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ReportService } from '../report.service';
import { Report } from '../entities/report.entity';
import { CreateReportDto } from '../dtos/create-report.dto';

describe('ReportService', () => {
  let service: ReportService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportService,
        {
          provide: getRepositoryToken(Report),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ReportService>(ReportService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new report', async () => {
      const createReportDto: CreateReportDto = {
        title: 'Test Report',
        description: 'Test Description',
        location: {
          type: 'Point',
          coordinates: [41.3275, 19.8187] as [number, number]
        },
        category: 'infrastructure',
        media: []
      };

      const mockCreatedReport = {
        id: 'some-id',
        ...createReportDto,
        authorId: 'test-user',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.create.mockReturnValue(mockCreatedReport);
      mockRepository.save.mockResolvedValue(mockCreatedReport);

      const result = await service.create(createReportDto, 'test-user');
      expect(result).toEqual(mockCreatedReport);
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createReportDto,
        authorId: 'test-user',
        status: 'pending',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  // Add test for findNearby
  describe('findNearby', () => {
    it('should find nearby reports', async () => {
      const mockReports = [
        { id: '1', title: 'Near Report' },
        { id: '2', title: 'Another Near Report' }
      ];

      mockRepository.find.mockResolvedValue(mockReports);

      const result = await service.findNearby(41.3275, 19.8187, 5000);
      expect(result).toEqual(mockReports);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });
});