import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import hero_image from "../../assets/images/hero_img.png";
import hero_image2 from "../../assets/images/hero_img2.png";
import hero_image3 from "../../assets/images/hero_img3.png";
import hero_image4 from "../../assets/images/hero_img4.png";
import hero_image5 from "../../assets/images/hero_img5.png";
import hero_image6 from "../../assets/images/hero_img6.png";

const HeroImage = () => {
  return (
    <section className="relative w-full my-8">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000 }}
        loop={true}
        className="w-full h-[450px] md:h-[550px] rounded-2xl shadow-lg"
      >
        {[hero_image, hero_image4, hero_image2, hero_image6, hero_image5, hero_image3].map(
          (img, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-full">
                <img
                  src={img}
                  alt={`Hero ${index + 1}`}
                  className="w-full h-full object-cover rounded-2xl"
                />
                {/* Overlay for better text visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 via-blue-800/20 to-transparent rounded-2xl"></div>
                {/* Optional text over image */}
                <div className="absolute bottom-10 left-10 text-white">
                  <h2 className="text-3xl md:text-4xl font-bold drop-shadow-lg">
                    Discover Your Next Adventure
                  </h2>
                  <p className="text-lg mt-2 opacity-90">
                    Travel smarter with Trevo
                  </p>
                </div>
              </div>
            </SwiperSlide>
          )
        )}
      </Swiper>
    </section>
  );
};

export default HeroImage;
