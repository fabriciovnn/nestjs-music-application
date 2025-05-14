import { Module } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { PlaylistsController } from './playlists.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PlaylistsRepository } from './playlists.repository';

@Module({
  providers: [PlaylistsService, PlaylistsRepository, PrismaService],
  exports: [PlaylistsService],
  controllers: [PlaylistsController],
})
export class PlaylistsModule {}
