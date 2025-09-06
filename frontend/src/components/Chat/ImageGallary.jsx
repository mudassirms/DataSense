import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectCoverflow } from "swiper/modules";
import Zoom from "react-medium-image-zoom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";
import "react-medium-image-zoom/dist/styles.css";

const ImageGallery = ({ images }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const openFullScreen = (index) => setSelectedImageIndex(index);
  const closeFullScreen = () => setSelectedImageIndex(null);
  const nextImage = () => setSelectedImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  return (
    <div className="mt-4">
      <h3 className="text-black text-lg font-semibold mb-4 text-center">
        Relevant Screenshots
      </h3>

      {/* Constrain width to avoid overflow */}
      <div className="w-full max-w-full overflow-hidden px-4">
        <Swiper
          spaceBetween={30}
          slidesPerView={3}
          centeredSlides={true}
          initialSlide={5}
          slideToClickedSlide={true}
          navigation
          effect="coverflow"
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2.5,
            slideShadows: false,
          }}
          modules={[Navigation, EffectCoverflow]}
          className="rounded-lg w-full max-w-full"
        >
          {images.map((img, index) => (
            <SwiperSlide key={index}>
              <img
                src={img}
                alt={`Screenshot ${index + 1}`}
                onClick={() => openFullScreen(index)}
                className="transition-transform duration-300 ease-in-out w-full h-24 md:h-28 object-cover rounded-lg cursor-pointer border border-gray-300 bg-gray-100 p-1"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Fullscreen Viewer with Zoom */}
      {selectedImageIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={closeFullScreen}
        >
          <div
            className="relative w-full max-w-5xl flex items-center justify-center px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-3xl hover:text-indigo-400 z-50"
              onClick={prevImage}
            >
              ❮
            </button>

            <Zoom>
              <img
                src={images[selectedImageIndex]}
                alt="Zoomed Screenshot"
                className="max-h-[80vh] rounded-lg shadow-2xl object-contain"
              />
            </Zoom>

            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-3xl hover:text-indigo-400 z-50"
              onClick={nextImage}
            >
              ❯
            </button>

            <button
              className="absolute top-4 right-4 text-white text-2xl hover:text-red-400 z-50"
              onClick={closeFullScreen}
            >
              ✖
            </button>
          </div>
        </div>
      )}

      {/* Highlight Active Slide */}
      <style>{`
        .swiper-slide-active img {
          transform: scale(1.1);
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
          z-index: 10;
        }
      `}</style>
    </div>
  );
};

export default ImageGallery;
