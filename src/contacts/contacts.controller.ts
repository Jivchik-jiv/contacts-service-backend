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

interface FindAllQuery {
  limit: number;
  skip: number;
}

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

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
    return await this.contactsService.updateAvatar(req.user.id, id, avatar);
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
