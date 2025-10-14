import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Generated,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FeatureFlag } from '../../feature-flag/entity/feature-flag.entity';
import { Attribute } from '../../attributes/entity/attribute.entity';
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

  @Column({ nullable: true })
  createdBy: string;

  @CreateDateColumn({ nullable: true })
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @Column({ nullable: true })
  updatedBy: string;

  @Column({ nullable: true })
  voided: boolean;

  @Column({ nullable: true, type: 'timestamp' })
  voidedDate: Date;

  @Column({ nullable: true })
  voidedBy: string;

  @Column({ nullable: true })
  voidedReason: string;
}
