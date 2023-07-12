import { ConflictException, Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { RegisterUserDto } from './dto/register-user.dto';
import * as gravatar from 'gravatar';
import { nanoid } from 'nanoid';
import { hashPassword } from 'src/utils/bcrypt';
// import { Express } from 'express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import * as fse from 'fs-extra';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly cloudinaryService: CloudinaryService,
    private readonly emailService: EmailService,
  ) { }

  async register(registerUserDto: RegisterUserDto) {
    const { email, name, password } = registerUserDto;

    const user = await this.usersRepository.findByField({ email });

    if (user) {
      throw new ConflictException(
        'This email is already associated with an account.',
      );
    }

    const verifyToken = nanoid();
    console.log("🚀 ~ file: users.service.ts:32 ~ UsersService ~ register ~ verifyToken:", verifyToken)
    try {
      await this.emailService.sendEmail(
        verifyToken,
        name,
        email,
      );

    } catch (error) {
      console.log(
        '🚀 ~ file: users.service.ts:32 ~ UsersService ~ register ~ error:',
        error.message,
      );
      return 'Looks like email is wrong';
    }
    const hashPass = hashPassword(password);

    const newUser = await this.usersRepository.register({
      name,
      email,
      verifyToken,
      password: hashPass,
    });

    if (newUser) {
      newUser.avatar = gravatar.url(
        newUser.email,
        { s: '250', d: 'robohash' },
        true,
      );
    }
    return newUser;
  }

  async findByEmail(email: string) {
    return await this.usersRepository.findByField({ email });
  }

  async findById(userId: string) {
    const user = await this.usersRepository.findByField({ _id: userId });
    user.avatar = gravatar.url(user.email, { s: '250', d: 'robohash' }, true);
    return user;
  }

  async updateAvatar(userId: string, avatar: Express.Multer.File) {
    const oldAvatar = await this.usersRepository.getAvatar(userId);

    const { secure_url, public_id } = await this.cloudinaryService.uploadAvatar(
      avatar.path,
    );

    await this.usersRepository.updateUser(userId, {
      avatar: secure_url,
      cloudAvatarId: public_id,
    });

    if (oldAvatar.cloudAvatarId) {
      this.cloudinaryService.deleteAvatar(oldAvatar.cloudAvatarId);
    }

    try {
      fse.remove(avatar.path);
    } catch (error) {
      console.log(
        '🚀 ~ file: users.service.ts:60 ~ UsersService ~ updateAvatar ~ error:',
        error,
      );
    }

    return { newAvatar: secure_url };
  }

  async updatePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    const user = await this.usersRepository.findByField({ _id: userId });

    if (user) {
      const passValid = user.validatePassword(oldPassword);

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

  async updateName(userId: string, name: string) {
    await this.usersRepository.updateUser(userId, { name });
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
