"use client"
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import logo from '@/public/assets/mikados.jpg'

const buttonVariants = {
  initial: { scale: 1, opacity: 1 },
  hover: { scale: 1.2, rotate: 5, boxShadow: "0px 10px 20px rgba(0,0,0,0.2)" },
  tap: { scale: 0.9, rotate: -5, boxShadow: "0px 5px 10px rgba(0,0,0,0.1)" },
};

const buttonLinks = [
  { text: "Member Registration", link: "/Register", excos: true },
  { text: "All Members", link: "/mikadosMembers", excos: false },
  { text: "Pay Monthly Dues", link: " /monthlyDues", excos: true },
  { text: "List Monthly Dues", link: "/getMonthlyDues", excos: false },
  { text: "Check Monthly Dues", link: "/checkmdues", excos: false },
  { text: "Levy Contributions", link: "/leviContribution", excos: true },
  { text: "List all Contributions", link: "/listContribution", excos: false },
];

const Home = () => {
  return (
    <div className="flex items-center justify-center bg-[#1D1D41] flex-col h-screen">
      <Image src={logo} alt="logo_img" className="h-32 mt-16 w-32 rounded-full"/>
      <h1 className="font-bold text-white text-center mt-6 text-3xl mb-4">Welcome To Mikados Official Site</h1>
      <p className="text-xl text-white mb-12 text-center mt-1 px-2 md:px-0">
        ST PETER CLAVER SEMINARY OKPALA (2014 SET)
      </p>
      <div className="">
        <div className="grid grid-cols-2 p-4 gap-6">
          {buttonLinks.map(({ text, link, excos }, index) => (
            <Link key={index} href={link}>
              <motion.button
                className={`cursor-pointer px-6 py-3 rounded-lg font-bold text-lg shadow-lg ${excos ? 'bg-[#CBC8FF] text-red-500' : 'bg-[#CBC8FF]'}`}
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
              >
                {text}
              </motion.button>
            </Link>
          ))}
        </div>
      </div>
      <p className="mt-8 mb-6 text-gray-300 text-center">
        For Mikados || @ All Right Reserved 2025
      </p>
    </div>
  );
};

export default Home;