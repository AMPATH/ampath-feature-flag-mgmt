import { Controller, Get } from '@nestjs/common';
import { LocationService } from './location.service';

@Controller('locations')
export class LocationController {
  constructor(private locationService: LocationService) {}

  @Get()
  getAll() {
    return this.locationService.getAllLocations();
  }
}
