import "./App.css";
import Fotter from "./components/Fotter/fotter";
import Navbar from "./components/Header/Navbar";
import Leading from "./UI/Home/Landing/landing";
import Libraries from "./UI/Home/Libraries/libraries";
import Packages from "./UI/Home/Packages/Packages";
import Slider from "./UI/Home/Slider/Slider";

function App() {
  return (
    <>
      <Navbar />
      <Leading />
      <Packages />
      <Slider />
      <Libraries />
      <Fotter />
    </>
  );
}

export default App;
