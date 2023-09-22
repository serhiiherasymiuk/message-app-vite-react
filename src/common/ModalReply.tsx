import { FC, useEffect, useState } from "react";
import { IMessageCreate } from "../entities/Message.ts";
import http_common from "../http_common.ts";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import ImageGroup from "./ImageGroup.tsx";
import EditorTiny from "./EditorTiny.tsx";
import { useSelector } from "react-redux";
import { IAuthUser } from "../entities/Auth.ts";

interface Props {
  parent_id: number | null;
  label: string;
  onAddMessage: () => void;
}

const ModalReply: FC<Props> = ({ parent_id, label, onAddMessage }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const { user } = useSelector((store: any) => store.auth as IAuthUser);

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      setModalOpen(false);
    }
  };

  useEffect(() => {
    if (user) {
      setInitialValues((prevValues) => ({
        ...prevValues,
        user_id: user.id,
      }));
    }
  }, [user]);

  const [initialValues, setInitialValues] = useState<IMessageCreate>({
    text: "",
    image: null,
    parent_id: parent_id,
    user_id: -1,
  });

  const messageSchema = Yup.object().shape({
    text: Yup.string()
      .required("Text is required")
      .max(4000, "Text must be smaller"),
  });

  const handleSubmit = async (values: IMessageCreate) => {
    try {
      await messageSchema.validate(values);

      await http_common.post("api/message", values, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setModalOpen(false);

      onAddMessage();
    } catch (error) {
      console.error("Error creating message:", error);
    }
  };

  return (
    <>
      <button
        type="button"
        className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium"
        onClick={() => setModalOpen(true)}
      >
        <svg
          className="mr-1.5 w-3.5 h-3.5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 18"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 5h5M5 8h2m6-3h2m-5 3h6m2-7H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3v5l5-5h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"
          />
        </svg>
        {label}
      </button>

      {isModalOpen && (
        <div
          onClick={handleOverlayClick}
          className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50"
        >
          <div
            className="relative bg-white rounded-lg shadow dark:bg-gray-700"
            style={{ overflowY: "auto", maxHeight: "80vh" }}
          >
            <button
              type="button"
              className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <svg
                className="w-3 h-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              ></svg>
              <span className="sr-only">Close modal</span>
            </button>
            <div className="p-6 text-center">
              <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
                validationSchema={messageSchema}
                enableReinitialize={true}
              >
                {({ values, errors, touched, setFieldValue }) => (
                  <Form>
                    <EditorTiny
                      value={values.text}
                      label="Text"
                      field="text"
                      error={errors.text}
                      touched={touched.text}
                      onEditorChange={(text: string) => {
                        setFieldValue("text", text);
                      }}
                    />
                    <ImageGroup
                      image={values.image}
                      setFieldValue={setFieldValue}
                      error={errors.image}
                      touched={touched.image}
                    ></ImageGroup>
                    <button
                      type="submit"
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    >
                      {label}
                    </button>
                    <button
                      onClick={() => setModalOpen(false)}
                      type="button"
                      className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                    >
                      Cancel
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalReply;
