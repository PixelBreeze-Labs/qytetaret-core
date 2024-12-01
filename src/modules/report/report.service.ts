import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';  // Change to MongoRepository
import { Report } from './entities/report.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { UpdateReportDto } from './dtos/update-report.dto';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private reportRepository: MongoRepository<Report>,  // Change to MongoRepository
  ) {}

  async create(createReportDto: CreateReportDto, authorId: string): Promise<Report> {
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
    return this.reportRepository.find();
  }

  async findOne(id: string): Promise<Report> {
    const report = await this.reportRepository.findOne({ where: { id } });
    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }
    return report;
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
    // Using MongoDB's native query capabilities through TypeORM
    return this.reportRepository.find({
      where: {
        location: {
          $geoWithin: {
            $centerSphere: [[lng, lat], maxDistance / 6378100]  // Convert meters to radians
          }
        }
      } as any  // Type assertion to bypass TypeORM's type checking
    });
  }
}