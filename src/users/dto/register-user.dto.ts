import { IsString, IsEmail, MinLength, MaxLength } from 'class-validator';

export class RegisterUserDto {
  @IsEmail()
  @MaxLength(45)
  readonly email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(15)
  readonly password: string;

  @IsString()
  @MinLength(2)
  @MaxLength(25)
  readonly name: string;
}
