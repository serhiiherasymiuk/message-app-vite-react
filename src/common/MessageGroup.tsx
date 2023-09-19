import { APP_ENV } from "../env";
import { IMessage } from "../entities/Message.ts";

interface MessageGroupProps {
  message: IMessage;
  expandedMessages: number[];
  getSubMessages: (messageId: number) => void;
  renderMessages: (messageId: number) => React.ReactNode;
}

const Message: React.FC<MessageGroupProps> = ({
  message,
  expandedMessages,
  getSubMessages,
  renderMessages,
}) => {
  return (
    <div key={message.id} className="flex flex-col mt-5">
      <div className="flex">
        <img
          className="mr-2 w-16 h-16 rounded-full"
          src={`${APP_ENV.BASE_URL}/storage/uploads/${message.user.image}`}
        />
        <p className="flex">{message.user.name}</p>
      </div>
      <div>{message.text}</div>
      <button
        type="button"
        className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
        onClick={() => getSubMessages(message.id)}
      >
        Show answers
      </button>
      {expandedMessages.includes(message.id) && renderMessages(message.id)}
    </div>
  );
};

export default Message;
