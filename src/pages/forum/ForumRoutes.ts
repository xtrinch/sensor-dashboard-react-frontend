import { CategoryId } from "types/Category";
import { TopicId } from "types/Topic";

export const ForumRoutes = {
  FORUM: "/forum",
  ADD_CATEGORY: "/forum/add-category",
  TOPIC_LIST: "/forum/category/:id",
  TOPIC: "/forum/category/:id/topic/:topicId",
  ADD_TOPIC: "/forum/category/:id/add-topic",
};

export const getTopicListRoute = (id: TopicId) => `/forum/category/${id}`;
export const getTopicRoute = (categoryId: CategoryId, id: TopicId) =>
  `/forum/category/${categoryId}/topic/${id}`;
export const getAddTopicRoute = (id: TopicId) =>
  `/forum/category/${id}/add-topic`;
