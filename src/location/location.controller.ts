import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { LocationService } from './location.service';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  // ✅ TEST API (VERY IMPORTANT)
  @Get('test')
  test() {
    return {
      success: true,
      message: 'Location API working ✅',
    };
  }

  // ✅ SAVE LOCATION
  @Post('save')
  async save(@Body() body: any) {
    const data = await this.locationService.saveLocation(body);

    return {
      success: true,
      message: 'Location saved successfully',
      data: data,
    };
  }

  // ✅ GET HISTORY
  @Get('history')
  async getHistory(@Query('userId') userId: string) {
    const data = await this.locationService.getUserLocations(userId);

    return {
      success: true,
      count: data.length,
      data,
    };
  }

  // ✅ GET LATEST LOCATION (NEW)
  @Get('latest')
  async getLatest(@Query('userId') userId: string) {
    const data = await this.locationService.getUserLocations(userId);

    return {
      success: true,
      data,
    };
  }
}
