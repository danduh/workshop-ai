import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

export interface HealthCheckResponse {
  status: string;
  timestamp: string;
  database: string;
  version: string;
}

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Service health status',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'healthy' },
        timestamp: { type: 'string', example: '2025-07-17T10:30:00Z' },
        database: { type: 'string', example: 'connected' },
        version: { type: 'string', example: '1.0.0' },
      },
    },
  })
  async healthCheck(): Promise<HealthCheckResponse> {
    let databaseStatus = 'disconnected';
    
    try {
      // Check database connection
      if (this.dataSource.isInitialized) {
        await this.dataSource.query('SELECT 1');
        databaseStatus = 'connected';
      }
    } catch {
      databaseStatus = 'error';
    }

    return {
      status: databaseStatus === 'connected' ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      database: databaseStatus,
      version: this.configService.get('app.version', '1.0.0'),
    };
  }
}
