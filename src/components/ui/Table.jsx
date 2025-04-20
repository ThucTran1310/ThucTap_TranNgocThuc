import React, { useContext, createContext } from "react";

const TableContext = createContext({ isHead: false });

// Table
export const Table = ({ children, className = "", style = {}, ...props }) => (
    <table className={`w-full border-collapse border border-gray-300 ${className}`} style={style} {...props}>
        {children}
    </table>
);

// TableHead
export const TableHead = ({ children, className = "", style = {}, ...props }) => (
    <TableContext.Provider value={{ isHead: true }}>
        <thead className={className} style={style} {...props}>
            {children}
        </thead>
    </TableContext.Provider>
);

// TableBody
export const TableBody = ({ children, className = "", style = {}, ...props }) => (
    <TableContext.Provider value={{ isHead: false }}>
        <tbody className={className} style={style}{...props}>
            {children}
        </tbody>
    </TableContext.Provider>
);

// TableRow
export const TableRow = ({ children, className = "", ...props }) => (
    <tr className={`border-b ${className}`}{...props}>{children}</tr>
);

// TableCell
export const TableCell = ({ children, className = "", style = {}, ...props }) => {

    const { isHead } = useContext(TableContext);
    const baseClass = `p-2 border ${className}`;

    if (isHead) {
        return (
            <th className={baseClass} style={style} {...props}>{children}</th>


        );
    }

    return (
        <td className={baseClass} style={style} {...props}>
            {children}
        </td>
    );
};

export default Table;
