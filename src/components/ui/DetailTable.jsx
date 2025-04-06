// 📁 src/components/ui/DetailTable.jsx
import { useState } from "react";
import { Table, TableHead, TableRow, TableCell, TableBody } from "@/components/ui/table";
import "@/pages/dashboard/dashboard.scss";

const DetailTable = ({ data = [] }) => {
    const [showTable, setShowTable] = useState(false);
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;
    const startIdx = (page - 1) * itemsPerPage;
    const pageData = data.slice(startIdx, startIdx + itemsPerPage);
    const totalPages = Math.ceil(data.length / itemsPerPage);

    return (
        <div>
            {!showTable && (
                <div className="button-container">
                    <button onClick={() => setShowTable(true)} className="xem-chi-tiet">
                        Xem chi tiết
                    </button>
                </div>
            )}

            {showTable && (
                <div className="content-wrapper">
                    <Table>
                        <TableHead className="ant-style-header">
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Mã NV</TableCell>
                                <TableCell>Họ tên</TableCell>
                                <TableCell>Bộ phận</TableCell>
                                <TableCell>Vị trí</TableCell>
                                <TableCell>Nghiệp vụ</TableCell>
                                <TableCell>Nhóm chat</TableCell>
                                <TableCell>Nội dung tin nhắn</TableCell>
                                <TableCell>Tên người gửi</TableCell>
                                <TableCell>Email người gửi</TableCell>
                                <TableCell>Ngày gửi</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pageData.map((item, index) => (
                                <TableRow key={`${item.id || index}`}>
                                    <TableCell>{startIdx + index + 1}</TableCell>
                                    <TableCell>{item.maNv}</TableCell>
                                    <TableCell>{item.hoTen}</TableCell>
                                    <TableCell>{item.boPhan}</TableCell>
                                    <TableCell>{item.viTri}</TableCell>
                                    <TableCell>{item.nghiepVu}</TableCell>
                                    <TableCell>{item.nhomChat}</TableCell>
                                    <TableCell>{item.noiDung?.length > 20 ? item.noiDung.slice(0, 20) + "..." : item.noiDung}</TableCell>
                                    <TableCell>{item.tenNguoiGui}</TableCell>
                                    <TableCell>{item.emailNguoiGui}</TableCell>
                                    <TableCell>{item.ngayGui}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <div className="table-footer">
                        <button onClick={() => setShowTable(false)} className="hide-button">
                            Ẩn bớt
                        </button>
                        <div className="pending-dashboard__content__paging">
                            <span onClick={() => page > 1 && setPage(page - 1)}>&lt;</span>
                            <span className="pending-dashboard__content__paging__number">{page}</span>
                            <span onClick={() => page < totalPages && setPage(page + 1)}>&gt;</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DetailTable;