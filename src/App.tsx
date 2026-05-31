import { Routes, Route } from "react-router-dom";
import { CardPage } from "./pages/CardPage";
import { RegisterCardPage } from "./pages/RegisterCardPage";
import { TopPage } from "./pages/TopPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<TopPage />} />
        <Route path="/cards/:id" element={<CardPage />} />
        <Route path="/cards/register" element={<RegisterCardPage />} />
      </Routes>
    </>
  );
}

export default App;
