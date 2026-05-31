import { Routes, Route } from "react-router-dom";
import { CardPage } from "./pages/CardPage";
import { RegisterCardPage } from "./pages/RegisterCardPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/cards/:id" element={<CardPage />} />
        <Route path="/cards/register" element={<RegisterCardPage />} />
      </Routes>
    </>
  );
}

export default App;
