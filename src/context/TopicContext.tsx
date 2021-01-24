import { CategoryContext } from "context/CategoryContext";
import { addToast } from "context/ToastContext";
import React, { createContext, useContext, useEffect, useState } from "react";
import TopicService from "services/TopicService";
import Category from "types/Category";
import { Toast } from "types/Toast";
import Topic, { TopicId } from "types/Topic";

const TopicContext = createContext<{
  state?: {
    topicsLoaded: boolean;
    topics: Topic[];
  };
  updateTopic?: (id: TopicId, topic: Topic) => Promise<Topic>;
  addTopic?: (topic: Topic) => Promise<Topic>;
  deleteTopic?: (id: TopicId) => Promise<boolean>;
  reload?: () => Promise<void>;
}>({});

function TopicContextProvider(props: { category: Category; children: any }) {
  const { category } = props;
  let { reload: reloadCategories } = useContext(CategoryContext);

  let [state, setState] = useState({
    topics: [],
    topicsLoaded: false,
  });

  const reload = async () => {
    const resp = await TopicService.listTopics({ categoryId: category.id });
    const topicData = resp.items;

    setState({ ...state, topics: topicData, topicsLoaded: true });
  };

  const updateTopic = async (
    id: TopicId,
    topic: Partial<Topic>
  ): Promise<Topic> => {
    const s = await TopicService.updateTopic(id, topic);

    const topics = state.topics;
    const topicIndex = topics.findIndex((s) => s.id === id);
    topics[topicIndex] = s;
    setState({ ...state, topics: [...topics] });

    addToast(
      new Toast({
        message: "Successfully updated the topic",
        type: "success",
      })
    );

    return s;
  };

  const deleteTopic = async (id: TopicId): Promise<boolean> => {
    await TopicService.deleteTopic(id);

    const idx = state.topics.findIndex((s) => s.id === id);
    state.topics.splice(idx, 1);
    setState({ ...state });

    addToast(
      new Toast({
        message: "Successfully deleted the topic",
        type: "success",
      })
    );

    return true;
  };

  const addTopic = async (topic: Partial<Topic>): Promise<Topic> => {
    const s = await TopicService.addTopic(topic);
    setState({ ...state, topics: [...state.topics, s] });

    addToast(
      new Toast({ message: "Successfully added a topic", type: "success" })
    );

    reloadCategories();

    return s;
  };

  useEffect(() => {
    if (!state.topicsLoaded) {
      reload();
    }
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <TopicContext.Provider
      value={{ state, updateTopic, deleteTopic, addTopic, reload }}
    >
      {props.children}
    </TopicContext.Provider>
  );
}

export { TopicContext, TopicContextProvider };
