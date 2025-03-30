import React, { useContext, createContext } from "react";

const TableContext = createContext({ isHead: false });

// Table
export const Table = ({ children, className = "", style = {} }) => (
    <table className={`w-full border-collapse border border-gray-300 ${className}`} style={style}>
        {children}
    </table>
);

// TableHead
export const TableHead = ({ children, className = "", style = {} }) => (
    <TableContext.Provider value={{ isHead: true }}>
        <thead className={className} style={style}>
            {children}
        </thead>
    </TableContext.Provider>
);

// TableBody
export const TableBody = ({ children, className = "", style = {} }) => (
    <TableContext.Provider value={{ isHead: false }}>
        <tbody className={className} style={style}>
            {children}
        </tbody>
    </TableContext.Provider>
);

// TableRow
export const TableRow = ({ children, className = "" }) => (
    <tr className={`border-b ${className}`}>{children}</tr>
);

// TableCell
export const TableCell = ({ children, className = "", style = {} }) => {
    const { isHead } = useContext(TableContext);
    const baseClass = `p-2 border ${className}`;

    if (isHead) {
        return (
            <th className={baseClass} style={style}>
                {children}
            </th>
        );
    }

    return (
        <td className={baseClass} style={style}>
            {children}
        </td>
    );
};

export default Table;
