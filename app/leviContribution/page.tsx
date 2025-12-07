"use client";
import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import PinField from "react-pin-field";
import { useRouter } from "next/navigation"; 
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const contributionTypes = ["wedding", "burial", "ordination", "anniversary"];

const LevyContribution: React.FC = () => {
  const [ownerRegNumber, setOwnerRegNumber] = useState("");
  const [contributorRegNumber, setContributorRegNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState("January");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [otp, setOtp] = useState("");
  const [contributionType, setContributionType] = useState("wedding");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter(); // ✅ Initialize router
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
  
    if (otp.length !== 5) {
      setError("OTP must be 5 digits.");
      setLoading(false);
      return;
    }
  
    try {
      const response = await axios.post("https://mikados-api.onrender.com/mikados/levy-contributions/pay", {
        ownerRegNumber: Number(ownerRegNumber),
        contributorRegNumber: Number(contributorRegNumber),
        amount: Number(amount),
        month,
        year,
        otp: Number(otp),
        contributionType
      });
  
      console.log("API Response:", response.data);
  
      if (response.data?.status === true) {
        setSuccessMessage(response.data.message || "Contribution was successful!");

         // ✅ Redirect to "/about" after 2 seconds
         setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        setError(response.data.message || "An unexpected error occurred.");
      }
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.response?.data?.message || "Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#141332] p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#1D1D41] text-white p-6 rounded-lg shadow-lg"
      >
        <h1 className="text-3xl mb-8 font-bold text-center ">Levy Contribution</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-2">Owner Reg Number</label>
            <input
              type="number"
              value={ownerRegNumber}
              onChange={(e) => setOwnerRegNumber(e.target.value)}
              placeholder="Enter owner reg number"
              className="w-full p-2 border placeholder:text-gray-400 border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Contributor Reg Number</label>
            <input
              type="number"
              value={contributorRegNumber}
              onChange={(e) => setContributorRegNumber(e.target.value)}
              placeholder="Enter contributor reg number"
              className="w-full p-2 border placeholder:text-gray-400 border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full p-2 border placeholder:text-gray-400 border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Month</label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full p-2 text-gray-400 border placeholder:text-gray-400 border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
              required
            >
              {months.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Year</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Enter year"
              className="w-full p-2 border placeholder:text-gray-400 border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Contribution Type</label>
            <select
              value={contributionType}
              onChange={(e) => setContributionType(e.target.value)}
              className="w-full text-gray-400 p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
              required
            >
              {contributionTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-center flex justify-center mx-auto mb-2 font-medium">OTP</label>
            <div className="flex justify-center gap-4">
              <PinField
                length={5}
                type="text"
                className="w-10 h-10 border border-gray-300 text-center text-lg rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                onChange={setOtp}
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}
          {successMessage && <p className="text-green-600 font-bold text-center">{successMessage}</p>}

          <button
            type="submit"
            className="w-full bg-[#CBC8FF] text-black py-3 rounded-lg font-semibold hover:opacity-80 transition"
            disabled={loading}
          >
            {loading ? "Processing..." : "Submit Contribution"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default LevyContribution;
