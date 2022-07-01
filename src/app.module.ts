import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { loggingMiddleware } from 'src/common/middleware/logging-prisma.middleware';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    // PrismaModule.forRoot({
    //   isGlobal: true,
    //   prismaServiceOptions: {
    //     // middlewares: [loggingMiddleware()],
    //     prismaOptions: {
    //       log: [
    //         { emit: 'stdout', level: 'query' },
    //         { emit: 'stdout', level: 'info' },
    //         { emit: 'stdout', level: 'warn' },
    //         { emit: 'stdout', level: 'error' },
    //       ],
    //     },
    //   },
    // }),
    // UsersModule,
    AuthModule,
    PrismaModule,
  ],
})
export class AppModule {}
