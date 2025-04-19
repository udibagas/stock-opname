import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/Home";
import { isMobile } from 'react-device-detect';
import Label from "./pages/Label";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isMobile ? <Home /> : <Label />} />
      </Routes>
    </BrowserRouter>
  )
}