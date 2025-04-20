import arrow from "../../../assets/Home/BestSellers/arrow.svg";
import pencil from "../../../assets/Home/BestSellers/pencils.svg";
import scope from "../../../assets/Home/BestSellers/scope.svg";
import markers from "../../../assets/Home/BestSellers/markers.svg";
import flask from "../../../assets/Home/BestSellers/flask.svg";
import Details from "./Detailbut";

function Bestseller() {
  return (
    <div className="m-0 p-0 flex flex-col items-start w-full mb-40">
      {/* Header Section */}
      <div className="flex items-center pl-[5%]  mt-5">
        <p
          className="text-[#3E3B3B] text-[20px] lg:text-[28px] font-sans p-5 m-0"
          style={{ fontFamily: "Inter" }}
        >
          BEST SELLER PRODUCTS
        </p>
        <img src={arrow} alt="arrow icon" className="w-6 h-6 mr-2.5" />
      </div>

      {/* Product Grid */}
      <div className="mt-20 px-10 mx-auto  flex flex-row flex-wrap justify-center lg:justify-start gap-7">
        {/* First Image and Text */}
        <div className="flex flex-col items-center w-full sm:w-[45%] lg:w-auto">
          <img src={pencil} alt="Example Image" className="w-3/4 h-auto" />
          <p
            className="text-[#3E3B3B] text-[20px] mt-4 text-center"
            style={{ fontFamily: "Inter", fontWeight: 400 }}
          >
            Feber Castell Pencils
          </p>
          <p
            className="text-[#3E3B3B] text-[18px] font-bold mt-2"
            style={{ fontFamily: "Inter" }}
          >
            90 LE
          </p>
          <div style={{ marginTop: "10px" }}>
            <Details />
          </div>
        </div>

        {/* Second Image and Text */}
        <div className="flex flex-col items-center w-full sm:w-[45%] lg:w-auto">
          <img src={scope} alt="New Image" className="w-3/4 h-auto" />
          <p
            className="text-[#3E3B3B] text-[20px] mt-4 text-center"
            style={{ fontFamily: "Inter", fontWeight: 400 }}
          >
            Stethoscope
          </p>
          <p
            className="text-[#3E3B3B] text-[18px] font-bold mt-2"
            style={{ fontFamily: "Inter" }}
          >
            110 LE
          </p>
          <div style={{ marginTop: "10px" }}>
            <Details />
          </div>
        </div>

        {/* Third Image and Text */}
        <div className="flex flex-col items-center w-full sm:w-[45%] lg:w-auto">
          <img src={markers} alt="Third Image" className="w-3/4 h-auto" />
          <p
            className="text-[#3E3B3B] text-[20px]  mt-4 text-center"
            style={{ fontFamily: "Inter", fontWeight: 400 }}
          >
            Acrylic Painters Markers
          </p>
          <p
            className="text-[#3E3B3B] text-[18px] font-bold mt-2"
            style={{ fontFamily: "Inter" }}
          >
            270 LE
          </p>
          <div style={{ marginTop: "10px" }}>
            <Details />
          </div>
        </div>

        {/* Fourth Image and Text */}
        <div className="flex flex-col items-center w-full sm:w-[45%] lg:w-auto">
          <img src={flask} alt="Fourth Image" className="w-3/4 h-auto" />
          <p
            className="text-[#3E3B3B] text-[20px] font-normal mt-4 text-center"
            style={{ fontFamily: "Inter", fontWeight: 400 }}
          >
            Glass Flask
          </p>
          <p
            className="text-[#3E3B3B] text-[18px] font-bold mt-2"
            style={{ fontFamily: "Inter" }}
          >
            130 LE
          </p>
          <div style={{ marginTop: "10px" }}>
            <Details />
          </div>
        </div>
        {/* Fourth Image and Text */}
        <div className="flex flex-col items-center w-full sm:w-[45%] lg:w-auto">
          <img src={flask} alt="Fourth Image" className="w-3/4 h-auto" />
          <p
            className="text-[#3E3B3B] text-[20px] font-normal mt-4 text-center"
            style={{ fontFamily: "Inter", fontWeight: 400 }}
          >
            Glass Flask
          </p>
          <p
            className="text-[#3E3B3B] text-[18px] font-bold mt-2"
            style={{ fontFamily: "Inter" }}
          >
            130 LE
          </p>
          <div style={{ marginTop: "10px" }}>
            <Details />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Bestseller;
