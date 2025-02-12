import arrow from "../../assets/Home/Packages/arrow.svg";
import eng from "../../assets/Home/Packages/Eng-icon.gif"; // Engineering GIF
import arts from "../../assets/Home/Packages/artist-icon.gif"; // Arts GIF
import sci from "../../assets/Home/Packages/sci-icon.gif"; // Science GIF

function Packages() {
  return (
    <div className="m-0 p-0 flex flex-col items-start w-full">
      {/* Group "PACKAGES" and the arrow icon into one div */}
      <div className="flex items-center pl-[5%] lg:pl-[300px] mt-5">
        <p className="text-[#3E3B3B] text-[24px] lg:text-[28px] font-sans p-5 m-0">
          PACKAGES
        </p>
        <img src={arrow} alt="arrow icon" className="w-6 h-6 mr-2.5" />
      </div>

      {/* Categories div */}
      <div className="mx-auto mt-2.5 pl-5 flex flex-wrap justify-center gap-5">
        <div className="flex flex-col items-center gap-2.5">
          <img
            src={eng}
            alt="Engineering GIF"
            className="w-[150px] h-[150px] lg:w-[250px] lg:h-[250px]"
          />
          <p className="text-[16px] lg:text-[20px] px-5 py-2.5 bg-[#D6DDEBA8] rounded-lg font-bold text-black">
            Engineering tools
          </p>
        </div>
        <div className="flex flex-col items-center gap-2.5">
          <img
            src={arts}
            alt="Arts GIF"
            className="w-[150px] h-[150px] lg:w-[250px] lg:h-[250px]"
          />
          <p className="text-[16px] lg:text-[20px] px-5 py-2.5 bg-[#D6DDEBA8] rounded-lg font-bold text-black">
            Fine arts tools
          </p>
        </div>
        <div className="flex flex-col items-center gap-2.5">
          <img
            src={sci}
            alt="Science GIF"
            className="w-[150px] h-[150px] lg:w-[250px] lg:h-[250px]"
          />
          <p className="text-[16px] lg:text-[20px] px-5 py-2.5 bg-[#D6DDEBA8] rounded-lg font-bold text-black">
            Science tools
          </p>
        </div>
      </div>
    </div>
  );
}
export default Packages;
