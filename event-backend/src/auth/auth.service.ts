import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User, UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';

import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    if (this.users.findByEmail(dto.email)) {
      throw new ConflictException('Email already registered');
    }

    const hash = await bcrypt.hash(dto.password, 10);
    const user = this.users.create(dto.name, dto.email, hash);
    return this.buildResponse(user);
  }

  async login(dto: LoginDto) {
    const user = this.users.findByEmail(dto.email);
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.buildResponse(user);
  }

  private buildResponse(user: User) {
    const token = this.jwt.sign({
      sub: user.id,
      name: user.name,
      email: user.email,
    });
  }
}
