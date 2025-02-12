// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import chm from "../../../assets/Home/Slider/chemicals.svg"; // Replace with your first image path
import sales from "../../../assets/Home/Slider/sales.svg"; // Replace with your second image path

function Slider() {
  const [currentSlide, setCurrentSlide] = useState(0); // Track the current slide
  const images = [chm, sales]; // Array of images

  // Automatically switch slides every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide === 0 ? 1 : 0));
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return (
    <div className="w-full max-w-[90%] lg:max-w-[800px] h-[300px] lg:h-[500px] mt-[50px] mx-auto overflow-hidden relative">
      <div
        className="flex transition-transform duration-500 ease-in-out w-[200%] h-full"
        style={{ transform: `translateX(-${currentSlide * 50}%)` }}
      >
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Slide ${index + 1}`}
            className="w-1/2 h-full flex-shrink-0 object-contain"
          />
        ))}
      </div>
    </div>
  );
}

export default Slider;
