import { useState } from "react";
import { Table, TableHead, TableRow, TableCell, TableBody } from "@/components/ui/table";
import "@/pages/dashboard/dashboard.scss";
import { Pagination } from "@mui/material"; // Chỉ import Pagination từ Material UI

const DetailTable = () => {
    const [showTable, setShowTable] = useState(false);
    const [page, setPage] = useState(1);

    const handlePageChange = (event, value) => {
        setPage(value); // Cập nhật trang khi nhấn nút
    };

    return (
        <div>
            {/*hiển thị Xem chi tiết*/}
            {!showTable && (
                <div className="button-container">
                    <button
                        onClick={() => setShowTable(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                    >
                        Xem chi tiết
                    </button>
                </div>
            )}

            {/*Hiển thị bảng*/}
            {showTable && (
                <div className="table-container">
                    <Table>
                        <TableHead>
                            <TableRow className="bg-green-100">
                                <TableCell>Họ tên</TableCell>
                                <TableCell>Bộ phận</TableCell>
                                <TableCell>Vị trí</TableCell>
                                <TableCell>Nghiệp vụ</TableCell>
                                <TableCell>Nhóm chat</TableCell>
                                <TableCell>Nội dung tin nhắn</TableCell>
                                <TableCell>Tên người gửi</TableCell>
                                <TableCell>Ngày gửi</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>Nguyễn Văn A</TableCell>
                                <TableCell>IT</TableCell>
                                <TableCell>Developer</TableCell>
                                <TableCell>Code</TableCell>
                                <TableCell>Chat Group 1</TableCell>
                                <TableCell>Xin chào</TableCell>
                                <TableCell>Admin</TableCell>
                                <TableCell>2025-03-28</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    {/* Pagination (Điều hướng qua các trang) */}
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: 20 }}>
                        <Pagination
                            count={2} // Số trang bạn muốn (có thể thay đổi)
                            page={page}
                            onChange={handlePageChange} // Thực hiện thay đổi trang
                            shape="rounded" // Đặt dạng hình tròn cho các nút
                            color="primary" // Màu sắc của Pagination
                        />
                    </div>
                    {/*Ẩn chi tiết*/}
                    <div className="hide-button">
                        <button
                            onClick={() => setShowTable(false)}
                            className="bg-red-500"
                        >
                            Ẩn chi tiết
                        </button>
                    </div>
                </div>
            )}


        </div>
    );
};

export default DetailTable;
