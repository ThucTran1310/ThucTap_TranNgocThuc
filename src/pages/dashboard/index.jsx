// 📁 src/pages/dashboard/index.jsx
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
import { getPendingMessages } from "@/services/apiTinNhan";
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
    const [dataApi, setDataApi] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async (params = {}) => {
        try {
            setLoading(true);
            const data = await getPendingMessages(params);
            if (Array.isArray(data)) {
                setDataApi(data);
            } else {
                setDataApi([]);
            }
        } catch (err) {
            console.error("Fetch error", err);
            setDataApi([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSearch = () => {
        const params = {
            fromDate: startDate?.toISOString(),
            toDate: endDate?.toISOString(),
            receiver,
            sender,
            departments: department?.map((d) => d.value).join(","),
            jobTitles: job?.map((j) => j.value).join(","),
            positions: position?.map((p) => p.value).join(","),
            workplaces: workplace?.map((w) => w.value).join(","),
        };
        fetchData(params);
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
        fetchData();
    };

    const handleExportExcel = () => {
        if (!Array.isArray(dataApi)) return;
        const ws = XLSX.utils.json_to_sheet(dataApi);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "TinNhanCXL");
        XLSX.writeFile(wb, "DanhSachTinNhanCXL.xlsx");
    };

    const groupBy = (array, key) => {
        if (!Array.isArray(array)) return {};
        return array.reduce((res, item) => {
            const group = typeof key === "function" ? key(item) : item[key];
            res[group] = (res[group] || 0) + 1;
            return res;
        }, {});
    };

    const thongKeBoPhan = groupBy(dataApi, "boPhan");
    const thongKeNghiepVu = groupBy(dataApi, "nghiepVu");
    const thongKeNhanVien = groupBy(dataApi, (item) => `${item.hoTen} - ${item.boPhan}`);
    const topNhanVien = Object.entries(thongKeNhanVien)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    const options = (arr) => arr.map((item) => ({ value: item, label: item }));

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
                        <div className="table-container">
                            <Table>
                                <TableHead className="ant-style-header">
                                    <TableRow><TableCell>Bộ phận</TableCell><TableCell>Số lượng</TableCell></TableRow>
                                </TableHead>
                                <TableBody>
                                    {Object.entries(thongKeBoPhan).map(([bp, count]) => (
                                        <TableRow key={bp}><TableCell>{bp}</TableCell><TableCell>{count}</TableCell></TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="table-container">
                            <Table>
                                <TableHead className="ant-style-header">
                                    <TableRow><TableCell>Nghiệp vụ</TableCell><TableCell>Số lượng</TableCell></TableRow>
                                </TableHead>
                                <TableBody>
                                    {Object.entries(thongKeNghiepVu).map(([nv, count]) => (
                                        <TableRow key={nv}><TableCell>{nv}</TableCell><TableCell>{count}</TableCell></TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="table-container">
                            <Table>
                                <TableHead className="ant-style-header">
                                    <TableRow><TableCell>NV nhiều tin nhắn</TableCell><TableCell>Số lượng</TableCell></TableRow>
                                </TableHead>
                                <TableBody>
                                    {topNhanVien.map((nv, idx) => (
                                        <TableRow key={idx}><TableCell>{nv.name}</TableCell><TableCell>{nv.count}</TableCell></TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* CHI TIẾT */}
            <DetailTable data={dataApi} />
        </section>
    );
}
