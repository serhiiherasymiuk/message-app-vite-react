import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import jwtDecode from "jwt-decode";
import { AuthUserActionType, IUser } from "./entities/Auth.ts";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

if (localStorage.token) {
  const token = localStorage.token;
  const user = jwtDecode(token) as IUser;
  store.dispatch({
    type: AuthUserActionType.LOGIN_USER,
    payload: {
      email: user.email,
      name: user.name,
      image: user.image,
    },
  });
}

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
);
