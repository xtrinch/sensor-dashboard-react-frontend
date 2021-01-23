import { RawDraftContentState } from "draft-js";
import { AbstractEntity } from "types/AbstractEntity";
import { CategoryId } from "types/Category";
import User, { UserId } from "types/User";

export type TopicId = number;

class Topic extends AbstractEntity {
  constructor(s?: any) {
    super(s);

    this.name = s?.name || "";
    this.description = s?.description;
    this.id = s?.id || 0;
    this.categoryId = s?.categoryId;
    this.userId = s?.userId;
    this.user = s?.user ? new User(s.user) : undefined;
  }

  public id: TopicId;

  public name: string;

  public description: RawDraftContentState;

  public categoryId: CategoryId;

  public userId: UserId;

  public user: User;
}

export default Topic;
