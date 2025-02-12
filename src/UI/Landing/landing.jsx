import wave from "../../assets/Home/Landing/wave.svg";
import leading from "../../assets/Home/Landing/leading.svg";

function Leading() {
  return (
    <div className="bg-[#001F54] w-full min-h-screen px-4 sm:px-6 md:px-8 lg:px-10 py-10 relative overflow-hidden">
      {/* Text Section */}
      <div className="text-center sm:text-left">
        <h1 className="text-white text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold">
          UNI
        </h1>
        <h1 className="text-white text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold sm:px-20 md:px-40 lg:px-60 py-5 sm:py-10">
          SHOP
        </h1>
      </div>

      {/* Wave Graphic */}
      <div className="absolute bottom-0 right-0 z-10">
        <img
          src={wave}
          alt="Wave Graphic"
          className="w-auto h-32 sm:h-48 md:h-64 lg:h-auto"
        />
      </div>

      {/* Leading Photo */}
      <div className="absolute bottom-0 right-0 z-20">
        <img
          src={leading}
          alt="Leading"
          className="w-auto h-48 sm:h-64 md:h-80 lg:h-auto"
        />
      </div>
    </div>
  );
}

export default Leading;
