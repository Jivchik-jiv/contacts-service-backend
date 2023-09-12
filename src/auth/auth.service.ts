import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async signIn(signInDto: SignInDto): Promise<any> {
    const { email } = signInDto;

    const user = await this.usersService.findByEmail(email);

    const payload = { id: user.id };
    const token = await this.jwtService.signAsync(payload);

    await this.usersService.updateToken(user.id, token);
    return { token, user: { name: user.name, email: user.email, id: user.id, avatar: user.avatar } };
  }

  async signOut(id: string) {
    await this.usersService.updateToken(id, null);
    return true;
  }
}
