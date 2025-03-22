"use client";
import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const contributionTypes = ["wedding", "burial", "ordination", "others"];

const ListContributions: React.FC = () => {
  const [ownerRegNumber, setOwnerRegNumber] = useState("");
  const [contributorRegNumber, setContributorRegNumber] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState("January");
  const [contributionType, setContributionType] = useState("wedding");
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
      const response = await axios.get("https://mikados-api.onrender.com/mikados/levy-contributions", {
        params: { ownerRegNumber, contributorRegNumber, year, month, contributionType }
      });

      console.log("API Response:", response.data);

      if (!response.data?.status || !response.data.data) {
        setError(response.data.message || "No contributions found.");
      } else {
        setSuccessMessage(response.data.message || "Contributions fetched successfully!");
        setData(response.data.data);
      }
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.message || "Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#141332] p-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg mt-12 bg-[#1D1D41] text-white p-6 rounded-lg shadow-lg"
      >
        <h1 className="text-2xl font-bold text-center mb-8">Get Levy Contributions</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-2 text-sm font-medium">Owner Reg Number</label>
            <input
              type="text"
              value={ownerRegNumber}
              onChange={(e) => setOwnerRegNumber(e.target.value)}
              placeholder="Enter owner registration number"
              className="w-full p-2 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 font-medium">Contributor Reg Number</label>
            <input
              type="text"
              value={contributorRegNumber}
              onChange={(e) => setContributorRegNumber(e.target.value)}
              placeholder="Enter contributor registration number"
              className="w-full p-2 border placeholder:text-gray-400 border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 font-medium">Year</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Enter year"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
            
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Month</label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full p-2 border text-gray-400 border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
              
            >
              {months.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Contribution Type</label>
            <select
              value={contributionType}
              onChange={(e) => setContributionType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
            >
              {contributionTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}
          {successMessage && <p className="text-green-600 font-bold text-center">{successMessage}</p>}

          <button
            type="submit"
            className="w-full bg-[#CBC8FF] mt-2 text-black py-3 rounded-lg font-semibold hover:opacity-80 transition"
            disabled={loading}
          >
            {loading ? "Fetching..." : "Get Contribution"}
          </button>
        </form>
      </motion.div>

      {data.length > 0 && (
        <div className="overflow-x-auto mt-5 w-full max-w-5xl">
          <motion.table 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="w-full border-collapse border border-gray-300"
          >
            <thead className="bg-[#1D1D41] text-white text-sm md:text-base">
              <tr>
                <th className="border p-2">Owner</th>
                <th className="border p-2">Owner Reg No.</th>
                <th className="border p-2">Contributor</th>
                <th className="border p-2">Contributor Reg No.</th>
                <th className="border p-2">Amount</th>
                <th className="border p-2">Month</th>
                <th className="border p-2">Year</th>
                <th className="border p-2">Contribution Type</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <motion.tr 
                  key={index} 
                  className="text-center bg-white hover:bg-gray-100 text-sm md:text-base"
                >
                  <td className="border p-2">{item.ownerName}</td>
                  <td className="border p-2">{item.ownerRegNumber}</td>
                  <td className="border p-2">{item.contributorName}</td>
                  <td className="border p-2">{item.contributorRegNumber}</td>
                  <td className="border p-2">₦{item.amount}</td>
                  <td className="border p-2">{item.month}</td>
                  <td className="border p-2">{item.year}</td>
                  <td className="border p-2">{item.contributionType}</td>
                </motion.tr>
              ))}
            </tbody>
          </motion.table>
        </div>
      )}
    </div>
  );
};

export default ListContributions;
