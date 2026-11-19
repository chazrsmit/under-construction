import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import ProjectDetails from "./components/ProjectDetails";

// HashRouter: GitHub Pages can't serve deep links like /project/litteria on refresh,
// while #/project/litteria always works.
// Home is the parent route, so it stays mounted (tiles, gradient squares) while the
// details page renders inside it through <Outlet />.
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="project/:id" element={<ProjectDetails />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}