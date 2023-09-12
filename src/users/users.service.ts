import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import * as gravatar from 'gravatar';
import { hashPassword } from '../utils/bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterUserExtended } from './users.entities';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
  ) { }

  async register(registerUserObj: RegisterUserExtended) {
    const hashPass = hashPassword(registerUserObj.password);

    const newUser = await this.usersRepository.register({
      ...registerUserObj,
      password: hashPass,
    });

    if (newUser) {
      newUser.avatar = gravatar.url(
        newUser.email,
        { s: '250', d: 'robohash' },
        true,
      );
    }
    console.log(
      '🚀 ~ file: users.service.ts:55 ~ UsersService ~ register ~ newUser:',
      newUser,
    );
    return newUser;
  }

  async findByEmail(email: string) {
    const user = await this.usersRepository.findByField({ email });

    if (!user) {
      return null;
    }

    if (!user.avatar) {
      user.avatar = gravatar.url(user.email, { s: '250', d: 'robohash' }, true);
    }
    return user;
  }

  async findById(userId: string) {
    const user = await this.usersRepository.findByField({ _id: userId });

    if (!user) {
      return null;
    }

    if (!user.avatar) {
      user.avatar = gravatar.url(user.email, { s: '250', d: 'robohash' }, true);
    }

    return user;
  }

  async updateAvatar(userId: string, avatar: string, cloudAvatarId: string) {

    let oldAvatar: any;
    let user: any;
    try {
      oldAvatar = await this.usersRepository.getAvatar(userId);
      user = await this.usersRepository.updateUser(userId, {
        avatar,
        cloudAvatarId,
      });
    } catch (error) {
      console.log("🚀 ~ file: users.service.ts:81 ~ UsersService ~ updateAvatar ~ error:", error)
      throw new InternalServerErrorException("Error while updating avatar.")
    }
    return { oldAvatar: oldAvatar.cloudAvatarId, user };

  }

  async updatePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    const user = await this.usersRepository.findByField({ _id: userId });

    if (user) {
      const passValid = await user.validatePassword(oldPassword);

      if (passValid) {
        const hashPass = hashPassword(newPassword);

        await this.usersRepository.updateUser(userId, { password: hashPass });

        return true;
      }
    }

    return false;
  }

  async updateToken(userId: string, token: string) {
    await this.usersRepository.updateUser(userId, { token });
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto) {
    const { name, email, id, avatar } = await this.usersRepository.updateUser(userId, { ...updateUserDto });
    return { name, email, id, avatar };
  }

  async verifyUser(verifyToken: string) {
    const user = await this.usersRepository.findByField({ verifyToken });

    if (user) {
      await this.usersRepository.updateUser(user.id, {
        verifyToken: null,
        verified: true,
      });

      return 'Email verified';
    }
  }
}
