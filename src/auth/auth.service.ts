import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<any> {
    const { password, email } = signInDto;

    const user = await this.usersService.findByEmail(email);
    const passValid = await user?.validatePassword(password);

    if (!user || !passValid) {
      throw new UnauthorizedException();
    }

    const payload = { id: user.id, name: user.name, email: user.email };
    const token = await this.jwtService.signAsync(payload);

    await this.usersService.updateToken(user.id, token);
    return { token, user: payload };
  }

  async signOut(id: string) {
    await this.usersService.updateToken(id, null);
    return true;
  }
}
