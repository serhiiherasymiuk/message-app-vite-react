import './App.css'
import "flowbite";
import {Route, Routes} from "react-router-dom";
import DefaultLayout from "./components/default/DefaultLayout.tsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<DefaultLayout />}>

        </Route>
      </Routes>
    </>
  )
}

export default App
