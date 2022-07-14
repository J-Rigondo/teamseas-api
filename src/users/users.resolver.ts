import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { Auth } from 'src/common/decorator/auth.decorator';
import { User } from 'src/@generated/prisma-nestjs-graphql/user/user.model';
import { UserCreateInput } from 'src/@generated/prisma-nestjs-graphql/user/user-create.input';
import { UserWhereUniqueInput } from 'src/@generated/prisma-nestjs-graphql/user/user-where-unique.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserUncheckedUpdateInput } from 'src/@generated/prisma-nestjs-graphql/user/user-unchecked-update.input';
import { UpdateUserInput } from 'src/users/dtos/update-user.input';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly prismaService: PrismaService,
  ) {}

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: UserCreateInput) {
    return this.usersService.create(createUserInput);
  }

  @Query(() => [User], { name: 'users', description: '전체 유저 리스트' })
  findAll() {
    return this.usersService.findAll();
  }

  //@Auth(Role.ADMIN)
  @Query(() => User, { name: 'user' })
  findOne(@Args('where') where: UserWhereUniqueInput) {
    return this.usersService.findOne(where);
  }

  @ResolveField('posts')
  async posts(@Parent() user: User) {
    return this.prismaService.user
      .findUnique({ where: { id: user.id } })
      .posts();
  }

  @ResolveField('_count')
  async _count(@Parent() user: User) {
    const result = await this.prismaService.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        _count: {
          select: { posts: true, donations: true },
        },
      },
    });

    return result._count;
  }

  @Mutation(() => User)
  updateUser(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ) {
    return this.usersService.update(id, updateUserInput);
  }

  @Mutation(() => User)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.remove(id);
  }
}
