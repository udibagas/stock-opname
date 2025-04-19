import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/Home";
import { isMobile } from 'react-device-detect';

export default function App() {
  if (!isMobile) {
    return (
      <main className="p-8 h-screen w-screen flex flex-col gap-3 items-center justify-center">
        <h1 className="text-2xl font-bold text-red-500">Please use a mobile browser!</h1>
      </main>
    )
  }

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