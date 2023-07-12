import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { DEFAULT_CONTACT_AVATAR } from '../constants';

export type ContactDocument = HydratedDocument<Contact>;

@Schema({ versionKey: false, timestamps: true })
export class Contact {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ default: null })
  email: string;

  @Prop({ default: null })
  company: string;

  @Prop({ default: DEFAULT_CONTACT_AVATAR })
  avatar: string;

  @Prop({ default: null })
  cloudAvatarId: string;

  @Prop({ default: false })
  isFriend: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: User;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
