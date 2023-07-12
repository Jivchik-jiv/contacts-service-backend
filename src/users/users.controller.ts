import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Req,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { UsersService } from './users.service';
import { Public } from 'src/decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { ExtendedRequest } from 'src/common/extended-requset.interface';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return await this.usersService.register(registerUserDto);
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
    return await this.usersService.updateAvatar(req.user.id, avatar);
  }

  @Get()
  async getCurrentUser(@Req() req: ExtendedRequest) {
    const { name, email, avatar } = await this.usersService.findById(
      req.user.id,
    );
    return { name, email, avatar };
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
  async updateUser(@Req() req: ExtendedRequest, @Body() body: UpdateUserDto) {
    return this.usersService.updateName(req.user.id, body.name);
  }

  @Get('verify/:verifyToken')
  @Public()
  async verify(@Param('verifyToken') verifyToke: string) {
    return await this.usersService.verifyUser(verifyToke);
  }
}
