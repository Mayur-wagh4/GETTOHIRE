import { Button, Carousel, Typography } from "@material-tailwind/react";
import React from "react";
import { Link } from "react-router-dom";
import { Slider1, Slider2, Slider3 } from "../../assets/assets";

const CarouselMain = () => {
  return (
    <section className="relative overflow-hidden bg-gray-900">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 z-15"></div>
      <Carousel
        className="h-[90vh]"
        autoplay={true}
        autoplayDelay={5000}
        transition={{ duration: 1 }}
        navigation={({ setActiveIndex, activeIndex, length }) => (
          <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
            {new Array(length).fill("").map((_, i) => (
              <span
                key={i}
                className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${
                  activeIndex === i ? "w-8 bg-white" : "w-4 bg-white/50"
                }`}
                onClick={() => setActiveIndex(i)}
              />
            ))}
          </div>
        )}
      >
        {[Slider1, Slider2, Slider3].map((image, index) => (
          <div key={index} className="relative h-full w-full">
            <img
              src={image}
              alt={`Slider ${index + 1}`}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60">
              <div className="text-center px-6 md:px-12 lg:px-24 max-w-4xl">
                <Typography
                  variant="h1"
                  color="white"
                  className="mb-6 text-3xl md:text-5xl lg:text-6xl font-bold leading-tight animate-fade-in-down"
                >
                  Bridging restaurant stars with elite staffing solutions
                </Typography>
                <Typography
                  variant="lead"
                  color="white"
                  className="mb-12 text-lg md:text-xl lg:text-2xl opacity-80 animate-fade-in-up"
                >
                  We recognize the challenges individuals and restaurants
                  encounter in securing reliable, skilled staff. Explore how
                  our innovative solutions can revolutionize your journey in
                  the culinary and hospitality field or elevate your
                  restaurant's staffing management.
                </Typography>
                <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in">
                  <Link to="/candidate-login">
                    <Button size="lg" className="bg-orange-900 hover:bg-orange-600 text-white shadow-lg transition-all duration-300 transform hover:scale-105">
                      GET JOB
                    </Button>
                  </Link>
                  <Link to="/restaurant-login">
                    <Button size="lg" className="bg-white hover:bg-gray-100 text-gray-800 shadow-lg transition-all duration-300 transform hover:scale-105">
                      Hire Candidates
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </section>
  );
};

export default CarouselMain;