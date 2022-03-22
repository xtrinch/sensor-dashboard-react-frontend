import { CategoryContext } from 'context/CategoryContext';
import { TopicContext } from 'context/TopicContext';
import React, { createContext, useContext, useEffect, useState } from 'react';
import CommentService from 'services/CommentService';
import { CategoryId } from 'types/Category';
import Comment, { CommentId } from 'types/Comment';
import { Toast } from 'types/Toast';
import { TopicId } from 'types/Topic';
import { ToastContext } from './ToastContext';

const CommentContext = createContext<{
  state?: {
    commentsLoaded: boolean;
    comments: Comment[];
    page: number;
    totalPages: number;
  };
  updateComment?: (id: CommentId, comment: Comment) => Promise<Comment>;
  addComment?: (comment: Comment) => Promise<Comment>;
  deleteComment?: (id: CommentId) => Promise<boolean>;
  listComments?: (page: number) => Promise<void>;
}>({});

function CommentContextProvider(props: {
  categoryId: CategoryId;
  topicId: TopicId;
  children: any;
}) {
  const toastStore = useContext(ToastContext);

  const { categoryId, topicId } = props;
  const { reload: reloadCategories } = useContext(CategoryContext);
  const { reload: reloadTopics } = useContext(TopicContext);

  const [state, setState] = useState({
    comments: [],
    commentsLoaded: false,
    page: 1,
    totalPages: 0,
    limit: 10,
  });

  const reload = async () => {
    listComments(1);
  };

  const listComments = async (page: number) => {
    const resp = await CommentService.listComments({
      categoryId,
      topicId,
      page,
      limit: state.limit,
    });
    const commentData = resp.items;

    setState({
      ...state,
      comments: commentData,
      commentsLoaded: true,
      page: resp.meta.currentPage,
      totalPages: resp.meta.totalPages,
    });
  };

  const updateComment = async (id: CommentId, comment: Partial<Comment>): Promise<Comment> => {
    const s = await CommentService.updateComment(id, comment);

    const { comments } = state;
    const commentIndex = comments.findIndex((s) => s.id === id);
    comments[commentIndex] = s;
    setState({ ...state, comments: [...comments] });

    toastStore.addToast(
      new Toast({
        message: 'Successfully updated the comment',
        type: 'success',
      }),
    );

    return s;
  };

  const deleteComment = async (id: CommentId): Promise<boolean> => {
    await CommentService.deleteComment(id);

    const idx = state.comments.findIndex((s) => s.id === id);
    state.comments.splice(idx, 1);
    setState({ ...state });

    toastStore.addToast(
      new Toast({
        message: 'Successfully deleted the comment',
        type: 'success',
      }),
    );

    return true;
  };

  const addComment = async (comment: Partial<Comment>): Promise<Comment> => {
    const s = await CommentService.addComment(comment);
    await listComments(state.totalPages || 1);

    toastStore.addToast(new Toast({ message: 'Successfully added a comment', type: 'success' }));

    reloadCategories();
    reloadTopics();

    return s;
  };

  useEffect(() => {
    if (!state.commentsLoaded) {
      reload();
    }
  }, [state]);

  return (
    <CommentContext.Provider
      value={{
        state,
        updateComment,
        deleteComment,
        addComment,
        listComments,
      }}
    >
      {props.children}
    </CommentContext.Provider>
  );
}

export { CommentContext, CommentContextProvider };
