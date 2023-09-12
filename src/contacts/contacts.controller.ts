import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
  Query,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ExtendedRequest } from '../common/extended-requset.interface';
import * as fse from 'fs-extra';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

interface FindAllQuery {
  limit: number;
  skip: number;
}

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService, private readonly cloudinaryService: CloudinaryService) { }

  @Post()
  async create(
    @Req() req: ExtendedRequest,
    @Body() createContactDto: CreateContactDto,
  ) {
    return await this.contactsService.create(req.user.id, createContactDto);
  }

  @Get()
  async findAll(
    @Req() req: ExtendedRequest,
    @Query() { limit = 20, skip = 0 }: FindAllQuery,
  ) {
    return await this.contactsService.findAll(req.user.id, limit, skip);
  }

  @Get(':id')
  async findOne(@Req() req: ExtendedRequest, @Param('id') id: string) {
    return await this.contactsService.findOne(req.user.id, id);
  }

  @Patch(':id')
  async update(
    @Req() req: ExtendedRequest,
    @Param('id') id: string,
    @Body() updateContactDto: UpdateContactDto,
  ) {
    return await this.contactsService.update(req.user.id, id, updateContactDto);
  }

  @Patch(':id/avatar')
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
    @Req() req: ExtendedRequest,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
        ],
      }),
    )
    avatar: Express.Multer.File,
    @Param('id') id: string,
  ) {

    const { secure_url, public_id } = await this.cloudinaryService.uploadAvatar(
      avatar.path,
    );

    const { oldAvatar } = await this.contactsService.updateAvatar(req.user.id, id, secure_url, public_id);

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

  @Patch(':id/friends')
  async updateFriends(
    @Req() req: ExtendedRequest,
    @Param('id') id: string,
    @Body('isFriend') isFriend: boolean,
  ) {
    return await this.contactsService.updateFriends(req.user.id, id, isFriend);
  }

  @Delete(':id')
  async remove(@Req() req: ExtendedRequest, @Param('id') id: string) {
    return await this.contactsService.remove(req.user.id, id);
  }
}
