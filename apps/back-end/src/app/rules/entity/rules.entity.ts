import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Generated,
  ManyToOne,
} from 'typeorm';
import { FeatureFlag } from '../../feature-flag/entity/create-feature-flag.entity';
import { Attribute } from '../../attributes/entity/create-attribute.entity';
import { Operator } from '../../operators/entity/operators.entity';

@Entity('rules')
export class Rules {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => FeatureFlag, (featureFlag) => featureFlag.rules, {
    eager: true,
  })
  featureFlag: FeatureFlag;
  @ManyToOne(() => Attribute, (attribute) => attribute.id, {
    eager: true,
  })
  attribute: Attribute;
  @ManyToOne(() => Operator, (operator) => operator.id, {
    eager: true,
  })
  operator: Operator;
  @Column({ nullable: false })
  value: string;
  @Column({ unique: true })
  @Generated('uuid')
  uuid: string;
}
