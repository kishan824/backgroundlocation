// location.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Location } from './location.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private repo: Repository<Location>,
  ) {}

  async saveLocation(data: any) {
    const location = this.repo.create(data);
    return this.repo.save(location);
  }



  // ✅ Get latest location
  async getLatestLocation(userId: string) {
    return this.repo.findOne({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }
}
