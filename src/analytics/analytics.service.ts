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


  async getVisits(startDate: string, endDate: string, interval: string): Promise<any> {
    let dimension;
    if (interval === 'daily') {
      dimension = 'date';
    } else if (interval === 'weekly') {
      dimension = 'week';
    } else if (interval === 'monthly') {
      dimension = 'month';
    }
  
    console.log('Dimension:', dimension);
  
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
  
    console.log('Response:', JSON.stringify(response, null, 2));
  
    const startYear = parseInt(startDate.substring(0, 4), 10);
    const startMonth = parseInt(startDate.substring(5, 7), 10);
  
    const data = response.rows.map(row => {
      const dateFormatted = this.formatDate(row.dimensionValues[0].value, interval, startYear, startMonth);
      console.log('Formatted Date:', dateFormatted);
      return {
        date: dateFormatted,
        visits: parseInt(row.metricValues[0].value, 10),
      };
    });
  
    console.log('Data before sorting:', data);
  
    // Ordenar los datos por fecha
    data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
    console.log('Data after sorting:', data);
  
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
    console.log('Formatting date with value:', value, 'interval:', interval);
    if (interval === 'daily') {
      return `${value.substring(0, 4)}-${value.substring(4, 6)}-${value.substring(6, 8)}`;
    } else if (interval === 'weekly') {
      const week = parseInt(value, 10);
      console.log('Week:', week);
      return this.getDateRangeForWeek(startYear, week);
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
    console.log('First day of year:', firstDayOfYear);
    const daysOffset = ((week - 1) * 7) + (firstDayOfYear.getDay() <= 4 ? 1 - firstDayOfYear.getDay() : 8 - firstDayOfYear.getDay());
    console.log('Days offset:', daysOffset);
    const startDate = new Date(year, 0, 1 + daysOffset);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
  
    console.log('Start date:', startDate, 'End date:', endDate);
  
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
