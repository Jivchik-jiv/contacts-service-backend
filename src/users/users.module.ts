import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UsersRepository } from './users.repository';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { EmailModule } from '../email/email.module';
import { IsUserAlreadyExistConstraint } from './helpers/users.validators';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    CloudinaryModule,
    EmailModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, IsUserAlreadyExistConstraint],
  exports: [UsersService],
})
export class UsersModule { }
