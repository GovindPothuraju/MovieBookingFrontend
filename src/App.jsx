import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Provider } from "react-redux";
import store from "./app/store/appStore";
import Body from "./components/Body";

const Login = lazy(() => import("./pages/Login"));
const Home = lazy(() => import("./pages/Home"));
const Movies = lazy(() => import("./pages/Movies"));
const MovieDetails = lazy(() => import("./pages/MovieDetails"));
const Shows = lazy(() => import("./pages/Shows"));
const Seats = lazy(() => import("./pages/Seats"));
const Payment = lazy(() => import("./components/Payments"));
const Bookings = lazy(() => import("./components/Bookings"));
const BookingDetails = lazy(() => import("./pages/BookingDetails"));
const Profile = lazy(() => import("./pages/Profile"));

const Loader = () => <div className="flex min-h-screen items-center justify-center bg-[#09090B] text-xl font-bold text-red-500">QUICKBOOK</div>;

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route element={<Body />}>
              <Route path="/home" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/movies" element={<Movies standalone={true}/>} />
              <Route path="/movies/:slug" element={<MovieDetails />} />
              <Route path="/movies/:slug/shows" element={<Shows />} />
              <Route path="/shows/:showId/seats" element={<Seats />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/bookings/:bookingId" element={<BookingDetails />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </Provider>
  );
}

export default App;