import { Typography } from '@material-ui/core'; // Importing Typography from material-ui
import { motion, useAnimation } from 'framer-motion';
import React, { useEffect, useRef } from 'react';
import { Why1, Why2, Why3, Why4 } from '../../assets/assets';

const Features = () => {
  const featureDetails = [
    {
      title: "Targeted Job Listings",
      description: "Focus exclusively on restaurant and hospitality industry positions, ensuring relevant and high-quality job postings.",
      imgSrc: Why1
    },
    {
      title: "Efficient Hiring Process",
      description: "Streamline your recruitment with an easy-to-use platform that connects you directly with qualified candidates ready to join your team.",
      imgSrc: Why2    },
    {
      title: "Comprehensive Candidate Profiles",
      description: "Access detailed candidate profiles, including experience, skills, and certifications, to make informed hiring decisions quickly.",
      imgSrc: Why3    },
    {
      title: "User-Friendly Interface",
      description: "Benefit from a seamless and intuitive interface designed for both employers and job seekers, making the hiring process straightforward and stress-free.",
      imgSrc: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
    },
    {
      title: "Enhanced Job Matching",
      description: "Utilize advanced matching algorithms to connect the right candidates with the right job opportunities, reducing the time and effort spent on hiring.",
      imgSrc: Why4 
    }
  ];

  const carouselRef = useRef(null);
  const carouselAnimation = useAnimation();

  useEffect(() => {
    const animateCarousel = async () => {
      while (true) {
        await carouselAnimation.start({
          x: '-100%',
          transition: {
            duration: 10, // Slow down the transition duration
            ease: 'linear'
          }
        });
        await carouselAnimation.start({
          x: '0%',
          transition: {
            duration: 10, // Slow down the transition duration
            ease: 'linear'
          }
        });
      }
    };
    animateCarousel();
  }, [carouselAnimation]);

  return (
    <section id="why-us" className="features-area features-one py-16">
      <div className="container mx-auto px-4">
        {/* Why Us Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-[48rem] mx-auto">
            <Typography variant="h2"  className="mb-2 text-deep-orange-400">
              Why To Choose Us
            </Typography>
            <Typography  className="text-lg lg:text-xl mb-14">
              Experience efficient staffing processes and reliable support, enhancing overall operational efficiency and customer satisfaction.
            </Typography>
          </div>
        </motion.div>

        {/* Carousel Section */}
        <div className="relative   border-none w-full max-w-4xl mx-auto overflow-hidden rounded-lg shadow-lg border border-gray-300">

          <motion.div
            ref={carouselRef}
            animate={carouselAnimation}
            className="flex gap-8 p-4 "
          >
            {[...featureDetails, ...featureDetails].map((feature, index) => (
              <motion.div
                key={index}
                className="w-full max-w-xs flex-shrink-0  bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-lg backdrop-blur-sm bg-opacity-90 rounded-lg p-4"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <img
                  src={feature.imgSrc}
                  alt="card-image"
                  className="h-48 w-full object-cover mb-4 rounded-lg"
                />
                <h4 className="text-xl font-bold text-deep-orange-400 mb-2">
                  {feature.title}
                </h4>
                <p className=" font-normal text-white">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Features;
