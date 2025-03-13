"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/ui/Table";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Member {
  fullName: string;
  createdAt: string;
}

const MikadosMembers = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<"fullName" | "createdAt">("fullName");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 14;

  useEffect(() => {
    axios
      .get("https://mikados.onrender.com/mikados/all")
      .then((response) => {
        console.log("API Response:", response.data);
        if (Array.isArray(response.data.data)) {
          setMembers(response.data.data);
          setFilteredMembers(response.data.data);
        } else {
          console.error("Unexpected response format", response.data);
        }
      })
      .catch((error) => console.error("Error fetching members:", error));
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
      if (a[key] < b[key]) return order === "asc" ? -1 : 1;
      if (a[key] > b[key]) return order === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredMembers(sorted);
  };

  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <motion.div
      className="p-6 max-w-4xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-2xl font-bold text-center mb-4">Mikados Members</h1>
      <Input
        placeholder="Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4"
      />
      <Table>
        <Thead>
          <Tr>
            <Th>
              <span
                className="cursor-pointer"
                onClick={() => sortData("fullName")}
              >
                NAME{" "}
                {sortKey === "fullName" && (sortOrder === "asc" ? "↑" : "↓")}
              </span>
            </Th>
            <Th>
              <span
                className="cursor-pointer"
                onClick={() => sortData("createdAt")}
              >
                JOINED DATE{" "}
                {sortKey === "createdAt" && (sortOrder === "asc" ? "↑" : "↓")}
              </span>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {paginatedMembers.map((member, index) => (
            <Tr key={index}>
              <Td>{member.fullName}</Td>
              <Td>{new Date(member.createdAt).toLocaleDateString()}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <div className="flex justify-between items-center mt-4">
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          <ChevronLeft />
        </Button>
        <span>
          Page {currentPage} of{" "}
          {Math.ceil(filteredMembers.length / itemsPerPage)}
        </span>
        <Button
          disabled={
            currentPage === Math.ceil(filteredMembers.length / itemsPerPage)
          }
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          <ChevronRight />
        </Button>
      </div>
    </motion.div>
  );
};

export default MikadosMembers;
