import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserCreateInput } from 'src/@generated/prisma-nestjs-graphql/user/user-create.input';
import { UserWhereInput } from 'src/@generated/prisma-nestjs-graphql/user/user-where.input';
import { UserWhereUniqueInput } from 'src/@generated/prisma-nestjs-graphql/user/user-where-unique.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/@generated/prisma-nestjs-graphql/user/user.model';
import { UserUpdateInput } from 'src/@generated/prisma-nestjs-graphql/user/user-update.input';
import { UpdateUserInput } from 'src/users/dtos/update-user.input';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserInput: UserCreateInput) {
    return await this.prisma.$transaction(async (prisma) => {
      const existUser = await prisma.user.findUnique({
        where: {
          email: createUserInput.email,
        },
        select: {
          id: true,
        },
      });

      if (existUser) {
        throw new HttpException(
          '이미 존재하는 아이디입니다.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const { password } = createUserInput;
      const hash = await this.hashingPassword(password);
      createUserInput.password = hash;

      const result = await prisma.user.create({
        data: createUserInput,
      });

      return result;
    });
  }

  private async hashingPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(where: UserWhereUniqueInput) {
    return this.prisma.user.findUnique({
      where,
    });
  }

  async update(id: number, userUpdateInput: UpdateUserInput) {
    return await this.prisma.user.update({
      where: {
        id,
      },
      data: userUpdateInput,
    });
  }

  // update(id: number, updateUserInput: UpdateUserInput) {
  //   return `This action updates a #${id} user`;
  // }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
