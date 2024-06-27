import { Card, CardBody, CardHeader, Typography } from "@material-tailwind/react";
import { motion, useAnimation } from 'framer-motion';
import React, { useEffect, useRef } from 'react';
import { About1, About2 } from "../../assets/assets";


function useIntersectionObserver(ref) {
    const controls = useAnimation();

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    controls.start({
                        opacity: 1,
                        x: 0,
                        transition: { duration: 1 },
                    });
                }
            },
            {
                threshold: 0.5,
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [ref, controls]);

    return controls;
}


function About() {
    const aboutRef = useRef(null);
    const controlsText = useIntersectionObserver(aboutRef);
    const controlsCard1 = useIntersectionObserver(aboutRef);
    const controlsCard2 = useIntersectionObserver(aboutRef);

    return (
        <section ref={aboutRef} id="About-us" className="py-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-indigo-600/20 to-blue-600/20 animate-gradient-x"></div>
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <Typography variant="h2" className="mb-2 text-6xl font-extralight text-transparent bg-clip-text text-deep-orange-400">
                        About Us
                    </Typography>
                    <motion.div
                        ref={aboutRef}
                        initial={{ opacity: 0, y: 50 }}
                        animate={controlsText}
                    >
                        <Typography className="text-lg lg:text-xl mb-14  max-w-4xl mx-auto">
                            At our restaurant manpower hiring portal, we're more than a bridge between candidates and restaurants – we're the architects of culinary success stories. With a fervor for flavors and a commitment to excellence, we curate connections that transform careers and elevate dining experiences.
                        </Typography>
                    </motion.div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <AboutCard
                        controls={controlsCard1}
                        image={About1}
                        title="Crafting Exceptional Connections"
                        description="We specialize in personalized matchmaking, connecting skilled candidates with rewarding opportunities and assisting restaurants in building stellar teams. Your success is our priority – join us in creating lasting partnerships for unparalleled career growth and operational excellence."
                    />
                    <AboutCard
                        controls={controlsCard2}
                        image={About2}
                        title="Expertise, Precision, Passion"
                        description="Our team of seasoned professionals not only understands the intricate dynamics of the restaurant industry but also excels in providing bespoke solutions. We navigate the complexities, offering insights that lead to tailored strategies."
                    />
                </div>
            </div>
        </section>
    );
}

function AboutCard({ controls, image, title, description }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={controls}
        >
            <Card className="h-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-lg backdrop-blur-sm bg-opacity-90 overflow-hidden">
                <CardHeader floated={false} color="blue-gray" className="relative h-56 m-0">
                    <img
                        src={image}
                        alt="card-image"
                        className="object-cover w-full h-full"
                    />
                </CardHeader>
                <CardBody>
                    <Typography variant="h5" color="white" className="mb-2 font-bold text-transparent bg-clip-text text-deep-orange-400">
                        {title}
                    </Typography>
                    <Typography color="gray" className="text-gray-300">
                        {description}
                    </Typography>
                </CardBody>
            </Card>
        </motion.div>
    );
}

export default About;