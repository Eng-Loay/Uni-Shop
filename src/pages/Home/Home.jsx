import Bestseller from "../../UI/Home/BestSellers/Bestseller";
import Leading from "../../UI/Home/Landing/landing";
import Libraries from "../../UI/Home/Libraries/libraries";
import Packages from "../../UI/Home/Packages/Packages";
import Slider from "../../UI/Home/Slider/Slider";
function Home() {
  return (
    <>
      <Leading />
      <Packages />
      <Slider />
      <Libraries />
      <Bestseller />
    </>
  );
}

export default Home;
