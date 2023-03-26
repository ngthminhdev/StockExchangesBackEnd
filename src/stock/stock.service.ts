import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { MarketBreadthResponse } from "./responses/MarketBreadth.response";
import { CatchException } from "../exceptions/common.exception";
import { Cache } from "cache-manager";

@Injectable()
export class StockService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly redis: Cache,
    @InjectDataSource() private readonly db: DataSource
  ) {
  }

  // Độ rộng ngành
  async getMarketBreadth() {
    try {
      return new MarketBreadthResponse().mapToList(await this.db.query(`
        SELECT * FROM market_breadth
        ORDER BY time ASC
      `));
    } catch (e) {
      throw new CatchException(e);
    }
  }
}
