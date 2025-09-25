import { Test, TestingModule } from '@nestjs/testing';
import { FeatureFlagController } from './feature-flag.controller';
import '@types/jest';

describe('FeatureFlagController', () => {
  let controller: FeatureFlagController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeatureFlagController],
    }).compile();

    controller = module.get<FeatureFlagController>(FeatureFlagController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
