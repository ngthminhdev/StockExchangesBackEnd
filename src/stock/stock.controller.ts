import { Controller, Get, HttpStatus, Res } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { StockService } from "./stock.service";
import { MarketBreadthSwagger } from "./responses/MarketBreadth.response";
import { BaseResponse } from "../utils/utils.response";

@Controller('stock')
@ApiTags('Stock - Api')
export class StockController {
  constructor(private readonly stockService: StockService) {}
  @Get('do-rong-thi-truong')
  @ApiOperation({ summary: 'Độ rộng thị trường' })
  @ApiOkResponse({ type: MarketBreadthSwagger })
  async getMarketBreadth(@Res() res: Response) {
    const data = await this.stockService.getMarketBreadth();
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }
}
