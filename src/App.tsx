import { Routes, Route } from "react-router-dom";
import "./App.css";
import { CardPage } from "./pages/CardPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/cards/:id" element={<CardPage />} />
      </Routes>
    </>
  );
}

export default App;
