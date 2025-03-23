"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/ui/Table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GridLoader } from "react-spinners";

interface Member {
  _id: string;
  regNumber: number;
  fullName: string;
  fee: number;
  createdAt: string;
}

const MikadosMembers = () => {
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<"fullName" | "createdAt">("fullName");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true); // Set loading to true before fetching
  
        const response = await axios.get<{ data: Member[] }>(
          "https://mikados-api.onrender.com/mikados/all"
        );
  
        if (Array.isArray(response.data.data)) {
          setMembers(response.data.data);
          setFilteredMembers(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setLoading(false); // Ensure loading is set to false after fetching (success or failure)
      }
    };
  
    fetchMembers();
  }, []);
  
  useEffect(() => {
    const filtered = members.filter((member) =>
      member.fullName.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredMembers(filtered);
    setCurrentPage(1);
  }, [search, members]);

  const sortData = (key: "fullName" | "createdAt") => {
    const order = sortKey === key && sortOrder === "asc" ? "desc" : "asc";
    setSortKey(key);
    setSortOrder(order);

    const sorted = [...filteredMembers].sort((a, b) => {
      if (key === "createdAt") {
        return order === "asc"
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return a[key].localeCompare(b[key]) * (order === "asc" ? 1 : -1);
    });

    setFilteredMembers(sorted);
  };

  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <motion.div
      className="p-2.5 text-white bg-[#141332] max-w-5xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-3xl font-bold mt-4 text-center mb-6 text-white">
        Mikados Members
      </h1>
      
      {/* Search Bar */}
      <div className="mb-4 flex justify-center">
        <Input
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md shadow-md"
        />
      </div>

      {/* Responsive Table */}

      {loading ? (
     <div className=" flex items-center justify-center mt-3">
      {/* <GridLoader className="text-green-500" /> */} <p className="text-green-500 font-semibold">Loading...</p>
     </div>
      ) :(

        <div className="overflow-x-auto shadow-lg rounded-lg">
        <motion.table 
          className="min-w-full bg-[#1D1D41] rounded-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
       <Thead>
  <Tr>

  <Th><div className="py-2 ">ID</div></Th>
    <Th>
      <span
        className="cursor-pointer flex items-center"
        onClick={() => sortData("fullName")}
      >
        Name {sortKey === "fullName" && (sortOrder === "asc" ? "↑" : "↓")}
      </span>
    </Th>
    <Th>
      <span
        className="cursor-pointer flex items-center"
        onClick={() => sortData("createdAt")}
      >
        Joined Date {sortKey === "createdAt" && (sortOrder === "asc" ? "↑" : "↓")}
      </span>
    </Th>
   
    <Th><div className="py-2 px-">Fee</div></Th>
  </Tr>
</Thead>
<Tbody>
  {paginatedMembers.map((member, index) => (
    <motion.tr
      key={member._id}
      className="hover:bg-[#141332] transition-all border-b"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
       <Td><div className="py-2 px-">{member.regNumber}</div></Td>
      <Td><div className="py-2 px-">{member.fullName}</div></Td>
      <Td><div className="py-2 px-">{new Date(member.createdAt).toLocaleDateString()}</div></Td>
     
      <Td><div className="py-2 px- text-green-600 font-semibold">₦{member.fee}</div></Td>
    </motion.tr>
  ))}
</Tbody>

        </motion.table>
      </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="px-4 py-2 rounded-lg flex items-center"
        >
          <ChevronLeft /> Prev
        </Button>
        <span className="text-[#CBC8FF] font-semibold">
          Page {currentPage} of {Math.ceil(filteredMembers.length / itemsPerPage)}
        </span>
        <Button
          disabled={currentPage === Math.ceil(filteredMembers.length / itemsPerPage)}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-4 py-2 rounded-lg flex items-center"
        >
          Next <ChevronRight />
        </Button>
      </div>
    </motion.div>
  );
};

export default MikadosMembers;
