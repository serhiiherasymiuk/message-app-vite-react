import "./App.css";
import "flowbite";
import { Route, Routes } from "react-router-dom";
import DefaultLayout from "./components/default/DefaultLayout.tsx";
import LoginPage from "./components/auth/login/LoginPage.tsx";
import RegisterPage from "./components/auth/register/RegisterPage.tsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<DefaultLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
