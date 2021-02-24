import { GameDto } from '../dto/game.dto.interface';
import { GameService } from '../service/game.service';
import { Controller, Delete, Get, Post, Put, Param, Body } from '@nestjs/common';
import Endpoints from '../../constants/constants';
import { PublisherDto } from '../../publisher/dto/publisher.dto.interface';
import { ApiParam } from '@nestjs/swagger';

@Controller(Endpoints.v1.game)
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get()
  async getGames(): Promise<GameDto[]> {
    return this.gameService.getGames();
  }

  @Get(':param')
  @ApiParam({ name: 'param', required: true, description: 'game name or game id' })
  async getGamebyName(@Param('param') param: string): Promise<PublisherDto> {
    return await this.gameService.getGetGameOrPublisher(param);
  }

  @Post()
  async createGame(@Body() gameDto: GameDto): Promise<GameDto> {
    return await this.gameService.saveGame(gameDto);
  }

  @Put()
  async updateGame(@Body() gameDto: GameDto): Promise<GameDto> {
    return this.gameService.updateGame(gameDto);
  }

  @Delete(':id')
  async deleteGame(@Param('id') id: string): Promise<any> {
    return this.gameService.deleteGame(id);
  }
}
