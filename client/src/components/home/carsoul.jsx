import { Button, Carousel, Typography } from "@material-tailwind/react";
import React from 'react';
import { Link } from 'react-router-dom';
import { Slider1, Slider2, Slider3 } from '../../assets/assets';


const Carouselmain = () => {

    return (
        <section className="slider-area slider-two ">
            <div className="container-fluid">
                <div className="flex flex-wrap items-center">
                    <Carousel className="rounded-xl mx-8 h-[80vh] my-4"
                        autoplay={true} 
                        transition={{ duration: 2 }}
                        navigation={({ setActiveIndex, activeIndex, length }) => (
                            <div className="absolute bottom-4 left-2/4 z-5 flex -translate-x-2/4 gap-2">
                                {new Array(length).fill("").map((_, i) => (
                                    <span
                                        key={i}
                                        className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${activeIndex === i ? "w-8 bg-white" : "w-4 bg-white/50"
                                            }`}
                                        onClick={() => setActiveIndex(i)}
                                    />
                                ))}
                            </div>
                        )}
                    >
                        <div className="relative h-full w-full">
                            <img
                                src={Slider1}
                                alt="image 1"
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 grid h-full w-full place-items-center bg-black/75">
                                <div className="w-3/4 text-center md:w-2/4">
                                    <Typography
                                        variant="h1"
                                        color="white"
                                        className="mb-4 text-3xl md:text-4xl lg:text-5xl"
                                    >
                                        “Bridging restaurant stars with elite staffing solutions.”
                                    </Typography>
                                    <Typography
                                        variant="lead"
                                        color="white"
                                        className="mb-12 opacity-80"
                                    >
                                        We recognize the challenges individuals and restaurants encounter in securing reliable, skilled staff. Explore how our innovative solutions can revolutionize your journey in the culinary and hospitality field or elevate your restaurant's staffing management.
                                    </Typography>
                                    <div className="flex justify-center gap-2">
                                        <Link to="/candidate/candidate-login">
                                            <Button size="lg" color="white">
                                                GET JOB
                                            </Button>
                                        </Link>
                                        <Link to="/restaurant/restaurant-login">
                                            <Button size="lg" color="white" variant="text">
                                                Hire Candidates
                                            </Button>
                                        </Link>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="relative h-full w-full">
                            <img
                                src={Slider2}
                                alt="image 2"
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="relative h-full w-full">
                            <img
                                src={Slider3}
                                alt="image 3"
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </Carousel>
                </div>
            </div>
        </section>
    );
};

export default Carouselmain;
