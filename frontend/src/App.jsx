import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Explore from "./pages/Explore";
import HeritageDetails from "./pages/HeritageDetails";
import SnapIdentify from "./pages/SnapIdentify";
import AIGuide from "./pages/AIGuide";
import HeritagePassport from "./pages/HeritagePassport";
import Quiz from "./pages/Quiz";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/quiz" element={<Quiz />} />

        <Route path="/explore" element={<Explore />} />

        <Route
          path="/heritage/:id"
          element={<HeritageDetails />}
        />
        <Route
  path="/passport"
  element={<HeritagePassport />}
/>
        <Route path="/ai-guide" element={<AIGuide />} />
        <Route
          path="/snap"
          element={<SnapIdentify />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;