import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import AuthPage from "./AuthPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Home />} />

        {/* Authentication Page */}
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </Router>
  );
}

export default App;
