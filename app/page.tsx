"use client"
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const buttonVariants = {
  initial: { scale: 1, opacity: 1 },
  hover: { scale: 1.2, rotate: 5, boxShadow: "0px 10px 20px rgba(0,0,0,0.2)" },
  tap: { scale: 0.9, rotate: -5, boxShadow: "0px 5px 10px rgba(0,0,0,0.1)" },
};

const buttonLinks = [
  { text: "Member Registration", link: "/Register" },
  { text: " All Members", link: "/mikadosMembers" },
  { text: "Pay Monthly Dues", link: "/monthlyDues" },
  { text: "List Monthly Dues", link: "/getMonthlyDues" },
  { text: "Levy Contributions", link: "/leviContribution" },
  { text: "List all Contributions" , link: "/listContribution" },
];

const Home = () => {
  return (
    <div className="flex items-center justify-center flex-col h-screen">
      {/* <h1  className="font-bold text-center mt-6 text-2xl mb-4">Welcome To Mikados Official Site</h1> */}
      <p className="text-xl mb-12 text-center mt-1 px-2 md:px-0">
        ST PETER CLAVER SEMINARY OKPALA
      </p>
      <div className="">
        <div className="grid grid-cols-2 p-4 gap-6">
          {buttonLinks.map(({ text, link }, index) => (
            <Link key={index} href={link}>
              <motion.button
                className="bg-blue-900 cursor-pointer text-white px-6 py-3 rounded-lg font-bold text-lg shadow-lg"
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
      <p className="mt-16 text-gray-500 text-center">
        For Mikados || @ All Right Reserved 2025
      </p>
    </div>
  );
};

export default Home;
