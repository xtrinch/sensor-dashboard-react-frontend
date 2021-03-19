import { AbstractEntity } from "types/AbstractEntity";
import { CategoryId } from "types/Category";
import { TopicId } from "types/Topic";
import User, { UserId } from "types/User";

export type CommentId = number;

class Comment extends AbstractEntity {
  constructor(s?: any) {
    super(s);

    this.name = s?.name || "";
    this.description = s?.description;
    this.id = s?.id || 0;
    this.categoryId = s?.categoryId;
    this.userId = s?.userId;
    this.user = s?.user ? new User(s.user) : undefined;
    this.topicId = s?.topicId;
  }

  public id: CommentId;

  public name: string;

  public description: string;

  public categoryId: CategoryId;

  public topicId: TopicId;

  public userId: UserId;

  public user: User;
}

export default Comment;
