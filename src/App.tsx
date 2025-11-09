import { Route, Routes } from "react-router";
import MainLayout from "./Layout/MainLayout";
import TestPage from "./TestPage";
import { HashRouter } from "react-router";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<MainLayout />}>
          {/*<Route index element={<TestPage />} />*/}
          <Route index element={<TestPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
