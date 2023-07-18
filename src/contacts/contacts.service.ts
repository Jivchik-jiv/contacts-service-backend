import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ContactsRepository } from './contacts.repository';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import * as fse from 'fs-extra';

@Injectable()
export class ContactsService {
  constructor(
    private readonly contactsRepository: ContactsRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(userId: string, createContactDto: CreateContactDto) {
    return await this.contactsRepository.create(createContactDto, userId);
  }

  async findAll(userId: string, limit: number, skip: number) {
    const count = await this.contactsRepository.countContacts(userId);

    const pageTotal = Math.floor((count - 1) / limit) + 1;

    const contacts = await this.contactsRepository.findAll(userId, limit, skip);

    return { contacts, totalCount: count, limit, pageTotal, skip };
  }

  async findOne(userId: string, id: string) {
    return await this.contactsRepository.findOne(userId, id);
  }

  async update(userId: string, id: string, updateContactDto: UpdateContactDto) {
    return await this.contactsRepository.update(userId, id, updateContactDto);
  }

  async updateAvatar(userId: string, id: string, avatar: Express.Multer.File) {
    const oldAvatar = await this.contactsRepository.findOne(userId, id);

    const { secure_url, public_id } = await this.cloudinaryService.uploadAvatar(
      avatar.path,
    );

    await this.contactsRepository.update(userId, id, {
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

  async updateFriends(userId: string, id: string, isFriend: boolean) {
    return await this.contactsRepository.update(userId, id, { isFriend });
  }

  async remove(userId: string, id: string) {
    return await this.contactsRepository.remove(userId, id);
  }
}
