import { AbstractEntity } from "types/AbstractEntity";

export type CategoryId = number;

class Category extends AbstractEntity {
  constructor(s?: any) {
    super(s);

    this.name = s?.name || "";
    this.description = s?.description || "";
    this.id = s?.id || 0;
    this.protected = s?.protected || false;
    this.numTopics = s?.numTopics || 0;
    this.numComments = s?.numComments || 0;
  }

  public id: CategoryId;

  public name: string;

  public description: string;

  public protected: boolean;

  public numTopics: number;

  public numComments: number;
}

export default Category;
