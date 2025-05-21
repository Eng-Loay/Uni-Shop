import { useEffect, useState } from "react";
import Details from "./Detailbut";
import arrow from "../../../assets/Home/BestSellers/arrow.svg";

function Bestseller() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}api/v1/product/best_seller`
        );
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch best sellers:", err);
      }
    };

    fetchBestSellers();
  }, []);

  return (
    <div className="m-0 p-0 flex flex-col items-start w-full mb-40">
      {/* Header */}
      <div className="flex items-center pl-[5%] mt-5">
        <p className="text-[#3E3B3B] text-[20px] lg:text-[28px] font-sans p-5 m-0">
          BEST SELLER PRODUCTS
        </p>
        <img src={arrow} alt="arrow icon" className="w-6 h-6 mr-2.5" />
      </div>

      {/* Products Grid */}
      <div className="mt-20 px-10 mx-auto flex flex-row flex-wrap justify-center md:justify-start gap-7">
        {products.map((product) => (
          <div
            key={product._id}
            /* fixed card width — tweak to taste */
            className="flex flex-col items-center w-[230px]"
          >
            {/* fixed image box, keeps all images equal size */}
            <div className="w-full h-[180px] flex items-center justify-center">
              <img
                src={product.product_pictures?.[0]?.secure_url}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            {/* name — reserve space so rows stay straight */}
            <p
              className="text-[#3E3B3B] text-[16px] mt-4 text-center leading-snug
                         line-clamp-2 min-h-[48px]" /* 2 lines tall */
            >
              {product.name}
            </p>

            {/* price */}
            <p className="text-[#3E3B3B] text-[18px] font-bold mt-1">
              {Math.round(product.price)} LE
            </p>

            {/* button */}
            <div className="mt-2">
              <Details />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Bestseller;
