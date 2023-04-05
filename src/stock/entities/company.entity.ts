import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseModel } from "../../models/base.entity";
import { StockEntity } from "./stock.entity";

@Entity({ name: 'company' })
export class CompanyEntity extends BaseModel {
  @PrimaryGeneratedColumn('increment', {
    type: "int"
  })
  company_id: number;

  @OneToOne<StockEntity>(()=> StockEntity, stock => stock.symbol)
  @JoinColumn()
  stock: StockEntity;

  @Column({
    type: "text",
    default: ""
  })
  name: string;

  @Column({
    type: "text",
    default: ""
  })
  eng_name: string;

  @Column({
    type: "text",
    default: ""
  })
  exchange: string;

  @Column({
    type: "text",
    default: ""
  })
  tax: string;

  @Column({
    type: "text",
    default: ""
  })
  website: string;

  @Column({
    type: "text",
    default: ""
  })
  address: string;

  @Column({
    type: "text",
    default: ""
  })
  phone: string;

  @Column({
    type: "text",
    default: ""
  })
  email: string;

  @Column({
    type: "text",
    default: ""
  })
  founding_day: string;

  @Column({
    type: "text",
    default: ""
  })
  first_trading_day: string;

  @Column({
    type: "smallint",
    default: 0
  })
  type: number;
}