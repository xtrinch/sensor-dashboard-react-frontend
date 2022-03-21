import { parseISO } from 'date-fns';
import { AbstractEntity } from 'types/AbstractEntity';
import { CategoryId } from 'types/Category';
import { TopicId } from 'types/Topic';
import User, { UserId } from 'types/User';

export type CommentId = string;

class Comment implements AbstractEntity {
  constructor(s?: any) {
    this.name = s?.name || '';
    this.description = s?.description;
    this.id = s?.id || 0;
    this.categoryId = s?.categoryId;
    this.userId = s?.userId;
    this.user = s?.user ? new User(s.user) : undefined;
    this.topicId = s?.topicId;
    this.createdAt = s?.createdAt ? parseISO(s.createdAt) : new Date();
    this.updatedAt = s?.updatedAt ? parseISO(s.updatedAt) : null;
  }

  public createdAt: Date;

  public updatedAt: Date;

  public id: CommentId;

  public name: string;

  public description: string;

  public categoryId: CategoryId;

  public topicId: TopicId;

  public userId: UserId;

  public user: User;
}

export default Comment;
