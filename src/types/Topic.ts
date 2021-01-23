import { RawDraftContentState } from "draft-js";
import { AbstractEntity } from "types/AbstractEntity";
import { CategoryId } from "types/Category";

export type TopicId = number;

class Topic extends AbstractEntity {
  constructor(s?: any) {
    super(s);

    this.name = s?.name || "";
    this.description = s?.description;
    this.id = s?.id || 0;
    this.categoryId = s?.categoryId;
  }

  public id: TopicId;

  public name: string;

  public description: RawDraftContentState;

  public categoryId: CategoryId;
}

export default Topic;
