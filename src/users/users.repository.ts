import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { FindUserInterface, RegisterUserExtended } from './users.entities';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  async register(registerUserObj: RegisterUserExtended) {
    const user = await this.userModel.create(registerUserObj);
    return user;
  }

  async findByField(field: Partial<FindUserInterface>) {
    const user = await this.userModel.findOne(field);
    return user;
  }

  async getAvatar(userId: string) {
    const result = await this.userModel
      .findById(userId)
      .select('avatar cloudAvatarId');
    return result;
  }

  async updateUser(id: string, updateObj: any) {
    const user = await this.userModel.findByIdAndUpdate(id, updateObj, {
      new: true,
    });
    return user;
  }
}
