import { RegisterUserDto } from './dto/register-user.dto';

export interface RegisterUserExtended extends RegisterUserDto {
  verifyToken: string;
}

export interface FindUserInterface {
  email: string;
  verifyToken: string;
  _id: string;
}
