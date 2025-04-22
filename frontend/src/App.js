import { BrowserRouter,Routes,Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Home from "./pages/Home";
import CountryDetails from "./pages/CountryDetails";
import Footer from "./components/Footer";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
      <Route path="/register" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Home />} />
      <Route path="/country/:code" element={<CountryDetails />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;