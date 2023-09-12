import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ContactsRepository } from './contacts.repository';

@Injectable()
export class ContactsService {
  constructor(
    private readonly contactsRepository: ContactsRepository,
  ) { }

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

  async updateAvatar(userId: string, id: string, avatar: string, cloudAvatarId: string) {

    let oldAvatar: any;
    let contact: any;
    try {
      oldAvatar = await this.contactsRepository.findOne(userId, id);
      contact = await this.contactsRepository.update(userId, id, {
        avatar,
        cloudAvatarId
      });
    } catch (error) {
      console.log("🚀 ~ file: contacts.service.ts:53 ~ ContactsService ~ updateAvatar ~ error:", error)
      throw new InternalServerErrorException("Error while updating avatar.")
    }

    return { oldAvatar: oldAvatar.cloudAvatarId, contact };
  }

  async updateFriends(userId: string, id: string, isFriend: boolean) {
    return await this.contactsRepository.update(userId, id, { isFriend });
  }

  async remove(userId: string, id: string) {
    return await this.contactsRepository.remove(userId, id);
  }
}
