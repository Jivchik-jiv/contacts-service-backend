import { IsString, IsEmail, MaxLength } from 'class-validator';

export class SignInDto {
  @IsEmail()
  @MaxLength(100)
  readonly email: string;

  @IsString()
  @MaxLength(20)
  readonly password: string;
}
