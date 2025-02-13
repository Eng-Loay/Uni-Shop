import Bestseller from "../../UI/Home/BestSellers/Bestseller";
import Landing from "../../UI/Home/Landing/landing";
import Libraries from "../../UI/Home/Libraries/libraries";
import Packages from "../../UI/Home/Packages/Packages";
import Slider from "../../UI/Home/Slider/Slider";
function Home() {
  return (
    <>
      <Landing />
      <Packages />
      <Slider />
      <Libraries />
      <Bestseller />
    </>
  );
}

export default Home;
