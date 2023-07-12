import { IsString, MinLength, MaxLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @MinLength(8)
  @MaxLength(15)
  readonly newPassword: string;

  @IsString()
  @MinLength(8)
  @MaxLength(15)
  readonly oldPassword: string;
}
