import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false, timestamps: true })
export class User {
  @Prop({ required: [true, 'Name is required'] })
  name: string;

  @Prop({ required: [true, 'Email is required'] })
  email: string;

  @Prop({ required: [true, 'Password is required'] })
  password: string;

  @Prop({ default: null })
  avatar: string;

  @Prop({ default: null })
  cloudAvatarId: string;

  @Prop({ default: null })
  token: string;

  @Prop({ type: String, required: [true, 'Verify Token is required'] })
  verifyToken: string;

  @Prop({ default: false })
  verified: boolean;

  validatePassword: (password: string) => Promise<boolean>;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.validatePassword = async function (
  password: string,
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

export interface ExtendedUserDocument extends User {
  id: string;
}
