import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/Home";

export default function App() {
  return (
    <main className="p-8 h-screen w-screen flex flex-col gap-3 items-center justify-end">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </main>
  )
}