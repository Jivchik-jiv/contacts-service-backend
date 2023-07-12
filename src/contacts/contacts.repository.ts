import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateContactDto } from './dto/create-contact.dto';
import { Contact } from './schemas/contact.schema';
import { UpdateContactInterface } from './contacts.entities';

@Injectable()
export class ContactsRepository {
  constructor(
    @InjectModel(Contact.name) private contactModel: Model<Contact>,
  ) { }

  async create(createContactDto: CreateContactDto, userId: string) {
    const contact = await this.contactModel.create({
      ...createContactDto,
      owner: userId,
    });
    return contact;
  }

  async findAll(userId: string, limit: number, skip: number) {
    const contacts = await this.contactModel
      .find({ owner: userId })
      .limit(limit)
      .skip(skip);
    return contacts;
  }

  async countContacts(userId: string) {
    return await this.contactModel.countDocuments({ owner: userId })
  }

  async findOne(userId: string, id: string) {
    const contact = await this.contactModel.findOne({ owner: userId, _id: id });
    return contact;
  }

  async update(
    userId: string,
    id: string,
    updateObj: Partial<UpdateContactInterface>,
  ) {
    const contact = await this.contactModel.findOneAndUpdate(
      { owner: userId, _id: id },
      updateObj,
      { new: true },
    );
    return contact;
  }

  async remove(userId: string, id: string) {
    const contact = await this.contactModel.findOneAndRemove({
      owner: userId,
      _id: id,
    });
    return contact;
  }

  async getAvatar(userId: string, id: string) {
    const result = await this.contactModel
      .findOne({ owner: userId, _id: id })
      .select('avatar cloudAvatarId');
    return result;
  }
}
