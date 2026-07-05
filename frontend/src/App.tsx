import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Detect from "./pages/Detect";
import History from "./pages/History";
import Result from "./pages/Result";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-ink font-body">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/detect" element={<Detect />} />
          <Route path="/history" element={<History />} />
          <Route path="/result/:id" element={<Result />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}


