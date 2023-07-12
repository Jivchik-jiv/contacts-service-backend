import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class CreateContactDto {
  @IsString()
  @MinLength(2)
  @MaxLength(25)
  readonly name: string;

  @IsString()
  @MinLength(2)
  @MaxLength(25)
  readonly phone: string;

  @IsOptional()
  @IsEmail()
  @MinLength(5)
  @MaxLength(45)
  readonly email: string;

  @IsOptional()
  @IsString()
  @MaxLength(45)
  readonly company: string;
}
