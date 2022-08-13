import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return await this.repository
      .createQueryBuilder()
      .where(`title ILIKE '%${param}%'`)
      .getMany();
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return await this.repository
      .query("SELECT COUNT(*) FROM games");
  }

  async findUsersByGameId(id: string): Promise<User[]> {   
    return await this.repository.manager
      .createQueryBuilder(User, 'users')
      .innerJoinAndSelect("users_games_games", "games", "games.usersId = users.id")
      .where("games.gamesId = :id", {id})  
      .getMany();
  }
}
