"use client";
import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const GetMonthlyDues: React.FC = () => {
  const [regNumber, setRegNumber] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState("January");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [data, setData] = useState<any[]>([]);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    setData([]);

    try {
      const response = await axios.get("https://mikados-api.onrender.com/mikados/monthly-dues", {
        params: { regNumber, month, year }
      });

      console.log("API Response:", response.data); // Debugging

      if (response.data?.status === false) {
        setError(response.data.message);
      } else {
        setSuccessMessage(response.data.message || "Data fetched successfully!");

        // Ensure the data is filtered to match the selected month and year
        if (Array.isArray(response.data.data) && response.data.data.length > 0) {
          const filteredData = response.data.data.filter(
            (item: { month: string; year: string; }) => item.month === month && item.year === year
          );
          setData(filteredData);
        }
      }
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-[#141332] p-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#1D1D41] text-white p-6 rounded-lg shadow-lg"
      >
        <h1 className="text-xl font-bold text-center mb-4">List Monthly Dues</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-2 text-sm font-medium">Registration Number</label>
            <input
              type="text"
              value={regNumber}
              onChange={(e) => setRegNumber(e.target.value)}
              placeholder="Enter registration number"
              className="w-full p-2 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
              
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Year</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Enter year"
              className="w-full p-2 border  border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Month</label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full p-2 border text-gray-400 border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
              required
            >
              {months.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}
          {successMessage && <p className="text-green-600 font-bold text-center">{successMessage}</p>}

          <button
            type="submit"
            className="w-full cursor-pointer bg-[#CBC8FF]  text-black py-3 rounded-lg font-semibold hover:opacity-80 transition"
            disabled={loading}
          >
            {loading ? "Checking..." : "Check Dues"}
          </button>
        </form>
      </motion.div>

      {data.length > 0 ? (
        <div className="overflow-x-auto mt-5 p-2 w-full">
          <motion.table
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full min-w-max border-collapse border border-gray-300"
          >
            <thead>
              <tr className="bg-[#1D1D41] text-white text-sm md:text-base">
                <th className="border border-white p-2 whitespace-nowrap">Reg Number</th>
                <th className="border border-white p-2 whitespace-nowrap">Amount</th>
                <th className="border border-white p-2 whitespace-nowrap">Month</th>
                <th className="border border-white p-2 whitespace-nowrap">Year</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center bg-gray-300 text-sm md:text-base"
                >
                  <td className="border border-white p-2 whitespace-nowrap">{item.regNumber}</td>
                  <td className="border border-white p-2 whitespace-nowrap">₦{item.amount}</td>
                  <td className="border border-white p-2 whitespace-nowrap">{item.month}</td>
                  <td className="border border-white p-2 whitespace-nowrap">{item.year}</td>
                </motion.tr>
              ))}
            </tbody>
          </motion.table>
        </div>
      ) : (
        successMessage && successMessage !== "Data fetched successfully!" && (
          <p className="text-center text-gray-600 mt-4">No record yet!</p>
        )
      )}
    </div>
  );
};

export default GetMonthlyDues;
