import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import Shows from "./pages/Shows";
import Seats from "./pages/Seats";
import { Provider } from "react-redux";
import store from "./app/store/appStore";
import Body from "./components/Body";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<Body />}>
            <Route path="/movies" element={<Movies />} />
            <Route path="/movies/:movieId" element={<MovieDetails />} />
            <Route path="/movies/:movieId/shows" element={<Shows />} />
            <Route path="/shows/:showId/seats" element={<Seats />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;

