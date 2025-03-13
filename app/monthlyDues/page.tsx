"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import PinField from "react-pin-field";

const Monthly: React.FC = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState<string>("");
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
        "https://mikados.onrender.com/mikados/monthly-dues/pay",
        {
          fullName,
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
  
      // Check if the response contains an invalid OTP message
      if (response.data?.message === "Invalid OTP") {
        throw new Error("Invalid OTP. Please try again.");
      }
  
      if (response.status === 200) {
        setSuccessMessage("Payment successful!");
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (err: any) {
      console.error("Error:", err);
  
      if (err.response) {
        if (err.response.status === 400 && err.response.data?.message === "Invalid OTP") {
          setError("Invalid OTP. Please try again.");
        } else {
          setError(err.response.data?.message || "Something went wrong");
        }
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-white px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h1 className="font-bold text-center text-2xl md:text-4xl mb-4">Monthly Dues</h1>
        <p className="text-lg md:text-xl text-center">ST PETER CLAVER SEMINARY OKPALA</p>

        <form className="space-y-6 mt-7" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm mb-2 font-medium">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-2 font-medium">Month</label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
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
            className="w-full bg-blue-950 text-white py-3 rounded-lg font-semibold hover:opacity-80 transition"
            disabled={loading || otp.length !== 5}
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </form>

        <p className="mt-4 text-gray-500 text-center text-sm">For Mikados students only || @ All Right Reserved</p>
      </div>
    </div>
  );
};

export default Monthly;
