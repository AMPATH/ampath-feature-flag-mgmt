import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeatureFlag } from '../../feature-flag/entity/create-feature-flag.entity';
import { Attribute } from '../../attributes/entity/create-attribute.entity';
import { Operator } from '../../operators/entity/operators.entity';
import { Rules } from '../../rules/entity/rules.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [FeatureFlag, Attribute, Operator, Rules],
        poolSize: 5,
        synchronize: configService.get<boolean>('SYNCHRONIZE_DATABASE'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
