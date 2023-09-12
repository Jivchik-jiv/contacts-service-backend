import { PartialType } from '@nestjs/mapped-types';
import { CreateContactDto } from './create-contact.dto';
import { IsOptional } from 'class-validator';

export class UpdateContactDto extends PartialType(CreateContactDto) {
  @IsOptional()
  readonly name: string;

  @IsOptional()
  readonly phone: string;

  @IsOptional()
  readonly email: string | null;

  @IsOptional()
  readonly company: string | null;
}
