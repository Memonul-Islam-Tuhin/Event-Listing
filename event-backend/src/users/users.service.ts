import { Injectable } from '@nestjs/common';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

@Injectable()
export class UsersService {
  private file = join(process.cwd(), 'users.json');
  private users: User[] = existsSync(this.file)
    ? JSON.parse(readFileSync(this.file, 'utf-8'))
    : [];

  private save() {
    writeFileSync(this.file, JSON.stringify(this.users, null, 2));
  }

  findByEmail(email: string) {
    return this.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );
  }

  findById(id: number) {
    return this.users.find((u) => u.id === id);
  }

  create(name: string, email: string, password: string) {
    const user: User = {
      id: this.users.length ? this.users[this.users.length - 1].id + 1 : 1,
      name,
      email: email.toLowerCase(),
      password,
      createdAt: new Date().toISOString(),
    };
    this.users.push(user);
    this.save();
    return user;
  }
}
