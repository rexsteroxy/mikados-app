"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

interface DuesData {
  fullName: string;
  regNumber: string;
  year: string;
  paidMonths: string[];
  unpaidMonths: string[];
}

const CheckDues = () => {
  const [dues, setDues] = useState<DuesData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [regNumber, setRegNumber] = useState<string>("");
  const [year, setYear] = useState<string>("");

  const fetchDues = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setDues(null);
    try {
      const response = await axios.get(
        `https://mikados-api.onrender.com/mikados/check-monthly-dues?year=${year}&regNumber=${regNumber}`
      );
      const data = response.data.data;
      if (!data.paidMonths.length && !data.unpaidMonths.length) {
        setError("No data found");
      } else {
        setDues(data);
      }
    } catch (err) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-[#141332] p-4">

        <div className="w-full max-w-md bg-[#1D1D41] text-white p-6 rounded-lg shadow-lg">
        <form onSubmit={fetchDues} className="space-y-4">
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Registration Number</label>
          <input
            type="number"
            value={regNumber}
            onChange={(e) => setRegNumber(e.target.value)}
           className="w-full p-2 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
            placeholder="Enter registration number"
            required
          />
        </div>
        <div className="mb-4">
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
        <button
          type="submit"
          className="w-full mt-6 cursor-pointer bg-[#CBC8FF]  text-black py-3 rounded-lg font-semibold hover:opacity-80 transition"
        >
          Check Dues
        </button>
      </form>
        </div>
    
      {loading && <p className="  my-4 text-2xl font-semibold text-green-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {dues && (
        <motion.div 
          className="bg-[#1D1D41] w-full mt-6 p-6 rounded-lg shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl text-white font-bold mb-4">{dues.fullName} (Reg: {dues.regNumber}) - {dues.year}</h1>
          <table className="w-full border border-gray-600 mt-4">
            <thead>
              <tr className="bg-gray-700 text-white">
                <th className="border p-2">Paid Months</th>
                <th className="border p-2">Unpaid Months</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: Math.max(dues.paidMonths.length, dues.unpaidMonths.length) }).map((_, index) => (
                <tr key={index} className="text-center border hover:bg-gray-700">
                  <td className="border p-2 text-green-500">{dues.paidMonths[index] || ""}</td>
                  <td className="border p-2 text-red-500">{dues.unpaidMonths[index] || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  );
};

export default CheckDues;
