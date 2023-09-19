import { useNavigate } from "react-router-dom";
import {
  AuthUserActionType,
  ILoginResult,
  IRegister,
  IUser,
} from "../../../entities/Auth.ts";
import * as Yup from "yup";
import http_common from "../../../http_common.ts";
import { Form, Formik } from "formik";
import InputGroup from "../../../common/InputGroup.tsx";
import ImageGroup from "../../../common/ImageGroup.tsx";
import jwtDecode from "jwt-decode";
import { useDispatch } from "react-redux";

function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const initialValues: IRegister = {
    image: null,
    email: "",
    name: "",
    password: "",
    password_confirmation: "",
  };

  const registerSchema = Yup.object().shape({
    email: Yup.string().required("Email is required").email("Invalid email"),
    password: Yup.string().required("Password is required"),
    password_confirmation: Yup.string()
      .required("Password confirmation is required")
      .oneOf([Yup.ref("password")], "Passwords must match"),
    name: Yup.string().required("Name is required"),
  });

  const handleSubmit = async (values: IRegister) => {
    try {
      console.log(values);
      await http_common
        .post("api/auth/register", values, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(async () => {
          const result = await http_common.post<ILoginResult>(
            "api/auth/login",
            values,
          );
          const { data } = result;
          console.log(data);
          const token = data.access_token;
          localStorage.token = token;
          const user = jwtDecode(token) as IUser;
          dispatch({
            type: AuthUserActionType.LOGIN_USER,
            payload: {
              name: user.name,
              email: user.email,
            },
          });
          navigate("/");
        });
      navigate("/");
    } catch (error) {
      console.error("Error register:", error);
    }
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={registerSchema}
      >
        {({
          setFieldValue,
          values,
          handleChange,
          errors,
          touched,
          handleBlur,
        }) => (
          <Form>
            <i
              className="bi bi-arrow-left-circle-fill back-button"
              onClick={() => navigate("..")}
            ></i>
            <InputGroup
              label="Email"
              type="email"
              field="email"
              handleBlur={handleBlur}
              error={errors.email}
              touched={touched.email}
              handleChange={handleChange}
            ></InputGroup>
            <InputGroup
              label="Name"
              type="text"
              field="name"
              handleBlur={handleBlur}
              error={errors.name}
              touched={touched.name}
              handleChange={handleChange}
            />
            <InputGroup
              label="Password"
              type="password"
              field="password"
              handleBlur={handleBlur}
              error={errors.password}
              touched={touched.password}
              handleChange={handleChange}
            ></InputGroup>
            <InputGroup
              label="Password confirmation"
              type="password"
              field="password_confirmation"
              handleBlur={handleBlur}
              error={errors.password_confirmation}
              touched={touched.password_confirmation}
              handleChange={handleChange}
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
              Register
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default RegisterPage;
