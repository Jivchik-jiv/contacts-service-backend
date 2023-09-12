import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsUserAlreadyExistConstraint implements ValidatorConstraintInterface {
    constructor(private readonly usersService: UsersService) { }

    async validate(email: string, args: ValidationArguments) {
        return this.usersService.findByEmail(email).then(user => {
            if (user) {
                return false;
            }
            return true;
        })
    }
}


export function IsUserAlreadyExist(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsUserAlreadyExistConstraint,
        });
    };
}