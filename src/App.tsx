import { Button, HStack } from "@chakra-ui/react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { CardPage } from "./pages/CardPage";

function App() {
  return (
    <>
      <HStack>
        <Button>Click me</Button>
      </HStack>
      <Routes>
        <Route path="/cards/:id" element={<CardPage />} />
      </Routes>
    </>
  );
}

export default App;
