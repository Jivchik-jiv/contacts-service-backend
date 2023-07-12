import { Request } from 'express';
import { UserDocument } from 'src/users/schemas/user.schema';

export interface ExtendedRequest extends Request {
  user: UserDocument;
}
