import { Test } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ExtendedRequest } from '../common/extended-requset.interface';
import {
  ExtendedRequestMockFactory,
  MulterFileMockFactory,
  RegisterUserDtoMockFactory,
  UpdatePasswordDtoMockFactory,
  UpdateUserDtoMockFactory,
} from './users.mock.factories';

describe('UsersController', () => {
  let usersController: UsersController;
  let extendedReq: ExtendedRequest;

  const mockUserService = {
    register: jest.fn(),
    updateAvatar: jest.fn(),
    getCurrentUser: jest.fn(),
    updatePassword: jest.fn(),
    updateUser: jest.fn(),
    verifyUser: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUserService)
      .compile();

    usersController = module.get<UsersController>(UsersController);

    extendedReq = ExtendedRequestMockFactory();
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  it('should register user', () => {
    const userData = RegisterUserDtoMockFactory();
    expect(usersController.register(userData)).toBeDefined();
    expect(mockUserService.register).toHaveBeenCalledWith(userData);
    expect(mockUserService.register).toHaveBeenCalledTimes(1);
  });

  it('should update avatar', () => {
    const file = MulterFileMockFactory();

    expect(usersController.updateAvatar(file, extendedReq)).toBeDefined();
    expect(mockUserService.updateAvatar).toHaveBeenCalledWith(
      extendedReq.user.id,
      file,
    );
    expect(mockUserService.updateAvatar).toHaveBeenCalledTimes(1);
  });

  it('should return curent user', () => {
    const { email, name, avatar } = extendedReq.user;

    expect(usersController.getCurrentUser(extendedReq)).toEqual({
      email,
      name,
      avatar,
    });
  });

  it('should update password', () => {
    const updtPassObj = UpdatePasswordDtoMockFactory();

    expect(
      usersController.updatePassword(extendedReq, updtPassObj),
    ).toBeDefined();
    expect(mockUserService.updatePassword).toHaveBeenCalledWith(
      extendedReq.user.id,
      updtPassObj.oldPassword,
      updtPassObj.newPassword,
    );
    expect(mockUserService.updatePassword).toHaveBeenCalledTimes(1);
  });

  it('should update user', () => {
    const updtUserObj = UpdateUserDtoMockFactory();

    expect(usersController.updateUser(extendedReq, updtUserObj)).toBeDefined();

    expect(mockUserService.updateUser).toHaveBeenCalledWith(
      extendedReq.user.id,
      updtUserObj,
    );
    expect(mockUserService.updateUser).toHaveBeenCalledTimes(1);
  });

  it('should verify user', () => {
    const verifyToken = 'verifyToken';
    expect(usersController.verify(verifyToken)).toBeDefined();
    expect(mockUserService.verifyUser).toBeCalledWith(verifyToken);
    expect(mockUserService.verifyUser).toBeCalledTimes(1);
  });
});
