import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PostsModule } from './posts/posts.module';
import { AsyncContextModule } from 'src/async-context/async-context.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AsyncContextInterceptor } from 'src/common/interceptor/async-context.interceptor';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      context: ({ req, res }) => ({ req, res }),
      // cors: {
      //   origin: process.env.FRONT_END_URL,
      //   credentials: true,
      // },
    }),
    AuthModule,
    PrismaModule,
    PostsModule,
    AsyncContextModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AsyncContextInterceptor,
    },
  ],
})
export class AppModule {}
