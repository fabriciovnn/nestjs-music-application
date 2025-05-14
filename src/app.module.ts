import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PlaylistsModule } from './playlists/playlists.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, PlaylistsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
