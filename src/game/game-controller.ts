import { GameDto } from './game-dto';
import { Controller, Post, Body, Get, Put, Delete, Param } from '@nestjs/common';
import { GameCreateService } from './game-create.service';
import { GameService } from './game-service';
import { GameUpdateService } from './game-update.service';
import { GameDeleteService } from './game-delete.service';
import { PublisherDto } from 'src/publisher/pubilsher-dto';
import { GameGetGameOrPublisherService } from './game-get-game-or-publisher.service';
import { ApiParam } from '@nestjs/swagger';

@Controller('v1/game')
export class GameController {
  constructor(
    private readonly gameCreateService: GameCreateService,
    private readonly gameService: GameService,
    private readonly gameUpdate: GameUpdateService,
    private readonly gameDelete: GameDeleteService,
    private readonly gameGetGameOrPublisher: GameGetGameOrPublisherService,
  ) {}

  @Post()
  async createGame(@Body() gameDto: GameDto): Promise<GameDto> {
    return await this.gameCreateService.createGame(gameDto);
  }

  @Get()
  async getGames(): Promise<GameDto[]> {
    return this.gameService.getDocuments();
  }

  @Get(':param')
  @ApiParam({ name: 'param', required: true, description: 'game name or game id' })
  async getGamebyName(@Param('param') param: string): Promise<PublisherDto> {
    return await this.gameGetGameOrPublisher.getGetGameOrPublisher(param);
  }

  @Put()
  async updateGame(@Body() gameDto: GameDto): Promise<GameDto> {
    return this.gameUpdate.updateGame(gameDto);
  }

  @Delete(':id')
  async deleteGame(@Param('id') id: string): Promise<any> {
    return this.gameDelete.deleteGame(id);
  }
}
