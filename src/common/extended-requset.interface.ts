import { Request } from 'express';
import { ExtendedUserDocument } from 'src/users/schemas/user.schema';

export interface ExtendedRequest extends Request {
  user: ExtendedUserDocument;
}
