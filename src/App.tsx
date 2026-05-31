import { Routes, Route } from "react-router-dom";
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
