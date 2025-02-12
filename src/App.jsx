import "./App.css";
import Fotter from "./components/Fotter/fotter";
import Navbar from "./components/Header/Navbar";
import Leading from "./UI/Landing/landing";
import Packages from "./UI/Packages/Packages";
import Slider from "./UI/Slider/Slider";

function App() {
  return (
    <>
      <Navbar />
      <Leading />
      <Packages />
      <Slider />
      <Fotter />
    </>
  );
}

export default App;
