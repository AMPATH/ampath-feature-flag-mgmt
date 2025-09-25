import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFeatureFlagDto } from './dto/create-feature-flag.dto';
import { FeatureFlag } from './entity/create-feature-flag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateFeatureFlagDto } from './dto/update-feature-flag.dto';

@Injectable()
export class FeatureFlagService {
  constructor(
    @InjectRepository(FeatureFlag)
    private featureflagRepository: Repository<FeatureFlag>
  ) {}

  create(createfeatureflagDto: CreateFeatureFlagDto): Promise<FeatureFlag> {
    try {
      const featureflag =
        this.featureflagRepository.create(createfeatureflagDto);
      return this.featureflagRepository.save(featureflag);
    } catch {
      throw new HttpException(
        'Error creating feature flag',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  findAll(): Promise<FeatureFlag[]> {
    try {
      return this.featureflagRepository.find();
    } catch {
      throw new HttpException(
        'Error fetching feature flags',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getByName(name: string): Promise<FeatureFlag> {
    try {
      const featureFlag = await this.featureflagRepository.findOneBy({ name });
      if (!featureFlag) {
        throw new HttpException('Feature flag not found', HttpStatus.NOT_FOUND);
      }
      return featureFlag;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error fetching feature flag',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  findOne(id: number): Promise<FeatureFlag> {
    try {
      return this.featureflagRepository.findOneBy({ id });
    } catch {
      throw new HttpException(
        `Error fetching feature flag`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(
    id: number,
    updatefeatureflagDto: UpdateFeatureFlagDto
  ): Promise<FeatureFlag> {
    try {
      const feature = await this.featureflagRepository.preload({
        id,
        ...updatefeatureflagDto,
      });
      if (!feature) {
        throw new Error(`FeatureFlag with id ${id} not found`);
      }
      return this.featureflagRepository.save(feature);
    } catch {
      throw new HttpException(
        `Error updating feature flag`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async remove(id: number): Promise<string> {
    const result = await this.featureflagRepository.delete(id);
    if (result.affected === 0) {
      throw new Error(`FeatureFlag with id ${id} not found`);
    }
    return `FeatureFlag with id ${id} has been deleted`;
  }
}
