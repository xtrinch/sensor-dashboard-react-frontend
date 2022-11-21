import { CategoryId } from 'types/Category';
import { TopicId } from 'types/Topic';

export const ForumRoutes = {
  FORUM: '/forum',
  ADD_CATEGORY: '/forum/add-category',
  EDIT_CATEGORY: '/forum/category/:id/edit',
  TOPIC_LIST: '/forum/category/:id',
  TOPIC: '/forum/category/:id/topic/:topicId',
  TOPIC_BY_TAG: '/forum/static/:tag',
  ADD_TOPIC: '/forum/category/:id/add-topic',
  EDIT_TOPIC: '/forum/category/:id/topic/:topicId/edit',
};

export const getTopicListRoute = (id: CategoryId) => `/forum/category/${id}`;
export const getTopicRoute = (categoryId: CategoryId, id: TopicId) =>
  `/forum/category/${categoryId}/topic/${id}`;
export const getTopicByTagRoute = (tag: string) => `/forum/static/${tag}`;
export const getAddTopicRoute = (id: TopicId) => `/forum/category/${id}/add-topic`;
export const getCategoryEditRoute = (id: CategoryId) => `/forum/category/${id}/edit`;
export const getTopicEditRoute = (categoryId: CategoryId, id: TopicId) =>
  `/forum/category/${categoryId}/topic/${id}/edit`;
