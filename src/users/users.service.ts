import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserCreateInput } from 'src/@generated/prisma-nestjs-graphql/user/user-create.input';
import { PrismaService } from 'prisma/prisma.service';
import { UserWhereInput } from 'src/@generated/prisma-nestjs-graphql/user/user-where.input';
import { UserWhereUniqueInput } from 'src/@generated/prisma-nestjs-graphql/user/user-where-unique.input';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserInput: UserCreateInput) {
    const { password } = createUserInput;
    const { hash, salt } = await this.hashingPassword(password);
    createUserInput.password = hash;
    createUserInput.salt = salt;

    const result = await this.prisma.user.create({
      data: createUserInput,
    });

    return result;
  }

  private async hashingPassword(password: string) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);

    return { hash, salt };
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(where: UserWhereUniqueInput) {
    return this.prisma.user.findUnique({
      where,
    });
  }

  // update(id: number, updateUserInput: UpdateUserInput) {
  //   return `This action updates a #${id} user`;
  // }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
