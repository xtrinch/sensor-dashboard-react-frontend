import { IsString, MinLength } from "class-validator";
import { AbstractEntity } from "types/AbstractEntity";

export type CategoryId = number;

class Category extends AbstractEntity {
  constructor(s?: any) {
    super(s);

    this.name = s?.name || "";
  }

  public id: CategoryId;

  @IsString()
  @MinLength(2)
  public name: string;
}

export default Category;
