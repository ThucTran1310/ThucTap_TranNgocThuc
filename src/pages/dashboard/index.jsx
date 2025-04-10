import React, { useEffect, useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Card from "@/components/ui/Card";
import CardContent from "@/components/ui/CardContent";
import { Table, TableHead, TableRow, TableCell, TableBody } from "@/components/ui/table";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DetailTable from "@/components/ui/DetailTable";
import { getPendingMessagesForStatistics, getPendingMessagesForDetails } from "@/services/apiTinNhan";
import * as XLSX from "xlsx";
import { Search, RefreshCcw, FileDown } from "lucide-react";
import "./dashboard.scss";

export default function DashBoard() {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [receiver, setReceiver] = useState("");
    const [sender, setSender] = useState("");
    const [department, setDepartment] = useState(null);
    const [job, setJob] = useState(null);
    const [position, setPosition] = useState(null);
    const [workplace, setWorkplace] = useState(null);
    const [departmentData, setDepartmentData] = useState([]);
    const [majorData, setMajorData] = useState([]);
    const [userData, setUserData] = useState([]);
    const [detailData, setDetailData] = useState([]);
    const [loading, setLoading] = useState(false);


    const fetchStatisticsData = async (params = {}) => {
        try {
            setLoading(true);
            const metaData = await getPendingMessagesForStatistics(params);
            console.log("📊 metaData từ API:", metaData);

            // ✅ Đúng tên theo API (summerize với 2 chữ "m")
            const {
                department_summerize,
                major_summerize,
                user_summerize
            } = metaData || {};

            setDepartmentData(department_summerize || []);
            setMajorData(major_summerize || []);
            setUserData(user_summerize || []);
        } catch (err) {
            console.error("Lỗi gọi API thống kê:", err);
            setDepartmentData([]);
            setMajorData([]);
            setUserData([]);
        } finally {
            setLoading(false);
        }
    };


    const fetchDetailData = async (params = {}) => {
        try {
            setLoading(true);
            const data = await getPendingMessagesForDetails(params);
            setDetailData(data);
        } catch (err) {
            console.error("Fetch error for details", err);
            setDetailData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const init = async () => {
            await Promise.all([
                fetchStatisticsData({}),
                fetchDetailData({})
            ]);
        };
        init();
    }, []);


    const handleSearch = () => {
        const params = {
            fromDate: startDate?.toISOString() ?? undefined,
            toDate: endDate?.toISOString() ?? undefined,
            receiver,
            sender,
            departments: Array.isArray(department) ? department.map(d => d.value).join(",") : undefined,
            jobTitles: Array.isArray(job) ? job.map(j => j.value).join(",") : undefined,
            positions: Array.isArray(position) ? position.map(p => p.value).join(",") : undefined,
            workplaces: Array.isArray(workplace) ? workplace.map(w => w.value).join(",") : undefined,
        };
        fetchStatisticsData(params);
        fetchDetailData(params);
    };

    const handleReset = () => {
        setReceiver("");
        setSender("");
        setStartDate(null);
        setEndDate(null);
        setDepartment(null);
        setJob(null);
        setPosition(null);
        setWorkplace(null);
        fetchStatisticsData();
        fetchDetailData();
    };

    const handleExportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(userData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "TinNhanCXL");
        XLSX.writeFile(wb, "DanhSachTinNhanCXL.xlsx");
    };

    console.log("👀 departmentData:", departmentData);
    console.log("👀 majorData:", majorData);
    console.log("👀 userData:", userData);

    return (
        <section>
            {/* FILTER FORM */}
            <div className="filter-form">
                <div className="filter-form__row">
                    <Input placeholder="Tìm theo người nhận" value={receiver} onChange={(e) => setReceiver(e.target.value)} />
                    <Input placeholder="Tìm theo người gửi" value={sender} onChange={(e) => setSender(e.target.value)} />
                    <div className="date-range-group">
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            placeholderText="Từ ngày"
                            className="custom-date-input"
                            dateFormat="dd/MM/yyyy"
                        />
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            placeholderText="Đến ngày"
                            className="custom-date-input"
                            dateFormat="dd/MM/yyyy"
                        />
                    </div>
                </div>

                <div className="filter-form__row">
                    <Select placeholder="Bộ phận" value={department} onChange={setDepartment} isMulti />
                    <Select placeholder="Nghiệp vụ" value={job} onChange={setJob} isMulti />
                    <Select placeholder="Vị trí" value={position} onChange={setPosition} isMulti />
                    <Select placeholder="Nơi làm việc" value={workplace} onChange={setWorkplace} isMulti />
                </div>

                <div className="filter-buttons">
                    <button onClick={handleSearch}><Search size={16} /> Tìm</button>
                    <button onClick={handleReset}><RefreshCcw size={16} /> Làm mới</button>
                    <button onClick={handleExportExcel}><FileDown size={16} /> Xuất Excel</button>
                </div>
            </div>

            {/* THỐNG KÊ */}
            <Card>
                <CardContent>
                    <h3 className="section-title">Số lượng theo bộ phận / nghiệp vụ</h3>
                    <div className="tables-wrapper">
                        {/* BẢNG BỘ PHẬN */}
                        <div className="table-container">
                            <div className="scrollable-table">
                                <Table>
                                    <TableHead className="sticky-header">
                                        <TableRow>
                                            <TableCell>Bộ phận</TableCell>
                                            <TableCell>Số lượng</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {departmentData.map((bp, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell>{bp.name}</TableCell>
                                                <TableCell>{bp.count}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

                        {/* BẢNG NGHIỆP VỤ */}
                        <div className="table-container">
                            <div className="scrollable-table">
                                <Table>
                                    <TableHead className="sticky-header">
                                        <TableRow>
                                            <TableCell>Nghiệp vụ</TableCell>
                                            <TableCell>Số lượng</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {majorData.map((mj, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell>{mj.name}</TableCell>
                                                <TableCell>{mj.count}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

                        {/* BẢNG NHÂN VIÊN */}
                        <div className="table-container">
                            <div className="scrollable-table">
                                <Table>
                                    <TableHead className="sticky-header">
                                        <TableRow>
                                            <TableCell>Nhân viên</TableCell>
                                            <TableCell>Số lượng</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {userData.slice(0, 10).map((nv, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell>{nv.name}</TableCell>
                                                <TableCell>{nv.count}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>


            {/* CHI TIẾT */}
            <DetailTable data={detailData} />
        </section>
    );
}
