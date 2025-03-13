"use client";
import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import PinField from "react-pin-field";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const contributionTypes = ["wedding", "burial", "ordination"];

const LevyContribution: React.FC = () => {
  const [ownerName, setOwnerName] = useState("");
  const [contributorName, setContributorName] = useState("");
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState("January");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [otp, setOtp] = useState("");
  const [contributionType, setContributionType] = useState("wedding");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
      const response = await axios.post("https://mikados.onrender.com/mikados/levy-contributions/pay", {
        ownerName,
        contributorName,
        amount: Number(amount),
        month,
        year,
        otp: Number(otp),
        contributionType
      });

      console.log("API Response:", response.data);

      if (response.data?.status === false && response.data?.message.toLowerCase().includes("invalid otp")) {
        setError("Invalid OTP. Please try again.");
      } else {
        setSuccessMessage("Contribution was successful!");
      }
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.response?.data?.message || "Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg"
      >
        <h1 className="text-xl font-bold text-center mb-4">Levy Contribution</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-2">Owner Name</label>
            <input
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder="Enter owner name"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Contributor Name</label>
            <input
              type="text"
              value={contributorName}
              onChange={(e) => setContributorName(e.target.value)}
              placeholder="Enter contributor name"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font- mb-2">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Month</label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
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
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Contribution Type</label>
            <select
              value={contributionType}
              onChange={(e) => setContributionType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
              required
            >
              {contributionTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className=" text-sm text-center flex justify-center mx-auto mb-2 font-medium">OTP</label>
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
            className="w-full bg-blue-950 text-white py-2 rounded-lg font-semibold hover:opacity-80 transition"
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
