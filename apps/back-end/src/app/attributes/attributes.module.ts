import { Module } from '@nestjs/common';
import { AttributesController } from './attributes.controller';
import { AttributesService } from './attributes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attribute } from './entity/attribute.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Attribute])],
  controllers: [AttributesController],
  providers: [AttributesService],
})
export class AttributesModule {}
