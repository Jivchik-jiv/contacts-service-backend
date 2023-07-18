import { Readable } from 'stream';
import { ExtendedUserDocument } from './schemas/user.schema';
import { ExtendedRequest } from '../common/extended-requset.interface';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';

export const UserMockFactory = (): ExtendedUserDocument => {
    return {
        name: 'name',
        email: 'email',
        password: 'password',
        avatar: 'avatar',
        cloudAvatarId: 'id',
        id: 'id',
        verifyToken: 'verifyToken',
        token: 'token',
        verified: true,
        validatePassword: () => Promise.resolve(true),
    };
};

export const MulterFileMockFactory = (): Express.Multer.File => {
    const stream = new Readable();

    return {
        originalname: 'string',
        mimetype: 'string',
        path: 'string',
        buffer: Buffer.from('whatever'),
        fieldname: 'string',
        encoding: 'string',
        size: 55,
        stream,
        destination: 'string',
        filename: 'string',
    };
};

export const ExtendedRequestMockFactory = (): ExtendedRequest => {
    return {
        user: UserMockFactory(),
    } as ExtendedRequest;
};

export const RegisterUserDtoMockFactory = (): RegisterUserDto => {
    return { name: 'new name', email: 'new email', password: 'new password' };
};

export const UpdatePasswordDtoMockFactory = (): UpdatePasswordDto => {
    return {
        oldPassword: 'oldPassword',
        newPassword: 'newPasswordL',
    };
};

export const UpdateUserDtoMockFactory = (): UpdateUserDto => {
    return {
        name: 'New name',
    };
};
