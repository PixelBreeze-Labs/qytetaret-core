import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Report } from './entities/report.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { UpdateReportDto } from './dtos/update-report.dto';
import { SupabaseService } from '../../shared/services/supabase.service';

@Injectable()
export class ReportService {
    constructor(
        @InjectRepository(Report)
        private reportRepository: MongoRepository<Report>,
        private supabase: SupabaseService
    ) {}

    async create(createReportDto: CreateReportDto, files: Express.Multer.File[] = []): Promise<Report> {
        const mediaUrls: string[] = [];
    
        // Upload images to Supabase
        if (files && files.length > 0) {
          for (const file of files) {
            const filename = `${Date.now()}-${file.originalname}`;
            const url = await this.supabase.uploadImage(file.buffer, filename);
            mediaUrls.push(url);
          }
        }
    
        // Handle base64 audio
        let audioUrl: string | null = null;
        if (createReportDto.audio) {
          try {
            // @ts-ignore
            const audioBuffer = Buffer.from(createReportDto.audio.split(',')[1], 'base64');
            const audioFilename = `audio-${Date.now()}.webm`;
            audioUrl = await this.supabase.uploadAudio(audioBuffer, audioFilename);
          } catch (error) {
            console.error('Audio upload failed', error);
          }
        }
    
        // Create the report object
        // @ts-ignore
        const report = this.reportRepository.create({
          ...createReportDto,
          media: mediaUrls.length > 0 ? mediaUrls : undefined,
          audio: audioUrl,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        // @ts-ignore
    
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