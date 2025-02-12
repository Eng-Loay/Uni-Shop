import arrow from "../../../assets/Home/Packages/arrow.svg";
import Garo from "../../../assets/Home/Libraries/Garo.svg";
import KamalSaad from "../../../assets/Home/Libraries/KamalSaad.svg";
import TabebMohands from "../../../assets/Home/Libraries/TabebMohands.svg";

function Libraries() {
  return (
    <div className="m-0 p-0 flex flex-col items-start w-full">
      {/* Group "LIBRARIES" and the arrow icon into one div */}
      <div className="flex items-center pl-[5%] lg:pl-[300px] mt-5">
        <p className="text-[#3E3B3B] text-[24px] lg:text-[28px] font-sans p-5 m-0">
          LIBRARIES
        </p>
        <img src={arrow} alt="arrow icon" className="w-6 h-6 mr-2.5" />
      </div>

      {/* Photos LIBRARIES */}
      <div className="flex flex-col lg:flex-row gap-4 p-[5%] lg:pl-[300px]">
        {/* KamalSaad Image */}
        <div className="w-full lg:w-auto">
          <img src={KamalSaad} alt="KamalSaad" className="w-full lg:w-auto" />
        </div>

        {/* Garo and TabebMohands Images */}
        <div className="flex flex-col gap-4 w-full lg:w-auto">
          <img src={Garo} alt="Garo" className="w-full lg:w-auto" />
          <img
            src={TabebMohands}
            alt="TabebMohands"
            className="w-full lg:w-auto"
          />
        </div>
      </div>
    </div>
  );
}

export default Libraries;
