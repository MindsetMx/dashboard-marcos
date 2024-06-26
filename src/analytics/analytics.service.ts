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
      property: 'properties/371223237', // ID de tu propiedad GA4
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


  async getVisits(startDate: string, endDate: string, interval: string): Promise<any> {
    let dimension;
    if (interval === 'daily') {
      dimension = 'date';
    } else if (interval === 'weekly') {
      dimension = 'week';
    } else if (interval === 'monthly') {
      dimension = 'month';
    }

    const [response] = await this.analyticsDataClient.runReport({
      property: `properties/${process.env.GA4_PROPERTY_ID}`,
      dateRanges: [
        {
          startDate,
          endDate,
        },
      ],
      dimensions: [
        {
          name: dimension,
        },
      ],
      metrics: [
        {
          name: 'activeUsers',
        },
      ],
    });


    const startYear = parseInt(startDate.substring(0, 4), 10);
    const startMonth = parseInt(startDate.substring(5, 7), 10);

    const data = response.rows.map(row => ({
      date: this.formatDate(row.dimensionValues[0].value, interval, startYear, startMonth),
      visits: parseInt(row.metricValues[0].value, 10),
    }));


    // Ordenar los datos por fecha
    data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return {
      meta: {
        startDate,
        endDate,
        interval,
        rowCount: response.rowCount,
      },
      data
    };
  }

  private formatDate(value: string, interval: string, startYear: number, startMonth: number): string {
    if (interval === 'daily') {
      return `${value.substring(0, 4)}-${value.substring(4, 6)}-${value.substring(6, 8)}`;
    } else if (interval === 'weekly') {
      const year = parseInt(value.substring(0, 4), 10);
      const week = parseInt(value.substring(4, 6), 10);
      return this.getDateRangeForWeek(year, week);
    } else if (interval === 'monthly') {
      const monthNumber = parseInt(value, 10);
      const year = startYear + Math.floor((startMonth + monthNumber - 2) / 12);
      const month = (monthNumber % 12 || 12).toString().padStart(2, '0');
      return `${year}-${month}`;
    }
    return value;
  }

  private getDateRangeForWeek(year: number, week: number): string {
    const firstDayOfYear = new Date(year, 0, 1);
    const daysOffset = ((week - 1) * 7) - (firstDayOfYear.getDay() ? firstDayOfYear.getDay() - 1 : 6);
    const startDate = new Date(year, 0, 1 + daysOffset);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    const format = (date: Date) => date.toISOString().substring(0, 10);
    const startDateString = format(startDate);
    const endDateString = format(endDate);
    return `${startDateString} - ${endDateString}`;
  }


  async getGeography(startDate: string, endDate: string): Promise<any> {
    const [response] = await this.analyticsDataClient.runReport({
      property: `properties/${process.env.GA4_PROPERTY_ID}`,
      dateRanges: [
        {
          startDate,
          endDate,
        },
      ],
      dimensions: [
        {
          name: 'country',
        },
        {
          name: 'region', // o 'subContinent' para nivel de estado/provincia
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

  async getPages(startDate: string, endDate: string): Promise<any> {
    const [response] = await this.analyticsDataClient.runReport({
      property: `properties/${process.env.GA4_PROPERTY_ID}`,
      dateRanges: [
        {
          startDate,
          endDate,
        },
      ],
      dimensions: [
        {
          name: 'pagePath',
        },
      ],
      metrics: [
        {
          name: 'averageSessionDuration',
        },
        {
          name: 'screenPageViews',
        },
      ],
    });

    return response;
  }

  async getConversions(startDate: string, endDate: string): Promise<any> {
    const [response] = await this.analyticsDataClient.runReport({
      property: `properties/${process.env.GA4_PROPERTY_ID}`,
      dateRanges: [
        {
          startDate,
          endDate,
        },
      ],
      metrics: [
        {
          name: 'bounceRate',
        },
        {
          name: 'conversions',
        },
      ],
    });

    return response;
  }

  async getDevices(startDate: string, endDate: string): Promise<any> {
    const [response] = await this.analyticsDataClient.runReport({
      property: `properties/${process.env.GA4_PROPERTY_ID}`,
      dateRanges: [
        {
          startDate,
          endDate,
        },
      ],
      dimensions: [
        {
          name: 'deviceCategory',
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


  async getBounceRate(startDate: string, endDate: string): Promise<any> {
    const [response] = await this.analyticsDataClient.runReport({
      property: `properties/${process.env.GA4_PROPERTY_ID}`,
      dateRanges: [
        {
          startDate,
          endDate,
        },
      ],
      metrics: [
        {
          name: 'bounceRate',
        },
      ],
    });

    return response;
  }

  //VISITS ORGANIC OR PAID
  async getVisitsOrganicOrPaid(startDate: string, endDate: string): Promise<any> {
    const [response] = await this.analyticsDataClient.runReport({
      property: `properties/${process.env.GA4_PROPERTY_ID}`,
      dateRanges: [
        {
          startDate,
          endDate,
        },
      ],
      dimensions: [
        {
          name: 'sourceMedium',
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
