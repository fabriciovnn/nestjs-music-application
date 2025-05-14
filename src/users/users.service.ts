import { Injectable } from '@nestjs/common';

import { CreateUserDto } from './dtos/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { UsersRepository } from './users.repository';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  async create(data: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.usersRepository.create({ ...data, password: hashedPassword });
  }

  async findAll() {
    return this.usersRepository.findAll();
  }

  async findOne(id: number) {
    return this.usersRepository.findOne(id);
  }

  async update(id: number, data: UpdateUserDto) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    return this.usersRepository.update(id, data);
  }

  async remove(id: number) {
    return this.usersRepository.remove(id);
  }
}
