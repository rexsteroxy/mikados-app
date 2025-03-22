"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import PinField from "react-pin-field";

const Monthly: React.FC = () => {
  const router = useRouter();
  const [regNumber, setRegNumber] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        router.push("/");
      }, 2000); // Redirect after 2 seconds
      return () => clearTimeout(timer);
    }
  }, [successMessage, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
  
    try {
      const response = await axios.post(
        "https://mikados-api.onrender.com/mikados/monthly-dues/pay",
        {
          regNumber: Number(regNumber),
          month,
          year,
          otp: Number(otp),
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.status === 200 && response.data.status === true) {
        setSuccessMessage(response.data.message || "Payment successful!");
      } else {
        setError(response.data.message || "Unexpected response from server");
      }
  
    } catch (err: any) {
      console.error("Error:", err);
  
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const errorMessage = err.response.data?.message || "Something went wrong";
  
          if (errorMessage.includes("Duplicate payment detected")) {
            setError("Monthly dues already paid for this period.");
          } else {
            setError(errorMessage);
          }
        } else if (err.request) {
          setError("No response from server. Please check your network.");
        } else {
          setError("Request setup failed. Please try again.");
        }
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#141332] px-4">
      <div className="w-full max-w-md bg-[#1D1D41] text-white p-6 rounded-lg shadow-lg">
        <h1 className="font-bold text-center text-2xl md:text-4xl mb-4">Monthly Dues</h1>
        <p className="text-lg md:text-xl text-center">ST PETER CLAVER SEMINARY OKPALA</p>

        <form className="space-y-6 mt-7" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm mb-2 font-medium">Reg Number</label>
            <input
              type="number"
              placeholder="Enter your Reg Number"
              value={regNumber}
              onChange={(e) => setRegNumber(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 placeholder:text-gray-400 focus:ring-blue-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-2 font-medium">Month</label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full p-3 text-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            >
              <option value="">Select Month</option>
              {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-2 font-medium">Year</label>
            <input
              type="number"
              placeholder="Enter year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-2 font-medium">Enter OTP</label>
            <div className="flex justify-center gap-2">
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
            disabled={loading || otp.length !== 5}
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </form>

        <p className="mt-4 text-[#CBC8FF] text-center text-sm">For Mikados students only || @ All Right Reserved</p>
      </div>
    </div>
  );
};

export default Monthly;
