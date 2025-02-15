import wave from "../../../assets/Home/Landing/wave.svg";
import leading from "../../../assets/Home/Landing/leading.svg";

function Landing() {
  return (
    <div className="bg-[#001F54] w-full min-h-[50vh] sm:min-h-screen px-0 sm:px-6 md:px-8 lg:px-10 py-5 sm:py-10 relative overflow-hidden flex flex-col justify-center items-center sm:block">
      {/* Text Section */}
      <div className="text-center sm:text-left -mt-25 sm:mt-0">
        <h1 className="text-white text-3xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold font-serif tracking-wider">
          UNI
        </h1>
        <h1 className="text-white text-3xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold sm:px-20 md:px-40 lg:px-60 py-2 sm:py-5 md:py-10 font-serif">
          SHOP
        </h1>
      </div>

      {/* Wave Graphic */}
      <div className="absolute bottom-0 right-0 z-10">
        <img
          src={wave}
          alt="Wave Graphic"
          className="w-auto h-32 sm:h-32 md:h-48 lg:h-64 xl:h-auto"
        />
      </div>

      {/* Leading Photo */}
      <div className="absolute bottom-0 right-0 z-20">
        <img
          src={leading}
          alt="Leading"
          className="w-auto h-45 sm:h-48 md:h-64 lg:h-80 xl:h-auto"
        />
      </div>
    </div>
  );
}

export default Landing;
