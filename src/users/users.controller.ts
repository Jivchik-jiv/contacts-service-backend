import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { UsersService } from './users.service';
import { Public } from '../decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { ExtendedRequest } from '../common/extended-requset.interface';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailService } from 'src/email/email.service';
import { nanoid } from 'nanoid';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import * as fse from 'fs-extra';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService,
    private readonly emailService: EmailService,
    private readonly cloudinaryService: CloudinaryService,) { }

  @Public()
  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    const { email, name } = registerUserDto;
    const verifyToken = nanoid();

    try {
      await this.emailService.sendEmail(verifyToken, name, email);
    } catch (error) {
      console.log(
        '🚀 ~ file: users.service.ts:32 ~ UsersService ~ register ~ error:',
        error.message,
      );
      throw new BadRequestException("Problem with email service. Email may be invalid.")
    }


    return await this.usersService.register({ ...registerUserDto, verifyToken });
  }

  @Patch('avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads',
        filename: function (req, file, cb) {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  async updateAvatar(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
        ],
      }),
    )
    avatar: Express.Multer.File,
    @Req() req: ExtendedRequest,
  ) {

    const { secure_url, public_id } = await this.cloudinaryService.uploadAvatar(
      avatar.path,
    );
    const { oldAvatar } = await this.usersService.updateAvatar(req.user.id, secure_url, public_id)

    if (oldAvatar) {
      this.cloudinaryService.deleteAvatar(oldAvatar);
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

  @Get()
  getCurrentUser(@Req() req: ExtendedRequest) {
    const { name, email, avatar, id } = req.user;
    return { name, email, avatar, id };
  }

  @Patch('password')
  async updatePassword(
    @Req() req: ExtendedRequest,
    @Body() body: UpdatePasswordDto,
  ) {
    return this.usersService.updatePassword(
      req.user.id,
      body.oldPassword,
      body.newPassword,
    );
  }

  @Patch('update')
  async updateUser(
    @Req() req: ExtendedRequest,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(req.user.id, updateUserDto);
  }

  @Get('verify/:verifyToken')
  @Public()
  async verify(@Param('verifyToken') verifyToken: string) {
    return await this.usersService.verifyUser(verifyToken);
  }
}
