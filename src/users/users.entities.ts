import { RegisterUserDto } from './dto/register-user.dto';
import { User } from './schemas/user.schema';

export interface RegisterUserExtended extends RegisterUserDto {
  verifyToken: string;
}

export interface FindUserInterface {
  email: string;
  verifyToken: string;
  _id: string;
}


export interface UpdateUserInterface extends User {

}