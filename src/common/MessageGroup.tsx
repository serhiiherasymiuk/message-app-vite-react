import { APP_ENV } from "../env";
import { IMessage } from "../entities/Message.ts";
import ModalReply from "./ModalReply.tsx";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import { IAuthUser } from "../entities/Auth.ts";

interface MessageGroupProps {
  message: IMessage;
  expandedMessages: number[];
  getSubMessages: (messageId: number) => void;
  renderMessages: (messageId: number) => React.ReactNode;
  onReplyMessage: () => void;
}

const Message: React.FC<MessageGroupProps> = ({
  message,
  expandedMessages,
  getSubMessages,
  renderMessages,
  onReplyMessage,
}) => {
  const { isAuth } = useSelector((store: any) => store.auth as IAuthUser);

  const formatDate = (dateString: string): string => {
    const parsedDate = new Date(dateString);

    const dateFormatOptions: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };

    return new Intl.DateTimeFormat("en-US", dateFormatOptions).format(
      parsedDate,
    );
  };

  return (
    <article
      key={message.id}
      className="p-6 text-base bg-white rounded-lg dark:bg-gray-900"
    >
      <footer className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
            <img
              className="mr-2 w-12 h-12 rounded-full"
              src={`${APP_ENV.BASE_URL}/storage/uploads/${message.user.image}`}
              alt="Michael Gough"
            />
            {message.user.name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <time dateTime="2022-02-08" title="February 8th, 2022">
              <time
                dateTime={message.created_at}
                title={formatDate(message.created_at)}
              >
                {formatDate(message.created_at)}
              </time>
            </time>
          </p>
        </div>
      </footer>
      <div className="text-gray-500 dark:text-gray-400">
        {parse(message.text)}
      </div>

      {message.image && (
        <div className="flex items-center mt-4 space-x-4">
          <img
            className="mb-1"
            src={`${APP_ENV.BASE_URL}/storage/uploads/300_${message.image}`}
          />
        </div>
      )}
      <div className="flex items-center mt-4 space-x-4">
        {isAuth && (
          <ModalReply
            parent_id={message.id}
            label={"Reply"}
            onAddMessage={onReplyMessage}
          ></ModalReply>
        )}
        <button
          type="button"
          className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium"
          onClick={() => getSubMessages(message.id)}
        >
          Show answers
        </button>
      </div>
      {expandedMessages.includes(message.id) && renderMessages(message.id)}
    </article>
  );
};

export default Message;
