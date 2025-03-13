"use client";
import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const ListContributions: React.FC = () => {
  const [ownerName, setOwnerName] = useState("");
  const [contributorName, setContributorName] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState("January");
  const [contributionType, setContributionType] = useState("");
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
      const response = await axios.get("https://mikados.onrender.com/mikados/levy-contributions", {
        params: { ownerName, contributorName, month, year, contributionType }
      });

      console.log("API Response:", response.data);

      if (response.data?.status === false) {
        setError(response.data.message);
      } else {
        setSuccessMessage(response.data.message || "Data fetched successfully!");

        if (Array.isArray(response.data.data) && response.data.data.length > 0) {
          setData(response.data.data);
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
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg"
      >
        <h1 className="text-xl font-bold text-center mb-4">Get Levy Contributions</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium">Owner Name</label>
            <input
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder="Enter owner name"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Contributor Name</label>
            <input
              type="text"
              value={contributorName}
              onChange={(e) => setContributorName(e.target.value)}
              placeholder="Enter contributor name"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Year</label>
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
            <label className="block text-sm font-medium">Month</label>
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
            <label className="block text-sm font-medium">Contribution Type</label>
            <input
              type="text"
              value={contributionType}
              onChange={(e) => setContributionType(e.target.value)}
              placeholder="Enter contribution type"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
            />
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}
          {successMessage && <p className="text-green-600 font-bold text-center">{successMessage}</p>}

          <button
            type="submit"
            className="w-full bg-blue-950 text-white py-2 rounded-lg font-semibold hover:opacity-80 transition"
            disabled={loading}
          >
            {loading ? "Fetching..." : "Search"}
          </button>
        </form>
      </motion.div>

      {data.length > 0 && (
        <div className="overflow-x-auto mt-5 p-2 w-full">
          <motion.table className="w-full min-w-max border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-100 text-sm md:text-base">
                <th className="border p-2">Owner</th>
                <th className="border p-2">Contributor</th>
                <th className="border p-2">Amount</th>
                <th className="border p-2">Month</th>
                <th className="border p-2">Year</th>
                <th className="border p-2">Type</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <motion.tr key={index} className="text-center bg-white hover:bg-gray-100 text-sm md:text-base">
                  <td className="border p-2">{item.ownerName}</td>
                  <td className="border p-2">{item.contributorName}</td>
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
