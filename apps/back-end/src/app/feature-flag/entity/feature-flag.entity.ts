import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  Entity,
  OneToMany,
  Generated,
} from 'typeorm';
import { Rules } from '../../rules/entity/rules.entity';

@Entity('feature_flags')
export class FeatureFlag {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Generated('uuid')
  uuid: string;

  @Column({ nullable: false, unique: true })
  name: string;

  @Column({ nullable: false })
  description: string;

  @Column({ default: true })
  status: boolean;

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

  @OneToMany(() => Rules, (rules) => rules.featureFlag, { cascade: true })
  rules: Rules[];
}
