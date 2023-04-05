import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { BaseModel } from "../../models/base.entity";
import { CompanyEntity } from "./company.entity";

@Entity({ name: 'stock' })
export class StockEntity extends BaseModel {
  @PrimaryColumn({
    type: "text",
    unique: true
  })
  symbol: string;

  @OneToOne<CompanyEntity>(() => CompanyEntity, company => company.company_id)
  @JoinColumn()
  company: CompanyEntity;

  @Column({
    type: "text",
    default: ""
  })
  exchange: string;

  @Column({
    type: "text",
    default: ""
  })
  main_industry: string;

  @Column({
    type: "text",
    default: ""
  })
  sub_industry1: string;

  @Column({
    type: "text",
    default: ""
  })
  sub_industry2: string;

  @Column({
    type: "text",
    default: ""
  })
  sub_industry3: string;
}