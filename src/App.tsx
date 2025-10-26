import { Route, Routes } from "react-router";
import MainLayout from "./Layout/MainLayout";
import TestPage from "./TestPage";
import { BrowserRouter } from "react-router";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          {/*<Route index element={<TestPage />} />*/}
          <Route path="/" element={<TestPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
