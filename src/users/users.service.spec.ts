import { Test } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { EmailService } from "../email/email.service";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { UsersRepository } from "./users.repository";
import { ExtendedRequest } from "../common/extended-requset.interface";
import { ExtendedRequestMockFactory, MulterFileMockFactory, RegisterUserDtoMockFactory, UpdateUserDtoMockFactory } from "./users.mock.factories";
import * as fse from "fs-extra";
import { FindUserInterface } from "./users.entities";



const users = [{ name: "Real name", email: "Real Email", _id: "Real id", avatar: "avatar", validatePassword: jest.fn(() => true) }];



describe("UsersService", () => {

    let usersService: UsersService;
    let extendedReq: ExtendedRequest;
    let removeSpy: jest.SpyInstance<void, any[]>;




    const mockEmailService = {
        sendEmail: jest.fn(() => {

        })
    };

    const mockCloudinaryService = {
        uploadAvatar: jest.fn(() => {
            return { secure_url: "secure_url", public_id: "public_id" }
        }),
    };

    const mockUsersRepository = {
        findByField: jest.fn((field: Partial<FindUserInterface>) => {
            if (field.hasOwnProperty("_id")) {
                return extendedReq.user
            }
            const [prop] = Object.keys(field);

            if (extendedReq.user[prop] === field[prop]) {
                return extendedReq.user
            }
            return null;
        }),
        register: jest.fn(() => {
            return { name: "name" }
        }),
        getAvatar: jest.fn(() => {
            return {}
        }),
        updateUser: jest.fn()
    };


    beforeEach(async () => {

        removeSpy = jest.spyOn(fse, 'remove');


        const module = await Test.createTestingModule({
            providers: [
                UsersService,
                { provide: UsersRepository, useValue: mockUsersRepository },
                { provide: EmailService, useValue: mockEmailService },
                { provide: CloudinaryService, useValue: mockCloudinaryService },
            ],
        }).compile();

        usersService = module.get<UsersService>(UsersService);

        extendedReq = ExtendedRequestMockFactory();

    })

    it("should be defined", () => {
        expect(usersService).toBeDefined()
    });

    it("should register user", async () => {
        const { name, email, password } = RegisterUserDtoMockFactory();

        const result = await usersService.register({ name, email, password })
        expect(result).toHaveProperty("name");
        expect(result).toHaveProperty("avatar");
        expect(mockUsersRepository.findByField).toHaveBeenCalledWith({ email });
        expect(mockEmailService.sendEmail).toHaveBeenCalledWith(expect.any(String), name, email);
        expect(mockUsersRepository.register)
            .toHaveBeenCalledWith({ name, email, verifyToken: expect.any(String), password: expect.any(String) });
    });

    it("should find user by email", () => {
        const { email } = extendedReq.user;
        expect(usersService.findByEmail("email")).toBeDefined()
        expect(mockUsersRepository.findByField).toHaveBeenCalledWith({ email })
    })

    it("should find user by id", () => {
        const userId = extendedReq.user.id;
        expect(usersService.findById(userId)).toBeDefined()
        expect(mockUsersRepository.findByField).toHaveBeenCalledWith({ _id: userId })
    })

    it("should update avatar", async () => {
        const userId = users[0]._id;
        const file = MulterFileMockFactory();
        const updateObj = { avatar: "secure_url", cloudAvatarId: "public_id" };

        expect(await usersService.updateAvatar(userId, file)).toBeDefined();
        expect(mockUsersRepository.getAvatar).toHaveBeenCalledWith(userId);
        expect(mockCloudinaryService.uploadAvatar).toHaveBeenCalledWith(file.path);
        expect(mockUsersRepository.updateUser).toHaveBeenCalledWith(userId, updateObj);
        expect(fse.remove).toHaveBeenCalledWith(file.path)

    })


    it("should update password", async () => {
        const userId = users[0]._id;
        const newPassword = "newPassword";
        const oldPassword = "oldPassword"
        expect(await usersService.updatePassword(userId, oldPassword, newPassword)).toBeDefined();
        expect(mockUsersRepository.findByField).toHaveBeenCalledWith({ _id: userId });
        expect(mockUsersRepository.updateUser).toHaveBeenCalledWith(userId, { password: expect.any(String) })

    })

    it("should update token", () => {
        const userId = extendedReq.user.id;
        const token = "token"
        expect(usersService.updateToken(userId, token)).toBeDefined()
        expect(mockUsersRepository.updateUser).toHaveBeenCalledWith(userId, { token })
    })

    it("should update user", () => {
        const userId = extendedReq.user.id;
        const updateUserObj = UpdateUserDtoMockFactory();
        expect(usersService.updateUser(userId, updateUserObj)).toBeDefined();
        expect(mockUsersRepository.updateUser).toHaveBeenCalledWith(userId, updateUserObj);
    })

    it("should verify user", async () => {
        const { verifyToken, id: userId } = extendedReq.user;

        expect(await usersService.verifyUser(verifyToken)).toBeDefined();
        expect(mockUsersRepository.findByField).toHaveBeenCalledWith({ verifyToken });
        expect(mockUsersRepository.updateUser).toHaveBeenCalledWith(userId, {
            verifyToken: null,
            verified: true,
        })
    })
})