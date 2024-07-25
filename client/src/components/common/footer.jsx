import { Typography } from "@material-tailwind/react";
import React from "react";
import { FaEnvelope, FaInstagram, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { LogoNewImage } from "../../assets/assets";

const QUICK_LINKS = [
  { title: "Jobs", to: "/jobs" },
  { title: "Candidate Login", to: "/candidate-login" },
  { title: "Restaurant Login", to: "/restaurant-login" },

];

const socialLinks = [
  {
    name: "Instagram",
    icon: FaInstagram,
    url: "https://www.instagram.com/get_to_hire/?igshid=YTQwZjQ0NmI0OA%3D%3D&utm_source=qr",
  },
];

const TERMS_AND_CONDITIONS = [
  { title: "Terms and Conditions", to: "/terms" },
  { title: "Privacy Policy", to: "/privacy" },
  { title: "Refund Policy", to: "/refund" },
];

const currentYear = new Date().getFullYear();

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-indigo-600/20 to-blue-600/20 animate-gradient-x"></div>
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo */}
          <div className="flex justify-center lg:justify-start">
            <img
              className="h-20 w-auto transition-transform duration-300 hover:scale-105"
              src={LogoNewImage}
              alt="Logo"
            />
          </div>

          {/* Quick Links */}
          <FooterSection title="Quick Links" items={QUICK_LINKS} />

          {/* Contact Information */}
          <div className="flex flex-col items-center text-center lg:items-center lg:text-center">
          <Typography
              variant="h6"
              className="font-bold mb-4 text-deep-orange-400"
            >
      Contact Information
    </Typography>
    <div className="flex flex-col items-start text-left space-y-4">
      <ContactItem
        icon={FaMapMarkerAlt}
        href="https://www.google.com/maps/place/Pune,+Maharashtra,+India"
        text="Pune, Maharashtra"
      />
      <ContactItem
        icon={FaEnvelope}
        href="mailto:gettohire99@gmail.com"
        text="gettohire99@gmail.com "
      />
    </div>
  </div>

          {/* Usage Policy */}
          <FooterSection title="Usage Policy" items={TERMS_AND_CONDITIONS} />
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-gray-900/50 backdrop-blur-sm py-4">
        <div className="container mx-auto text-center">
          <Typography
            variant="h6"
            className="font-bold mb-2 text-deep-orange-400"
          >
            Follow Us
          </Typography>
          <div className="flex justify-center space-x-4">
            {socialLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl hover:text-deep-orange-500 transition-colors duration-300"
              >
                <link.icon />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-gray-900/80 backdrop-blur-sm py-4">
        <div className="container mx-auto text-center">
          <Typography variant="small" className="text-deep-orange-400">
            &copy; {currentYear} Get To Hire. All Rights Reserved.
          </Typography>
        </div>
      </div>
    </footer>
  );
};

const FooterSection = ({ title, items }) => (
  <div className="hidden md:block text-center lg:text-left">
    <Typography variant="h6" className="font-bold mb-4 text-deep-orange-400">
      {title}
    </Typography>
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index}>
          <Link
            to={item.to}
            className="hover:text-deep-orange-500 transition-colors duration-300 text-sm lg:text-base"
          >
            {item.title}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const ContactItem = ({ icon: Icon, href, text }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center hover:text-deep-orange-500 transition-colors duration-300 text-sm lg:text-base"
  >
    <Icon className="mr-2" />
    <span>{text}</span>
  </a>
);

export default Footer;
