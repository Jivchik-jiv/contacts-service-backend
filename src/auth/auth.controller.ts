import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { Public } from '../decorators/public.decorator';
import { ExtendedRequest } from '../common/extended-requset.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('signout')
  async signOut(@Request() req: ExtendedRequest) {
    return this.authService.signOut(req.user.id);
  }
}
