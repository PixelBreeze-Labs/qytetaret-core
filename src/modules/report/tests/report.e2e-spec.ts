import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';  // Changed import style
import { AppModule } from '../../../app.module';
import { ValidationPipe } from '@nestjs/common';

describe('ReportController (e2e)', () => {
  let app: INestApplication;
  let httpServer: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // Add global pipes and other configurations to match your app
    app.useGlobalPipes(new ValidationPipe({
      transform: true,
      whitelist: true,
    }));
    
    await app.init();
    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /reports', () => {
    it('should create a new report', () => {
      return request(httpServer)
        .post('/reports')
        // Add auth token if needed
        // .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'E2E Test Report',
          description: 'Testing with E2E',
          location: {
            type: 'Point',
            coordinates: [41.3275, 19.8187]
          },
          category: 'infrastructure',
          media: []
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.title).toBe('E2E Test Report');
        });
    });

    it('should fail with invalid data', () => {
      return request(httpServer)
        .post('/reports')
        .send({
          // Missing required fields
        })
        .expect(400);
    });
  });

  describe('GET /reports', () => {
    it('should return array of reports', () => {
      return request(httpServer)
        .get('/reports')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBeTruthy();
        });
    });
  });

  describe('GET /reports/nearby', () => {
    it('should return nearby reports', () => {
      return request(httpServer)
        .get('/reports/nearby')
        .query({
          lat: 41.3275,
          lng: 19.8187,
          distance: 5000
        })
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBeTruthy();
        });
    });

    it('should fail with invalid coordinates', () => {
      return request(httpServer)
        .get('/reports/nearby')
        .query({
          lat: 'invalid',
          lng: 'invalid'
        })
        .expect(400);
    });
  });

  describe('GET /reports/:id', () => {
    let reportId: string;

    beforeAll(async () => {
      // Create a test report to get its ID
      const response = await request(httpServer)
        .post('/reports')
        .send({
          title: 'Test Report for Get',
          description: 'Testing get by ID',
          location: {
            type: 'Point',
            coordinates: [41.3275, 19.8187]
          },
          category: 'infrastructure',
          media: []
        });
      reportId = response.body.id;
    });

    it('should return a report by id', () => {
      return request(httpServer)
        .get(`/reports/${reportId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', reportId);
        });
    });

    it('should return 404 for non-existent report', () => {
      return request(httpServer)
        .get('/reports/nonexistentid')
        .expect(404);
    });
  });
});