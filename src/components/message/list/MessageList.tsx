import { useState, useEffect } from "react";
import http_common from "../../../http_common.ts";
import { IMessage } from "../../../entities/Message.ts";
import Message from "../../../common/MessageGroup.tsx";
import ModalReply from "../../../common/ModalReply.tsx";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { IAuthUser } from "../../../entities/Auth.ts";

const MessageList = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [expandedMessages, setExpandedMessages] = useState<number[]>([]);
  const { page } = useParams();
  const navigate = useNavigate();
  const [sortOption, setSortOption] = useState("user_name");
  const [sortOrder, setSortOrder] = useState("asc");
  const { isAuth } = useSelector((store: any) => store.auth as IAuthUser);
  const [isLoadingSubMessages, setIsLoadingSubMessages] = useState(false);

  const fetchMessages = () => {
    setMessages([]);
    setExpandedMessages([]);
    const queryParams = `page=${page}&sort_by=${sortOption}&sort_order=${sortOrder}`;
    http_common.get(`api/message/getHead?${queryParams}`).then((resp) => {
      setMessages(resp.data.data);
    });
  };

  useEffect(() => {
    fetchMessages();
  }, [page, sortOption, sortOrder]);

  const toggleSubMessages = async (id: number) => {
    if (expandedMessages.includes(id)) {
      setExpandedMessages((prevState) =>
        prevState.filter((item) => item !== id),
      );
    } else {
      if (isLoadingSubMessages) return;
      setIsLoadingSubMessages(true);
      try {
        const resp = await http_common.get(`api/message/getByParent/${id}`);
        const subMessages = resp.data;
        setMessages((prevMessages) => {
          const newMessages = prevMessages.filter(
            (message) =>
              !subMessages.some(
                (subMessage: IMessage) => subMessage.id === message.id,
              ),
          );
          return [...newMessages, ...subMessages];
        });
        setExpandedMessages((prevState) => [...prevState, id]);
      } catch (error) {
        console.error("Error fetching submessages:", error);
      } finally {
        setIsLoadingSubMessages(false);
      }
    }
  };

  const handleNextPage = () => {
    if (page) {
      const nextPage = parseInt(page) + 1;
      http_common.get(`api/message/getHead?page=${nextPage}`).then((resp) => {
        const nextPageMessages = resp.data.data;
        if (nextPageMessages.length > 0) {
          navigate(`/messages/page/${nextPage}`);
        } else {
          console.log("No messages on the next page.");
        }
      });
    }
  };

  const handlePrevPage = () => {
    if (page && parseInt(page) > 1) {
      const prevPage = parseInt(page) - 1;
      navigate(`/messages/page/${prevPage}`);
    }
  };

  const handleSortOptionChange = (option: string) => {
    setSortOption(option);
  };

  const handleSortOrderChange = (order: string) => {
    setSortOrder(order);
  };

  const renderMessages = (parentId: number | null) => {
    return (
      <ul className={parentId === null ? "" : "border-l-4 mt-5"}>
        {messages
          .filter((message) => message.parent_id === parentId)
          .map((message) => (
            <Message
              key={message.id}
              message={message}
              expandedMessages={expandedMessages}
              getSubMessages={toggleSubMessages}
              renderMessages={renderMessages}
              onReplyMessage={fetchMessages}
            />
          ))}
      </ul>
    );
  };

  return (
    <section className="bg-white dark:bg-gray-900 py-8 lg:py-16 antialiased">
      <button
        id="dropdownDefaultButton"
        data-dropdown-toggle="dropdown"
        className="mb-10 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
      >
        Filter by
        <svg
          className="w-2.5 h-2.5 ml-2.5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>
      <div
        id="dropdown"
        className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
      >
        <ul
          className="py-2 text-sm text-gray-700 dark:text-gray-200"
          aria-labelledby="dropdownDefaultButton"
        >
          <li>
            <a
              href="#"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={() => handleSortOptionChange("user_name")}
            >
              Username
            </a>
          </li>
          <li>
            <a
              href="#"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={() => handleSortOptionChange("user_email")}
            >
              User email
            </a>
          </li>
          <li>
            <a
              href="#"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={() => handleSortOptionChange("date")}
            >
              Date
            </a>
          </li>
          <li>
            <a
              href="#"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={() => handleSortOrderChange("asc")}
            >
              Ascending
            </a>
          </li>
          <li>
            <a
              href="#"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={() => handleSortOrderChange("desc")}
            >
              Descending
            </a>
          </li>
        </ul>
      </div>

      {isAuth && (
        <ModalReply
          parent_id={null}
          label={"Write a message"}
          onAddMessage={fetchMessages}
        ></ModalReply>
      )}

      {renderMessages(null)}

      <div className="flex justify-center mt-5">
        <button
          onClick={handlePrevPage}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-l"
        >
          Previous Page
        </button>
        <button
          onClick={handleNextPage}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r"
        >
          Next Page
        </button>
      </div>
    </section>
  );
};

export default MessageList;
