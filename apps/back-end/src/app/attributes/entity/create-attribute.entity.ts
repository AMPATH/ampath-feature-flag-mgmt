import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  Generated,
} from 'typeorm';
import { Rules } from '../../rules/entity/rules.entity';

@Entity('attributes')
export class Attribute {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Generated('uuid')
  uuid: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn({ nullable: false })
  dateCreated: Date;
  @OneToMany(() => Rules, (rules) => rules.attribute, { cascade: true })
  rules: Rules[];
}
