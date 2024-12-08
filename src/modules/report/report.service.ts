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

    async create(createReportDto: CreateReportDto, files: Express.Multer.File[] = [], file: Express.Multer.File): Promise<Report> {
        const mediaUrls: string[] = [];
    
        // Upload images to Supabase
        if (files && files.length > 0) {
          for (const file of files) {
            const filename = `${Date.now()}-${file.originalname}`;
            const url = await this.supabase.uploadImage(file.buffer, filename);
            mediaUrls.push(url);
          }
        }
    
        // Handle audio upload
        let audioUrl: string | null = null;
        if (file && file.buffer) {
            try {
                const audioFilename = `audio-${Date.now()}.webm`;
                audioUrl = await this.supabase.uploadAudio(file.buffer, audioFilename);
            } catch (error) {
                console.error('Audio upload failed', error);
                // Don't return null, continue with report creation
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
    
      async findAll(options: {
        page?: number;
        limit?: number;
        category?: string;
        status?: string;
        sortBy?: string;
    }) {
        const {
            page = 1,
            limit = 12,
            category = 'all',
            status = 'all',
            sortBy = 'newest'
        } = options;
    
        const query: any = {};
        
        if (category !== 'all') {
            query.category = category;
        }
    
        if (status !== 'all') {
            query.status = status;
        }
    
        const sort: any = {};
        if (sortBy === 'newest') {
            sort.createdAt = -1;
        } else {
            sort.createdAt = 1;
        }
    
        const skip = (page - 1) * limit;
    
        const [reports, total] = await Promise.all([
            this.reportRepository.find({
                where: query,
                skip: skip,
                take: limit,
                order: sort
            }),
            this.reportRepository.count(query)
        ]);
    
        // Transform reports to include string ID
        const transformedReports = reports.map(report => {
            const fixedMedia = report.media?.map(url => {
                if (typeof url === 'string' && url.startsWith('https://https://')) {
                    return url.replace('https://https://', 'https://');
                }
                return url;
            });
    
            const plainReport = {
                ...report,
                id: report._id.toString(), // Add string ID
                media: fixedMedia,
                _id: undefined // Remove the buffer ID
            };
            return plainReport;
        });
    
        return {
            data: transformedReports,
            meta: {
                total,
                page,
                limit,
                hasMore: total > skip + reports.length
            }
        };
    }

  async findOne(id: string): Promise<Report> {
    const report = await this.reportRepository.findOne({ where: { id } });
    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }
    return report;
  }

  async getFeaturedReports(): Promise<{ data: Report[] }> {
    // Get all reports
    const allReports = await this.reportRepository.find();
    
    // Shuffle randomly
    const shuffled = allReports.sort(() => 0.5 - Math.random());
    
    // Take first 6 reports
    const featured = shuffled.slice(0, 6);
  
    // Transform reports while maintaining the original Report type
    const allFeatured = featured.map(report => {
      // Create a new object that matches the Report type
      const transformedReport = { 
        ...report,
         id: report._id.toString(),
          _id: undefined 
        };
      
      // Fix media URLs if needed
      if (transformedReport.media) {
        transformedReport.media = transformedReport.media.map(url => 
          typeof url === 'string' && url.startsWith('https://https://') 
            ? url.replace('https://https://', 'https://') 
            : url
        );
      }
  
      return transformedReport;
    });
  
    
    return {
      // @ts-ignore
      data: allFeatured
    };
  }


  async getMapReports(): Promise<{ data: Report[] }> {
    // Merr të gjitha reports
    const reports = await this.reportRepository.find();
    
    // Transform reports
    const transformedReports = reports.map(report => {
        const fixedMedia = report.media?.map(url => {
            if (typeof url === 'string' && url.startsWith('https://https://')) {
                return url.replace('https://https://', 'https://');
            }
            return url;
        });

        return {
            ...report,
            id: report._id.toString(),
            media: fixedMedia,
            _id: undefined
        };
    });


    return {
         // @ts-ignore
        data: transformedReports
    };
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