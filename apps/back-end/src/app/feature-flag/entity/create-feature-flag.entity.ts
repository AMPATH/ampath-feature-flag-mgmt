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

  @Column({ nullable: false })
  createdBy: string;

  @CreateDateColumn({ nullable: false })
  createdAt: Date;

  @Column({ nullable: true })
  updatedBy: string;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;

  @Column({ default: false })
  retired: boolean;

  @Column({ nullable: true })
  retiredBy: string;

  @Column({ nullable: true })
  retiredDate: Date;

  @OneToMany(() => Rules, (rules) => rules.featureFlag, { cascade: true })
  rules: Rules[];
}
