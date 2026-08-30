import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  const mockDataSource = {
    query: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello API"', () => {
      expect(appController.getHello()).toEqual({ message: 'Hello API' });
    });
  });

  describe('health', () => {
    it('should return health status ok when database is accessible', async () => {
      // Arrange
      mockDataSource.query.mockResolvedValue([{ '1': 1 }]);

      // Act
      const result = await appController.healthCheck();

      // Assert
      expect(result).toEqual({
        status: 'ok',
        timestamp: new Date().toISOString(),
        checks: { database: { status: 'ok' } },
      });
    });

    it('should return health status error when database is not accessible', async () => {
      // Arrange
      mockDataSource.query.mockRejectedValue(new Error('Connection failed'));

      // Act
      const result = await appController.healthCheck();

      // Assert
      expect(result).toEqual({
        status: 'error',
        timestamp: new Date().toISOString(),
        checks: { database: { status: 'error' } },
      });
    });
  });
});
