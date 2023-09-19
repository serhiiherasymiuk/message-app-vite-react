import { useState, useEffect } from "react";
import http_common from "../../../http_common.ts";
import { IMessage } from "../../../entities/Message.ts";
import Message from "../../../common/MessageGroup.tsx";

const MessageList = () => {
  const [loadedMessages, setLoadedMessages] = useState<IMessage[]>([]);
  const [expandedMessages, setExpandedMessages] = useState<number[]>([]);

  useEffect(() => {
    http_common.get("api/message/getHead").then((resp) => {
      setLoadedMessages(resp.data.data);
    });
  });

  const toggleSubMessages = (id: number) => {
    if (expandedMessages.includes(id)) {
      setExpandedMessages((prevState) =>
        prevState.filter((message) => message !== id),
      );
      setLoadedMessages((prevMessages) =>
        prevMessages.filter((message) => message.parent_id !== id),
      );
    } else {
      http_common.get(`api/message/getByParent/${id}`).then((resp) => {
        setLoadedMessages((prevMessages) => [...prevMessages, ...resp.data]);
      });
      setExpandedMessages((prevState) => [...prevState, id]);
    }
  };

  const renderMessages = (parentId: number | null) => (
    <ul className={parentId === null ? "" : " mt-5 border-l-4 pl-10"}>
      {loadedMessages
        .filter((message) => message.parent_id === parentId)
        .map((message) => (
          <Message
            key={message.id}
            message={message}
            expandedMessages={expandedMessages}
            getSubMessages={toggleSubMessages}
            renderMessages={renderMessages}
          />
        ))}
    </ul>
  );

  return (
    <section className="bg-white dark:bg-gray-900 py-8 lg:py-16 antialiased">
      {renderMessages(null)}
    </section>
  );
};

export default MessageList;
