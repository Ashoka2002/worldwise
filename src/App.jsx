import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { CitiesPovider } from "./contexts/CitiesContext";
import { AuthProvider } from "./contexts/FakeAuthContext";
import ProtectedRoute from "./pages/ProtectedRoute";
import { Suspense, lazy } from "react";

import CityList from "./component/CityList";
import CountriesList from "./component/CountriesList";
import City from "./component/City";
import Form from "./component/Form";
import SpinnerFullPage from "./component/SpinnerFullPage";
import { useMediaQuery } from "react-responsive";

const Homepage = lazy(() => import("./pages/Homepage"));
const Product = lazy(() => import("./pages/Product"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Login = lazy(() => import("./pages/Login"));
const Applayout = lazy(() => import("./pages/Applayout"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));

function App() {
  const isLaptopOrDesktop = useMediaQuery({
    query: "(min-width: 1024px)",
  });
  const isTabletOrMobile = useMediaQuery({
    query: "(max-width: 1024px)",
  });

  console.log("desc:", isLaptopOrDesktop);
  console.log("Mobile:", isTabletOrMobile);

  return (
    <AuthProvider>
      <CitiesPovider>
        <BrowserRouter>
          <Suspense fallback={<SpinnerFullPage />}>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="product" element={<Product />} />
              <Route path="pricing" element={<Pricing />} />
              <Route path="login" element={<Login />} />
              <Route
                path="app"
                element={
                  <ProtectedRoute>
                    <Applayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate replace to="cities" />} />

                <Route path="cities" element={<CityList />} />
                <Route path="cities/:id" element={<City />} />
                <Route path="countries" element={<CountriesList />} />
                <Route path="form" element={<Form />} />
              </Route>
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </CitiesPovider>
    </AuthProvider>
  );
}

export default App;
