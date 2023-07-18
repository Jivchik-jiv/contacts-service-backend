import { ExtendedRequest } from '../common/extended-requset.interface';
import { AuthController } from './auth.controller';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ExtendedRequestMockFactory } from '../users/users.mock.factories';

describe('AuthController', () => {
  let authController: AuthController;
  let extendedReq: ExtendedRequest;

  const mocAuthService = {
    signIn: jest.fn(),
    signOut: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mocAuthService)
      .compile();

    authController = module.get<AuthController>(AuthController);

    extendedReq = ExtendedRequestMockFactory();
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should signin user', () => {
    const signInObj = {
      email: 'email',
      password: 'password',
    };

    expect(authController.signIn(signInObj)).toBeDefined();
    expect(mocAuthService.signIn).toHaveBeenCalledWith(signInObj);
    expect(mocAuthService.signIn).toHaveBeenCalledTimes(1);
  });

  it('should signout user', () => {
    expect(authController.signOut(extendedReq)).toBeDefined();
    expect(mocAuthService.signOut).toHaveBeenCalledWith(extendedReq.user.id);
    expect(mocAuthService.signOut).toHaveBeenCalledTimes(1);
  });
});
