import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { SignInDto } from './dto/signin.dto';
import { Public } from '../decorators/public.decorator';
import { ExtendedRequest } from '../common/extended-requset.interface';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService) { }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(@Body() signInDto: SignInDto) {
    try {
      const user = await this.usersService.findByEmail(signInDto.email);

      const payload = { id: user.id };


      const token = await this.jwtService.signAsync(payload);

      await this.usersService.updateToken(user.id, token);

      return { token, user: { name: user.name, email: user.email, id: user.id, avatar: user.avatar } };
    } catch (error) {
      return error;
    }

  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('signout')
  async signOut(@Request() req: ExtendedRequest) {
    await this.usersService.updateToken(req.user.id, null);
    return true;
  }
}
