import { parseISO } from 'date-fns';
import { AbstractEntity } from 'types/AbstractEntity';
import Comment, { CommentId } from 'types/Comment';
import Topic, { TopicId } from 'types/Topic';

export type CategoryId = string;

class Category implements AbstractEntity {
  constructor(s?: any) {
    this.name = s?.name || '';
    this.description = s?.description || '';
    this.id = s?.id || 0;
    this.protected = s?.protected || false;
    this.numTopics = s?.numTopics || 0;
    this.numComments = s?.numComments || 0;
    this.lastComment = s?.lastComment ? new Comment(s.lastComment) : null;
    this.lastCommentId = s?.lastCommentId;
    this.lastTopic = s?.lastTopic ? new Topic(s.lastTopic) : null;
    this.lastTopicId = s?.lastTopicId;
    this.createdAt = s?.createdAt ? parseISO(s.createdAt) : new Date();
    this.updatedAt = s?.updatedAt ? parseISO(s.updatedAt) : null;
  }

  public createdAt: Date;

  public updatedAt: Date;

  public id: CategoryId;

  public name: string;

  public description: string;

  public protected: boolean;

  public numTopics: number;

  public numComments: number;

  public lastCommentId: CommentId;

  public lastComment: Comment;

  public lastTopicId: TopicId;

  public lastTopic: Topic;
}

export default Category;
