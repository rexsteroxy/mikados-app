"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import PinField from "react-pin-field";

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [fee, setFee] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        router.push("/"); // Navigate to /about
      }, 2000);
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
        "https://mikados.onrender.com/mikados/register",
        {
          fullName: username,
          fee: Number(fee),
          otp: Number(otp),
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
  
      // Check if response contains "Invalid OTP"
      if (response.data?.message.toLowerCase().includes("invalid otp")) {
        setError("Invalid OTP. Please try again.");
        setLoading(false); // Stop loading since it's an error
        return;
      }
  
      if (response.status === 200) {
        setSuccessMessage("Registration successful!");
      } else {
        setError("Unexpected response from server");
      }
    } catch (err: any) {
      console.error("Error:", err);
  
      if (err.response) {
        // Ensure error message is correctly extracted
        setError(err.response.data?.message || "Something went wrong");
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
        <h1 className="font-bold text-center text-2xl md:text-4xl mb-4">Welcome Back!</h1>
        <p className="text-lg md:text-xl text-center">ST PETER CLAVER SEMINARY OKPALA</p>

        <form className="space-y-6 mt-7" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm mb-2 font-medium">Username</label>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-2 font-medium">Fee</label>
            <input
              type="number"
              placeholder="Enter fee amount"
              value={fee}
              onChange={(e) => setFee(e.target.value)}
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
            {loading ? "Processing..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-gray-500 text-center text-sm">For Mikados students only || @ All Right Reserved</p>
      </div>
    </div>
  );
};

export default Register;
