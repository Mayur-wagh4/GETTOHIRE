import { EnvelopeIcon, PencilIcon, PhoneIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { Button, Card, Input, Typography } from "@material-tailwind/react";
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { ContactImage } from "../../assets/assets";

const Contact = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        emailAddress: '',
        phoneNumber: '',
        subject: '',
        userMessage: ''
    });
    const [isInView, setIsInView] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(formData);
        setFormData({
            fullName: '',
            emailAddress: '',
            phoneNumber: '',
            subject: '',
            userMessage: ''
        });
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    useEffect(() => {
        const checkInView = () => {
            const contactSection = document.getElementById('contact-us');
            const rect = contactSection.getBoundingClientRect();
            setIsInView(rect.top <= window.innerHeight && rect.bottom >= 0);
        };

        const handleScroll = () => {
            checkInView();
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return  (
        <section id="contact-us" className="contact-area mx-auto py-16   px-4 md:px-0">
            <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-lg backdrop-blur-sm bg-opacity-90 border-b border-orange-500/20 w-full mx-auto mt-20 rounded-2xl sm:rounded-tl-[35%] sm:rounded-tr-[5%] sm:rounded-bl-[5%] sm:rounded-br-[50%]">

                    <motion.div
                        className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6"
                        initial={{ opacity: 0, rotateY: -90 }}
                        animate={isInView ? { opacity: 1, rotateY: 0 } : {}}
                        transition={{ duration: 1 }}
                    >
                        <div>
                            <Typography variant="h4"  className="mb-4 text-deep-orange-400 text-center">
                                Contact Us
                            </Typography>
                            <Typography color="white"  className="mb-6 text-center font-normal">
                                Nice to meet you! Enter your details to register.
                            </Typography>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="relative">
                                    <Input
                                        size="lg"
                                        placeholder="Your Name"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        icon={<UserCircleIcon className="h-6 w-6 text-deep-orange-400 absolute left-1 top-1/2 transform -translate-y-1/2" />}
                                        className={formData.fullName ? 'hover:shadow-md' : 'border-red-500 hover:shadow-md'}
                                    />
                                </div>
                                <div className="relative">
                                    <Input
                                        size="lg"
                                        type="email"
                                        placeholder="Your Email"
                                        name="emailAddress"
                                        value={formData.emailAddress}
                                        onChange={handleInputChange}
                                        icon={<EnvelopeIcon className="h-6 w-6 text-deep-orange-400 absolute left-1 top-1/2 transform -translate-y-1/2" />}
                                        className={formData.emailAddress ? 'hover:shadow-md' : 'border-red-500 hover:shadow-md'}
                                    />
                                </div>
                                <div className="relative">
                                    <Input
                                        size="lg"
                                        placeholder="Phone Number"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        icon={<PhoneIcon className="h-6 w-6 text-deep-orange-400 absolute left-1 top-1/2 transform -translate-y-1/2" />}
                                        className={formData.phoneNumber ? 'hover:shadow-md' : 'border-red-500 hover:shadow-md'}
                                    />
                                </div>
                                <div className="relative">
                                    <Input
                                        size="lg"
                                        placeholder="Subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        icon={<PencilIcon className="h-6 w-6 text-deep-orange-400 absolute left-1 top-1/2 transform -translate-y-1/2" />}
                                        className="hover:shadow-md"
                                    />
                                </div>
                                <div className="relative">
                                    <Input
                                        size="lg"
                                        type="textarea"
                                        placeholder="Your Message"
                                        name="userMessage"
                                        value={formData.userMessage}
                                        onChange={handleInputChange}
                                        icon={<PencilIcon className="h-6 w-6  text-deep-orange-400 absolute left-1 top-1/2 transform -translate-y-1/2" />}
                                        className="hover:shadow-md"
                                    />
                                </div>
                                <div className="flex justify-center">
                                    <Button type="submit"  size="lg" className="bg-gray-900 shadow-lg backdrop-blur-sm bg-opacity-90 border-b border-orange-500/20 text-deep-orange-400" ripple={true}>
                                        Send Message
                                    </Button>
                                </div>
                            </form>
                        </div>
                        <div className="hidden md:block">
                            <img
                                src={ContactImage}
                                alt="Man holding form"
                                className="h-[45vh] object-cover  rounded-2xl sm:rounded-tl-[35%] sm:rounded-tr-[5%] sm:rounded-bl-[5%] sm:rounded-br-[50%]  w-full"
                            />
                        </div>
                    </motion.div>
                </Card>
            </div>
        </section>
    );
};



export default Contact;