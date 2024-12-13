import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import "antd/dist/reset.css";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import MyQuatations from "./pages/MyQuatations";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<HomePage />} path="/" />
        <Route element={<Login />} path="/login" />
        <Route element={<Register />} path="/register" />
        <Route element={<Dashboard />} path="/admin" />
        <Route element={<Profile />} path="/profile" />
        <Route element={<MyQuatations />} path="/quatations" />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
