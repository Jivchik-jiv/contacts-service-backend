import { ExtendedRequest } from '../common/extended-requset.interface';
import { ContactsController } from './contacts.controller';
import { Test } from '@nestjs/testing';
import { ContactsService } from './contacts.service';
import {
  ExtendedRequestMockFactory,
  MulterFileMockFactory,
} from '../users/users.mock.factories';
import { CreateContactDto } from './dto/create-contact.dto';

const CreateContactDtoMockFactory = (): CreateContactDto => {
  return {
    name: 'name',
    phone: 'phone',
    email: 'email',
    company: 'company',
  };
};

const UpdateContactDtoMockFactory = (): CreateContactDto => {
  return {
    name: 'name',
    phone: 'phone',
    email: 'email',
    company: 'company',
  };
};

describe('ContactsController', () => {
  let contactsController: ContactsController;
  let extendedReq: ExtendedRequest;

  const mockContactsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    updateAvatar: jest.fn(),
    updateFriends: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [ContactsController],
      providers: [ContactsService],
    })
      .overrideProvider(ContactsService)
      .useValue(mockContactsService)
      .compile();

    contactsController = module.get<ContactsController>(ContactsController);

    extendedReq = ExtendedRequestMockFactory();
  });

  it('should be defined', () => {
    expect(contactsController).toBeDefined();
  });

  it('should create contact', () => {
    const createContactObj = CreateContactDtoMockFactory();

    expect(
      contactsController.create(extendedReq, createContactObj),
    ).toBeDefined();
    expect(mockContactsService.create).toBeCalledWith(
      extendedReq.user.id,
      createContactObj,
    );
    expect(mockContactsService.create).toBeCalledTimes(1);
  });

  it('should find all contacts', () => {
    const limit = 0;
    const skip = 0;

    expect(
      contactsController.findAll(extendedReq, { limit, skip }),
    ).toBeDefined();
    expect(mockContactsService.findAll).toBeCalledWith(
      extendedReq.user.id,
      limit,
      skip,
    );
    expect(mockContactsService.findAll).toBeCalledTimes(1);
  });

  it('should find contact by id', () => {
    const id = 'id';

    expect(contactsController.findOne(extendedReq, id)).toBeDefined();
    expect(mockContactsService.findOne).toBeCalledWith(extendedReq.user.id, id);
    expect(mockContactsService.findOne).toBeCalledTimes(1);
  });

  it('should update contact', () => {
    const id = 'id';
    const updateContactObj = UpdateContactDtoMockFactory();

    expect(
      contactsController.update(extendedReq, id, updateContactObj),
    ).toBeDefined();
    expect(mockContactsService.update).toBeCalledWith(
      extendedReq.user.id,
      id,
      updateContactObj,
    );
    expect(mockContactsService.update).toBeCalledTimes(1);
  });

  it('should update contact avatar', () => {
    const id = 'id';
    const fileMock = MulterFileMockFactory();

    expect(
      contactsController.updateAvatar(extendedReq, fileMock, id),
    ).toBeDefined();
    expect(mockContactsService.updateAvatar).toBeCalledWith(
      extendedReq.user.id,
      id,
      fileMock,
    );
    expect(mockContactsService.updateAvatar).toBeCalledTimes(1);
  });

  it('should update friends', () => {
    const id = 'id';
    const isFriend = true;

    expect(
      contactsController.updateFriends(extendedReq, id, isFriend),
    ).toBeDefined();
    expect(mockContactsService.updateFriends).toBeCalledWith(
      extendedReq.user.id,
      id,
      isFriend,
    );
    expect(mockContactsService.updateFriends).toBeCalledTimes(1);
  });

  it('should remove contact', () => {
    const id = 'id';

    expect(contactsController.remove(extendedReq, id)).toBeDefined();
    expect(mockContactsService.remove).toBeCalledWith(extendedReq.user.id, id);
    expect(mockContactsService.remove).toBeCalledTimes(1);
  });
});
