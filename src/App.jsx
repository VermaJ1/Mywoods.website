import { Routes, Route,Link } from "react-router-dom";

import About from "./routes/About";
import Contact from "./routes/Contact";
import Woods from "./routes/Woods/pages";
import Home from "./routes/Home";
import Header from "./components/compound/Header";
import Footer from "./components/compound/Footer";
import CMS from "./routes/cms";
import Login from "./routes/login";
import Signup from "./routes/signup";

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/woods" element={<Woods />} />
        <Route path="/cms" element={<CMS />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;