import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Report } from './entities/report.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { UpdateReportDto } from './dtos/update-report.dto';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private reportRepository: MongoRepository<Report>,
  ) {}

  async create(createReportDto: CreateReportDto, authorId: string): Promise<Report> {
    // Handle file uploads (you'll need to implement file storage logic)
    const report = this.reportRepository.create({
      ...createReportDto,
      authorId,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return this.reportRepository.save(report);
  }

  async findAll(): Promise<Report[]> {
    return this.reportRepository.find({
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string): Promise<Report> {
    const report = await this.reportRepository.findOne({ where: { id } });
    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }
    return report;
  }

  async getFeaturedReports(): Promise<Report[]> {
    // Implement logic to fetch featured reports
    // For now, just return the 5 most recent reports
    return this.reportRepository.find({
      order: { createdAt: 'DESC' },
      take: 5
    });
  }

  async getMapReports(): Promise<Report[]> {
    // Implement logic to fetch reports for map view
    // You might want to add additional filtering or sorting
    return this.reportRepository.find();
  }

  async update(id: string, updateReportDto: UpdateReportDto): Promise<Report> {
    const report = await this.findOne(id);
    Object.assign(report, {
      ...updateReportDto,
      updatedAt: new Date(),
    });
    return this.reportRepository.save(report);
  }

  async remove(id: string): Promise<void> {
    const result = await this.reportRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }
  }

  async findNearby(lat: number, lng: number, maxDistance: number = 5000): Promise<Report[]> {
    return this.reportRepository.find({
      where: {
        location: {
          $geoWithin: {
            $centerSphere: [[lng, lat], maxDistance / 6378100]
          }
        }
      } as any
    });
  }
}