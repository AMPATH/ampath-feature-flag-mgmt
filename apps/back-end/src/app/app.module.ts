import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { DatabaseModule } from './core/database/db.module';
import { FeatureFlagModule } from './feature-flag/feature-flag.module';
import { RulesModule } from './rules/rules.module';
import { OperatorsModule } from './operators/operators.module';
import { AttributesModule } from './attributes/attributes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_HOST: Joi.string().required(),
        DATABASE_PORT: Joi.number().required(),
        DATABASE_USER: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),
        SYNCHRONIZE_DATABASE: Joi.boolean().required(),
      }),
    }),
    DatabaseModule,
    FeatureFlagModule,
    RulesModule,
    AttributesModule,
    OperatorsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
