import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router";
import Products from "./pages/Products";
import SegmentEditor from "./pages/SegmentEditor";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route path="/products" element={<Products />} />
        <Route path="/segment-editor" element={<SegmentEditor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
