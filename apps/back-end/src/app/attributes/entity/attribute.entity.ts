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

@Entity('attributes')
export class Attribute {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Generated('uuid')
  uuid: string;

  @Column({ nullable: false, unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn({ nullable: false })
  dateCreated: Date;
  @OneToMany(() => Rules, (rules) => rules.attribute, { cascade: true })
  rules: Rules[];

  @Column()
  createdBy: string;

  @UpdateDateColumn()
  updatedDate: Date;

  @Column()
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
