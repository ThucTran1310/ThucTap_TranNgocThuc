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

    const handlePrevPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const handleNextPage = () => {
        if (page < totalPages) {
            setPage(page + 1);
        }
    };

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
                                <TableCell>Ngày gửi</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pageData.map((item, index) => (
                                <TableRow key={item._id || index}>
                                    <TableCell>{startIdx + index + 1}</TableCell>
                                    <TableCell>{item.partner_user_code}</TableCell>
                                    <TableCell>{item.partner_user_name}</TableCell>
                                    <TableCell>{item.partner_user_department}</TableCell>
                                    <TableCell>{item.partner_user_position}</TableCell>
                                    <TableCell>{item.partner_user_major}</TableCell>
                                    <TableCell>{item.room_name}</TableCell>
                                    <TableCell title={item.parsed_text}>
                                        {item.parsed_text?.length > 20
                                            ? item.parsed_text.slice(0, 20) + "..."
                                            : item.parsed_text}
                                    </TableCell>
                                    <TableCell>{item.from_partner_user_name}</TableCell>
                                    <TableCell>{new Date(item.time).toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <div className="table-footer">
                        <button onClick={() => setShowTable(false)} className="hide-button">
                            Ẩn bớt
                        </button>
                        <div className="pending-dashboard__content__paging">
                            <span onClick={handlePrevPage}>&lt;</span>
                            <span className="pending-dashboard__content__paging__number">{page}</span>
                            <span onClick={handleNextPage}>&gt;</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DetailTable;
