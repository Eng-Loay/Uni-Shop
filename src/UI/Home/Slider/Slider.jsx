import { useState, useEffect, useRef } from "react";
import sales2 from "../../../assets/Home/Slider/sales2.jpg";
import sales from "../../../assets/Home/Slider/sales.jpg";

function Slider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const images = [sales2, sales];
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const autoSlideInterval = useRef(null);

  // Function to handle automatic sliding
  const startAutoSlide = () => {
    autoSlideInterval.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000);
  };

  useEffect(() => {
    startAutoSlide();
    return () => clearInterval(autoSlideInterval.current);
  }, []);

  // Handle touch start
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  // Handle touch move
  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  // Handle touch end (swipe logic)
  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const deltaX = touchStartX.current - touchEndX.current;

    if (deltaX > 50) {
      // Swipe Left (Next Slide)
      setCurrentSlide((prev) => (prev + 1) % images.length);
    } else if (deltaX < -50) {
      // Swipe Right (Previous Slide)
      setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
    }

    // Reset touch values
    touchStartX.current = null;
    touchEndX.current = null;

    // Restart auto-slide
    clearInterval(autoSlideInterval.current);
    startAutoSlide();
  };

  return (
    <div
      className="w-full max-w-[700px] h-auto aspect-[1298/846] mt-[50px] mx-auto overflow-hidden relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex transition-transform duration-500 ease-in-out w-[200%] h-full"
        style={{ transform: `translateX(-${currentSlide * 50}%)` }}
      >
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Slide ${index + 1}`}
            className="w-1/2 h-full flex-shrink-0 object-cover"
          />
        ))}
      </div>
    </div>
  );
}

export default Slider;
