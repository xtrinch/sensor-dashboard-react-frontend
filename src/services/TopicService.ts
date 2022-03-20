import Topic, { TopicId } from 'types/Topic';
import { getHeaders, getUrl, processResponse } from 'utils/http';

export default class TopicService {
  public static listTopics = async (where: { categoryId: TopicId }) => {
    const url = getUrl('/topics', where);

    const resp = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: getHeaders({ contentType: 'application/json' }),
    });

    const result = await processResponse(resp);
    const topics: Topic[] = [];
    for (const item of result.items) {
      topics.push(new Topic(item));
    }

    return {
      meta: result.meta,
      items: topics,
    };
  };

  public static getTopic = async (id: TopicId): Promise<Topic> => {
    const url = getUrl(`/topics/${id}`);

    const resp = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: getHeaders({ contentType: 'application/json' }),
    });

    const result = await processResponse(resp);
    const s = new Topic(result);
    return s;
  };

  public static getTopicByTag = async (tag: string): Promise<Topic> => {
    const url = getUrl(`/topics/tag/${tag}`);

    const resp = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: getHeaders({ contentType: 'application/json' }),
    });

    const result = await processResponse(resp);
    const s = new Topic(result);
    return s;
  };

  public static addTopic = async (topic: Partial<Topic>): Promise<Topic> => {
    const url = getUrl('/topics');

    const resp = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: getHeaders({ contentType: 'application/json' }),
      body: JSON.stringify(topic),
    });

    const result = await processResponse(resp);
    const s = new Topic(result);
    return s;
  };

  public static updateTopic = async (id: TopicId, topic: Partial<Topic>): Promise<Topic> => {
    const url = getUrl(`/topics/${id}`);

    const resp = await fetch(url, {
      method: 'PUT',
      credentials: 'include',
      headers: getHeaders({ contentType: 'application/json' }),
      body: JSON.stringify(topic),
    });

    const result = await processResponse(resp);
    const s = new Topic(result);
    return s;
  };

  public static deleteTopic = async (id: TopicId): Promise<{ success: string }> => {
    const url = getUrl(`/topics/${id}`);

    const resp = await fetch(url, {
      method: 'DELETE',
      credentials: 'include',
      headers: getHeaders({ contentType: 'application/json' }),
    });

    const result = await processResponse(resp);
    return result;
  };
}
