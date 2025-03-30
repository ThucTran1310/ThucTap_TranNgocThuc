import { useState } from "react";
import { Table, TableHead, TableRow, TableCell, TableBody } from "@/components/ui/table";
import "@/pages/dashboard/dashboard.scss";

const DetailTable = () => {
    const [showTable, setShowTable] = useState(false);
    const [page, setPage] = useState(1);

    const data = [
        {
            id: 1,
            maNv: "18147",
            hoTen: "Nguyễn Văn Tính",
            boPhan: "COSMETICS",
            viTri: "Staff",
            nghiepVu: "Nhân viên mỹ phẩm",
            nhomChat: "Đổi tên nhóm",
            noiDung: "https://testchat.hasaki.vn/chat/1...",
            tenNguoiGui: "Văn Thành Phúc",
            emailNguoiGui: "phuc@hasaki.vn",
            ngayGui: "27/03/25 11:50",
        },
        {
            id: 2,
            maNv: "221817",
            hoTen: "Mai Yến Nhi",
            boPhan: "COSMETICS",
            viTri: "Staff",
            nghiepVu: "Nhân viên mỹ phẩm",
            nhomChat: "GROUP TEST",
            noiDung: "https://testchat.hasaki.vn/chat/2...",
            tenNguoiGui: "Văn Thành Phúc",
            emailNguoiGui: "phuc@hasaki.vn",
            ngayGui: "27/03/25 11:23",
        },
        // Thêm dữ liệu giả lập khác nếu cần
    ];

    return (
        <div>
            {!showTable && (
                <div className="button-container text-center my-4">
                    <button onClick={() => setShowTable(true)} className="bg-pink-500 text-white px-4 py-2 rounded font-semibold">
                        Xem chi tiết
                    </button>
                </div>
            )}

            {showTable && (
                <div className="content-wrapper">
                    <Table>
                        <TableHead>
                            <TableRow className="bg-[#d1fae5] text-[#1e293b] font-semibold text-[13.5px] text-center">
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
                            {data.map((item, index) => (
                                <TableRow key={`${item.id}-${index}`}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{item.maNv}</TableCell>
                                    <TableCell>{item.hoTen}</TableCell>
                                    <TableCell>{item.boPhan}</TableCell>
                                    <TableCell>{item.viTri}</TableCell>
                                    <TableCell>{item.nghiepVu}</TableCell>
                                    <TableCell>{item.nhomChat}</TableCell>
                                    <TableCell>{item.noiDung.length > 20 ? item.noiDung.slice(0, 20) + "..." : item.noiDung}</TableCell>
                                    <TableCell>{item.tenNguoiGui}</TableCell>
                                    <TableCell>{item.emailNguoiGui}</TableCell>
                                    <TableCell>{item.ngayGui}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Footer */}
                    <div className="table-footer flex justify-between items-center mt-4 px-2">
                        <button onClick={() => setShowTable(false)} className="hide-button">
                            Ẩn bớt
                        </button>

                        <div className="pending-dashboard__content__paging flex items-center gap-2">
                            <span onClick={() => page > 1 && setPage(page - 1)} className="cursor-pointer hover:opacity-80">
                                <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.59 18 19 16.59 14.42 12 19 7.41 17.59 6l-6 6z" />
                                    <path d="m11 18 1.41-1.41L7.83 12l4.58-4.59L11 6l-6 6z" />
                                </svg>
                            </span>
                            <span className="pending-dashboard__content__paging__number font-semibold text-sm text-gray-800">{page}</span>
                            <span onClick={() => setPage(page + 1)} className="cursor-pointer hover:opacity-80">
                                <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M6.41 6 5 7.41 9.58 12 5 16.59 6.41 18l6-6z" />
                                    <path d="m13 6-1.41 1.41L16.17 12l-4.58 4.59L13 18l6-6z" />
                                </svg>
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DetailTable;