import { IsString, MinLength, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @MinLength(2)
  @MaxLength(25)
  @IsString()
  readonly name: string;
}
