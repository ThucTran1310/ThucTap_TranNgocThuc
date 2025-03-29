import React from "react";

export const Table = ({ children }) => (
    <table className="w-full border-collapse border border-gray-300">{children}</table>
);

export const TableHead = ({ children }) => (
    <thead className="bg-gray-200 font-bold">{children}</thead>
);

export const TableRow = ({ children }) => <tr className="border-b">{children}</tr>;

export const TableCell = ({ children }) => <td className="p-2 border">{children}</td>;

export const TableBody = ({ children }) => <tbody>{children}</tbody>;

export default Table;
