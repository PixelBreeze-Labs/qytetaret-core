import { 
    Controller, 
    Get, 
    Post, 
    Body, 
    Put, 
    Param, 
    Delete, 
    UseGuards,
    Query,
    Request,
    Optional,
    UploadedFiles,
    UseInterceptors,
    UploadedFile
  } from '@nestjs/common';
  import { 
    ApiTags, 
    ApiOperation, 
    ApiBearerAuth,
    ApiResponse, 
    ApiParam, 
    ApiQuery, 
    ApiExtraModels, 
    ApiConsumes
  } from '@nestjs/swagger';
  import { AuthGuard } from '@nestjs/passport';
  import { ReportService } from './report.service';
  import { CreateReportDto } from './dtos/create-report.dto';
  import { UpdateReportDto } from './dtos/update-report.dto';
  import { Report } from './entities/report.entity';
  import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
  
  @ApiTags('reports')
  @Controller('reports')
  @ApiExtraModels(CreateReportDto, UpdateReportDto, Report)
  export class ReportController {
    constructor(private readonly reportService: ReportService) {}
  
  
    @Post()
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(
        FileFieldsInterceptor([
          { name: 'media', maxCount: 10 },
          { name: 'audio', maxCount: 1 }
        ])
    )
    // @UseGuards(AuthGuard('jwt'))
    @Optional() // Make auth optional
    @ApiOperation({ summary: 'Create a new community report' })
    @ApiResponse({ 
      status: 201, 
      description: 'Report has been successfully created',
      type: Report 
    })
    @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data' })
    async create(
        @Body() createReportDto: CreateReportDto,
        @UploadedFiles() files: { 
            media?: Express.Multer.File[], 
            audio?: Express.Multer.File[] 
        }
      ): Promise<Report> {
        // Parse location from string to object if it's a string
        if (typeof createReportDto.location === 'string') {
            createReportDto.location = JSON.parse(createReportDto.location);
        }
    
        return this.reportService.create(
            createReportDto, 
            files?.media || [],
            // @ts-ignore 
            files?.audio?.[0]
        );
      }
  
    @Get()
    @ApiOperation({ summary: 'Get all community reports' })
    @ApiResponse({
      status: 200,
      description: 'Returns array of all reports',
      type: [Report]
    })
    findAll(): Promise<Report[]> {
      return this.reportService.findAll();
    }
  
    @Get('featured')
    @ApiOperation({ summary: 'Get featured community reports' })
    @ApiResponse({
      status: 200,
      description: 'Returns array of featured reports',
      type: [Report]
    })
    getFeaturedReports(): Promise<Report[]> {
      return this.reportService.getFeaturedReports();
    }
  
    @Get('map')
    @ApiOperation({ summary: 'Get reports for map view' })
    @ApiResponse({
      status: 200,
      description: 'Returns array of reports for map display',
      type: [Report]
    })
    getMapReports(): Promise<Report[]> {
      return this.reportService.getMapReports();
    }
  
    @Get('nearby')
    @ApiOperation({ summary: 'Get reports near a specific location' })
    @ApiQuery({ 
      name: 'lat', 
      required: true, 
      type: Number,
      description: 'Latitude coordinate'
    })
    @ApiQuery({ 
      name: 'lng', 
      required: true, 
      type: Number,
      description: 'Longitude coordinate'
    })
    @ApiQuery({ 
      name: 'distance', 
      required: false, 
      type: Number,
      description: 'Search radius in meters (default: 5000)'
    })
    @ApiResponse({
      status: 200,
      description: 'Returns reports within specified radius',
      type: [Report]
    })
    findNearby(
      @Query('lat') lat: number,
      @Query('lng') lng: number,
      @Query('distance') distance?: number,
    ): Promise<Report[]> {
      return this.reportService.findNearby(lat, lng, distance);
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get a specific report by ID' })
    @ApiParam({
      name: 'id',
      required: true,
      description: 'Report unique identifier'
    })
    @ApiResponse({
      status: 200,
      description: 'Returns the report details',
      type: Report
    })
    @ApiResponse({ status: 404, description: 'Report not found' })
    findOne(@Param('id') id: string): Promise<Report> {
      return this.reportService.findOne(id);
    }
  
    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update an existing report' })
    @ApiParam({
      name: 'id',
      required: true,
      description: 'Report unique identifier'
    })
    @ApiResponse({
      status: 200,
      description: 'Report has been successfully updated',
      type: Report
    })
    @ApiResponse({ status: 401, description: 'Unauthorized - Valid JWT token required' })
    @ApiResponse({ status: 404, description: 'Report not found' })
    @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data' })
    update(
      @Param('id') id: string,
      @Body() updateReportDto: UpdateReportDto,
    ): Promise<Report> {
      return this.reportService.update(id, updateReportDto);
    }
  
    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a report' })
    @ApiParam({
      name: 'id',
      required: true,
      description: 'Report unique identifier to delete'
    })
    @ApiResponse({ status: 204, description: 'Report has been successfully deleted' })
    @ApiResponse({ status: 401, description: 'Unauthorized - Valid JWT token required' })
    @ApiResponse({ status: 404, description: 'Report not found' })
    remove(@Param('id') id: string): Promise<void> {
      return this.reportService.remove(id);
    }
  }