import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from 'src/@generated/prisma-nestjs-graphql/user/user.model';
import { UserWhereUniqueInput } from 'src/@generated/prisma-nestjs-graphql/user/user-where-unique.input';
import { UserCreateInput } from 'src/@generated/prisma-nestjs-graphql/user/user-create.input';
import { Auth } from 'src/common/decorator/auth.decorator';
import { Role } from 'src/@generated/prisma-nestjs-graphql/prisma/role.enum';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: UserCreateInput) {
    return this.usersService.create(createUserInput);
  }

  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Auth(Role.ADMIN)
  @Query(() => User, { name: 'user' })
  findOne(@Args('where') where: UserWhereUniqueInput) {
    return this.usersService.findOne(where);
  }

  // @Mutation(() => User)
  // updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
  //   return this.usersService.update(updateUserInput.id, updateUserInput);
  // }

  @Mutation(() => User)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.remove(id);
  }
}
