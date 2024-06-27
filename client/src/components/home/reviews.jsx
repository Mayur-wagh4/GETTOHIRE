import { Typography } from '@material-ui/core';
import { motion, useAnimation } from 'framer-motion';
import React, { useEffect, useRef } from 'react';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { Review1Image, Review2Image, Review3Image } from '../../assets/assets';

const reviewsData = [
  {
    image: Review1Image,
    name: "Gaurav Chawla",
    company: "Greensalads.in",
    review: "Get-to-Hire has revolutionized our hiring process. Their platform simplifies recruitment, providing a seamless experience from posting jobs to finding the perfect candidates. The personalized support and quality candidates they deliver have elevated our team. Truly a game-changer in the hospitality hiring landscape.",
    rate: 4.5
  },
  {
    image: Review2Image,
    name: "Rahul Tendulkar",
    company: "Fruit.in",
    review: "Choosing Get-to-Hire was the best decision for our staffing needs. The platform's efficiency and user-friendly interface saved us valuable time. The caliber of candidates presented exceeded our expectations, ensuring that every hire contributes to our restaurant's success. Get-to-Hire is the go-to for effective HR solutions.",
    rate: 5
  },
  {
    image: Review3Image,
    name: "Sneha Kadam",
    company: "Sugoi Ramen",
    review: "Get-to-Hire has transformed our recruitment strategy. The portal's advanced features streamline the entire hiring journey, providing us with a pool of qualified candidates. Their dedicated team understands the nuances of the hospitality industry, making them an invaluable partner in our quest for top-tier talent. Highly recommended for all HR needs!",
    rate: 4.5
  }
];

const Reviews = () => {
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
    <section id="reviews" className="py-16">
      <div className="container mx-auto">
        {/* Reviews Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h3" className="mb-4 text-deep-orange-400 ">
            Reviews
          </Typography>
          <Typography className="mb-4 pb-2">
            "Voices of Satisfaction: What Our Customers Are Saying."
          </Typography>
        </motion.div>

        {/* Carousel */}
        <div className="relative   border-none w-full max-w-4xl mx-auto overflow-hidden rounded-lg shadow-lg border border-gray-300">

<motion.div
    ref={carouselRef}
    animate={carouselAnimation}
    className="flex p-4 "
>
    {reviewsData.map((review, index) => (
        <motion.div
  key={index}
  className="w-full max-w-96 flex-shrink-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-lg p-4 mx-4" // Changed margin to auto for centering
  initial={{ opacity: 0, x: '100%' }}
  animate={{ opacity: 1, x: '0%' }}
  transition={{ duration: 0.5, delay: index * 0.2 }}
>
  <div className="text-center mb-5">
  <img
  src={review.image}
  className="rounded-full shadow-1-strong mx-auto max-w-full max-h-40 object-contain"
  alt={`Review ${index + 1}`}
/>
  </div>
  <Typography variant="h5" className="text-center text-white mb-3 ">
    {review.name}
  </Typography>
  <Typography variant="h6" className="text-center text-white  text-primary mb-2">
    {review.company}
  </Typography>
  {/* Inside the map function rendering reviews */}
  <div className="flex justify-center items-center mb-3">
    <span className="text-warning text-xl align-centre">{review.rate}/5</span>
<br/>
    <div className="flex items-center space-x-1">
  {[...Array(5)].map((_, i) => (
    <span key={i} className="text-3xl sm:text-4xl md:text-5xl lg:text-3xl">
      {i < Math.floor(review.rate) ? (
        <FaStar className="text-deep-orange-400" />
      ) : i < review.rate ? (
        <FaStarHalfAlt className="text-deep-orange-400" />
      ) : (
        <FaStar className="text-gray-300" />
      )}
    </span>
  ))}
</div>
  </div>
  <Typography variant="body1" className=" text-white  px-3">
    <i className="fas fa-quote-left pe-2"></i>{review.review}
  </Typography>
</motion.div>
    ))}
</motion.div>
</div>

      </div>
    </section>
  );
};

export default Reviews;
