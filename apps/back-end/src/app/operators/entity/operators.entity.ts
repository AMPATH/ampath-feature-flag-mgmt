import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  Generated,
} from 'typeorm';
import { Rules } from '../../rules/entity/rules.entity';

@Entity('operators')
export class Operator {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Generated('uuid')
  uuid: string;

  @Column({ nullable: false })
  name: string;
  @Column({ nullable: false })
  description: string;

  @CreateDateColumn({ nullable: false })
  dateCreated: Date;

  @OneToMany(() => Rules, (rules) => rules.operator, { cascade: true })
  rules: Rules[];
}
