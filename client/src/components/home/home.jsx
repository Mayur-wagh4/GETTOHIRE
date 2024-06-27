import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import Footer from '../common/footer';
import ComplexNavbar from '../common/navbar';
import About from './about';
import Carouselmain from './carsoul';
import Contact from './contact';
import Feature from './features';
import PricingSection from './pricing';
import Review from './reviews';

function Home() {
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const horizontalScrollContainerStyle = {
    display: 'flex',
    overflowX: 'auto',
    scrollBehavior: 'smooth',
    overflowY: 'hidden',
    maxheight:'auto',
    perspective: '1000px',
    height: '100%',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    '&::-webkit-scrollbar': {
      display: 'none'
    },
  };
  
  const horizontalScrollItemStyle = {
    display: 'inline-block',
    width: '100%',
    height: '100%',
    flexShrink: 0,
    whiteSpace: 'normal',
    transformStyle: 'preserve-3d',
    
  };

  const variants = {
    initial: { rotateY: -10, opacity: 0 },
    enter: { rotateY: 0, opacity: 1 },
    exit: { rotateY: 10, opacity: 0 },
  };

  const ScrollItem = ({ children }) => (
    <motion.div
      style={horizontalScrollItemStyle}
      initial="initial"
      animate="enter"
      exit="exit"
      variants={variants}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );

  const largeScreenLayout = (
    <div style={horizontalScrollContainerStyle}>
      <ScrollItem><Carouselmain /></ScrollItem>
      <ScrollItem><About /></ScrollItem>
      <ScrollItem><Feature /></ScrollItem>
      <ScrollItem><Review /></ScrollItem>
      <ScrollItem><Contact /></ScrollItem>
      <ScrollItem><PricingSection /></ScrollItem>

    </div>
  );

  const smallScreenLayout = (
    <div className="flex flex-col h-full overflow-y-auto">
      <Carouselmain />
      <About />
      <Feature />
      <Review />
      <Contact />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <ComplexNavbar />
      <main className="flex-1 flex flex-col">
        {isLargeScreen ? largeScreenLayout : smallScreenLayout}
      </main>
      <Footer />
    </div>
  );
}

export default Home;