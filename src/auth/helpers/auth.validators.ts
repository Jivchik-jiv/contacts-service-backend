import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignInDto } from '../dto/signin.dto';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsCredentialsCorrectConstraint implements ValidatorConstraintInterface {
    constructor(private readonly usersService: UsersService) { }

    async validate(email: string, args: ValidationArguments) {

        const { password } = args.object as SignInDto;
        const user = await this.usersService.findByEmail(email);
        const passValid = await user?.validatePassword(password);

        if (!user || !passValid) {
            return false
        }


        return true;
    }
}


export function IsCredentialsCorrect(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsCredentialsCorrectConstraint,
        });
    };
}