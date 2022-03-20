import { AbstractEntity } from 'types/AbstractEntity';
import { CategoryId } from 'types/Category';
import Comment, { CommentId } from 'types/Comment';
import User, { UserId } from 'types/User';

export type TopicId = string;

class Topic extends AbstractEntity {
  constructor(s?: any) {
    super(s);

    this.name = s?.name || '';
    this.description = s?.description;
    this.id = s?.id || 0;
    this.categoryId = s?.categoryId;
    this.userId = s?.userId;
    this.user = s?.user ? new User(s.user) : undefined;
    this.lastComment = s?.lastComment ? new Comment(s.lastComment) : null;
    this.lastCommentId = s?.lastCommentId;
    this.numComments = s?.numComments;
    this.tag = s?.tag;
  }

  public id: TopicId;

  public name: string;

  public description: string;

  public categoryId: CategoryId;

  public userId: UserId;

  public user: User;

  public lastCommentId: CommentId;

  public lastComment: Comment;

  public numComments: number;

  public tag: string;
}

export default Topic;
