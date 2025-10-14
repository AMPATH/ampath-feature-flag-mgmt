import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  Generated,
  UpdateDateColumn,
} from 'typeorm';
import { Rules } from '../../rules/entity/rules.entity';

@Entity('operators')
export class Operator {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Generated('uuid')
  uuid: string;

  @Column({ nullable: false, unique: true })
  name: string;

  @Column({ nullable: false })
  description: string;

  @CreateDateColumn({ nullable: false })
  dateCreated: Date;

  @Column({ nullable: true })
  createdBy: string;

  @OneToMany(() => Rules, (rules) => rules.operator, { cascade: true })
  rules: Rules[];

  @UpdateDateColumn({ nullable: true })
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
