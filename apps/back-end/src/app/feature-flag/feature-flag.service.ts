import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFeatureFlagDto } from './dto/create-feature-flag.dto';
import { FeatureFlag } from './entity/feature-flag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateFeatureFlagDto } from './dto/update-feature-flag.dto';
import { AmrsUser } from '../auth/dto/amrs-auth.dto';
import {
  CreateAuditDto,
  UpdateAuditDto,
  VoidAuditDto,
  VoidEntityDto,
} from '../common/dto';

@Injectable()
export class FeatureFlagService {
  constructor(
    @InjectRepository(FeatureFlag)
    private featureflagRepository: Repository<FeatureFlag>
  ) {}

  async create(
    createfeatureflagDto: CreateFeatureFlagDto,
    user: AmrsUser
  ): Promise<FeatureFlag> {
    const ff = await this.featureflagRepository.findOneBy({
      name: createfeatureflagDto.name,
    });
    if (ff) {
      throw new HttpException(
        'Feature Flag with the name already exists!',
        HttpStatus.BAD_REQUEST
      );
    }
    try {
      const featureflagEntity =
        this.featureflagRepository.create(createfeatureflagDto);
      const createFeatureFlagAuditInfo: CreateAuditDto = {
        voided: false,
        createdBy: user.username,
      };
      return this.featureflagRepository.save({
        ...featureflagEntity,
        ...createFeatureFlagAuditInfo,
      });
    } catch {
      throw new HttpException(
        'Error creating feature flag',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  findAll(): Promise<FeatureFlag[]> {
    try {
      return this.featureflagRepository.findBy({
        voided: false,
      });
    } catch {
      throw new HttpException(
        'Error fetching feature flags',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getByName(name: string): Promise<FeatureFlag> {
    try {
      const featureFlag = await this.featureflagRepository.findOneBy({
        name: name,
        voided: false,
      });
      if (!featureFlag) {
        throw new NotFoundException();
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
    updatefeatureflagDto: UpdateFeatureFlagDto,
    user: AmrsUser
  ): Promise<FeatureFlag> {
    const ff = await this.featureflagRepository.findOneBy({
      id: id,
    });
    if (!ff) {
      throw new NotFoundException();
    }
    try {
      const featureFlagUpdateAuditInfo: UpdateAuditDto = {
        updatedBy: user.username,
      };

      const feature = this.featureflagRepository.create({
        ...ff,
        ...updatefeatureflagDto,
        ...featureFlagUpdateAuditInfo,
      });
      return this.featureflagRepository.save(feature);
    } catch {
      throw new HttpException(
        `Error updating feature flag`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async void(
    id: number,
    voidFeatureFlagDto: VoidEntityDto,
    user: AmrsUser
  ): Promise<FeatureFlag> {
    const featureFlag = await this.featureflagRepository.findOneBy({
      id: id,
    });
    if (!featureFlag) {
      throw new NotFoundException();
    }
    try {
      const voidAuditInfo: VoidAuditDto = {
        voided: true,
        voidedBy: user.username,
        voidedDate: new Date(),
        voidedReason: voidFeatureFlagDto.voidedReason,
      };
      const entity = this.featureflagRepository.create({
        ...featureFlag,
        ...voidAuditInfo,
      });
      return this.featureflagRepository.save(entity);
    } catch {
      throw new HttpException(
        'Error voiding feature flag',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
