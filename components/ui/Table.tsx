import * as React from "react";

export const Table = ({ children }: { children: React.ReactNode }) => {
  return <table className="w-full border-collapse">{children}</table>;
};

export const Thead = ({ children }: { children: React.ReactNode }) => {
  return <thead className="bg-[#1D1D41]">{children}</thead>;
};

export const Tbody = ({ children }: { children: React.ReactNode }) => {
  return <tbody>{children}</tbody>;
};

export const Tr = ({ children }: { children: React.ReactNode }) => {
  return <tr className="border-b">{children}</tr>;
};

export const Th = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <th className={`p-2 text-left cursor-pointer ${className}`}>{children}</th>;
};

export const Td = ({ children }: { children: React.ReactNode }) => {
  return <td className="p-2">{children}</td>;
};
