import {
  IsString, IsEmail, MinLength, MaxLength
} from 'class-validator';
import { IsUserAlreadyExist } from '../helpers/users.validators';

export class RegisterUserDto {
  @IsEmail()
  @MaxLength(45)
  @IsUserAlreadyExist({
    message: 'Email $value is already associated with an account. Choose another email or login.',
  })
  readonly email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(15)
  readonly password: string;

  @IsString()
  @MinLength(2)
  @MaxLength(25)
  readonly name: string;
};

