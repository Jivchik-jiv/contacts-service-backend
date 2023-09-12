import { IsString, IsEmail, MaxLength } from 'class-validator';
import { IsCredentialsCorrect } from '../helpers/auth.validators';

export class SignInDto {
  @IsEmail()
  @MaxLength(100)
  @IsCredentialsCorrect({
    message: 'Wrong credentials!',
  })
  readonly email: string;

  @IsString()
  @MaxLength(20)
  readonly password: string;
}
