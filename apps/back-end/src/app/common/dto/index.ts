import { IsNotEmpty, IsString } from 'class-validator';

export class VoidEntityDto {
  @IsString()
  @IsNotEmpty()
  voidedReason: string;
}

export class VoidAuditDto {
  voided: true;
  voidedBy: string;
  voidedDate: Date;
  voidedReason: string;
}

export class UpdateAuditDto {
  updatedBy: string;
}

export class CreateAuditDto {
  voided: boolean;
  createdBy: string;
}

export enum OperatorType {
  In = 'IN',
  NotIn = 'NOT IN',
  Equals = 'EQUALS',
  NotEqual = 'NOT EQUAL',
  GreaterThan = 'GREATER THAN',
  LessThan = 'LESS THAN',
}
