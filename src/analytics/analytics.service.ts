import { Injectable } from '@nestjs/common';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AnalyticsService {
  private analyticsDataClient: BetaAnalyticsDataClient;

  constructor() {
    const keyFilename = path.resolve(process.env.GOOGLE_CREDENTIALS_PATH);
    this.analyticsDataClient = new BetaAnalyticsDataClient({ keyFilename });
  }

  async getWebVisits(startDate: string, endDate: string): Promise<any> {
    const [response] = await this.analyticsDataClient.runReport({
      property: 'properties/403532248', // ID de tu propiedad GA4
      dateRanges: [
        {
          startDate,
          endDate,
        },
      ],
      metrics: [
        {
          name: 'activeUsers',
        },
      ],
    });

    return response;
  }
}
