import Comment, { CommentId } from "types/Comment";
import { TopicId } from "types/Topic";
import { getHeaders, getUrl, processResponse } from "utils/http";

export default class CommentService {
  public static listComments = async (where: {
    categoryId: CommentId;
    topicId: TopicId;
    page: number;
    limit: number;
  }) => {
    const url = getUrl("/comments", where);

    const resp = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: getHeaders({ contentType: "application/json" }),
    });

    const result = await processResponse(resp);
    const comments: Comment[] = [];
    for (const item of result.items) {
      comments.push(new Comment(item));
    }

    return {
      meta: result.meta,
      items: comments,
    };
  };

  public static getComment = async (id: CommentId): Promise<Comment> => {
    const url = getUrl(`/comments/${id}`);

    const resp = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: getHeaders({ contentType: "application/json" }),
    });

    const result = await processResponse(resp);
    const s = new Comment(result);
    return s;
  };

  public static addComment = async (
    comment: Partial<Comment>
  ): Promise<Comment> => {
    const url = getUrl("/comments");

    const resp = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: getHeaders({ contentType: "application/json" }),
      body: JSON.stringify(comment),
    });

    const result = await processResponse(resp);
    const s = new Comment(result);
    return s;
  };

  public static updateComment = async (
    id: CommentId,
    comment: Partial<Comment>
  ): Promise<Comment> => {
    const url = getUrl(`/comments/${id}`);

    const resp = await fetch(url, {
      method: "PUT",
      credentials: "include",
      headers: getHeaders({ contentType: "application/json" }),
      body: JSON.stringify(comment),
    });

    const result = await processResponse(resp);
    const s = new Comment(result);
    return s;
  };

  public static deleteComment = async (
    id: CommentId
  ): Promise<{ success: string }> => {
    const url = getUrl(`/comments/${id}`);

    const resp = await fetch(url, {
      method: "DELETE",
      credentials: "include",
      headers: getHeaders({ contentType: "application/json" }),
    });

    const result = await processResponse(resp);
    return result;
  };
}
