import React, { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import CardContent from "@/components/ui/CardContent";
import { Table, TableHead, TableRow, TableCell, TableBody } from "@/components/ui/table";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DetailTable from "@/components/ui/DetailTable";
import {
    getPendingMessagesForStatistics,
    getPendingMessagesForDetails,
    getFilterOptions
} from "@/services/apiTinNhan";
import * as XLSX from "xlsx";
import { Search, RefreshCcw, FileDown } from "lucide-react";
import "./dashboard.scss";

export default function DashBoard() {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [receiver, setReceiver] = useState([]);
    const [sender, setSender] = useState([]);
    const [department, setDepartment] = useState([]);
    const [job, setJob] = useState([]);
    const [position, setPosition] = useState([]);
    const [workplace, setWorkplace] = useState([]);

    const [departmentOptions, setDepartmentOptions] = useState([]);
    const [majorOptions, setMajorOptions] = useState([]);
    const [positionOptions, setPositionOptions] = useState([]);
    const [workplaceOptions, setWorkplaceOptions] = useState([]);
    const [userOptions, setUserOptions] = useState([]);

    const [departmentData, setDepartmentData] = useState([]);
    const [majorData, setMajorData] = useState([]);
    const [userData, setUserData] = useState([]);
    const [detailData, setDetailData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchFilterOptions = async () => {
        try {
            const filters = await getFilterOptions();
            setDepartmentOptions(filters.departments || []);
            setMajorOptions(filters.majors || []);
            setPositionOptions(filters.positions || []);
            setWorkplaceOptions(filters.locations || []);
        } catch (err) {
            console.error("Lỗi lấy filter options:", err);
        }
    };

    const fetchStatisticsData = async (params = {}) => {
        try {
            setLoading(true);
            const metaData = await getPendingMessagesForStatistics(params);
            const { department_summerize, major_summerize, user_summerize } = metaData || {};
            setDepartmentData(department_summerize || []);
            setMajorData(major_summerize || []);
            setUserData(user_summerize || []);
            const users = (user_summerize || []).map(u => ({
                label: u.name,
                value: u.partner_user_id,
            }));
            setUserOptions(users);
        } catch (err) {
            console.error("Lỗi gọi API thống kê:", err);
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
            console.error("Lỗi gọi API chi tiết:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        const params = {
            fromDate: startDate?.toISOString(),
            toDate: endDate?.toISOString(),
            receiverIds: receiver.map(r => r.value).join(",") || undefined,
            senderIds: sender.map(s => s.value).join(",") || undefined,
            departmentIds: department.map(d => d.value).join(",") || undefined,
            majorIds: job.map(j => j.value).join(",") || undefined,
            position_ids: position.map(p => p.value).join(",") || undefined,
            location_ids: workplace.map(w => w.value).join(",") || undefined,
        };
        fetchStatisticsData(params);
        fetchDetailData(params);
    };

    const handleReset = () => {
        setReceiver([]);
        setSender([]);
        setStartDate(null);
        setEndDate(null);
        setDepartment([]);
        setJob([]);
        setPosition([]);
        setWorkplace([]);
        handleSearch();
    };

    const handleExportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(detailData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "TinNhanCXL");
        XLSX.writeFile(wb, "DanhSachTinNhanCXL.xlsx");
    };

    useEffect(() => {
        const init = async () => {
            await fetchFilterOptions();
            handleSearch();
        };
        init();
    }, []);

    const selectProps = {
        isMulti: true,
        isLoading: loading,
        menuPortalTarget: document.body,
        styles: {
            menuPortal: base => ({ ...base, zIndex: 9999 }),
        },
    };

    return (
        <section>
            {/* FORM FILTER */}
            <div className="filter-form">
                <div className="filter-form__row">
                    <Select {...selectProps} placeholder="Người nhận" value={receiver} onChange={setReceiver} options={userOptions} />
                    <Select {...selectProps} placeholder="Người gửi" value={sender} onChange={setSender} options={userOptions} />
                    <div className="date-range-group">
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            placeholderText="Từ ngày"
                            className="custom-date-input"
                            dateFormat="dd/MM/yyyy"
                            popperClassName="z-datepicker"
                        />
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            placeholderText="Đến ngày"
                            className="custom-date-input"
                            dateFormat="dd/MM/yyyy"
                            popperClassName="z-datepicker"
                        />
                    </div>
                </div>

                <div className="filter-form__row">
                    <Select {...selectProps} placeholder="Bộ phận" value={department} onChange={setDepartment} options={departmentOptions} />
                    <Select {...selectProps} placeholder="Nghiệp vụ" value={job} onChange={setJob} options={majorOptions} />
                    <Select {...selectProps} placeholder="Vị trí" value={position} onChange={setPosition} options={positionOptions} />
                    <Select {...selectProps} placeholder="Nơi làm việc" value={workplace} onChange={setWorkplace} options={workplaceOptions} />
                </div>

                <div className="filter-buttons">
                    <button onClick={handleSearch}><Search size={16} /> Tìm</button>
                    <button onClick={handleReset}><RefreshCcw size={16} /> Làm mới</button>
                    <button onClick={handleExportExcel}><FileDown size={16} /> Xuất Excel</button>
                </div>
            </div>

            {/* BẢNG THỐNG KÊ */}
            <Card>
                <CardContent>
                    <h3 className="section-title">Số lượng theo bộ phận / nghiệp vụ</h3>
                    <div className="tables-wrapper">
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
                                            <TableRow key={idx} onClick={() => {
                                                setDepartment([{ value: bp.id, label: bp.name }]);
                                                handleSearch();
                                            }}>
                                                <TableCell>{bp.name || "Không rõ"}</TableCell>
                                                <TableCell>{bp.count}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

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
                                            <TableRow key={idx} onClick={() => {
                                                setJob([{ value: mj.id, label: mj.name }]);
                                                handleSearch();
                                            }}>
                                                <TableCell>{mj.name || "Không rõ"}</TableCell>
                                                <TableCell>{mj.count}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

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

            {/* BẢNG CHI TIẾT */}
            <DetailTable data={detailData} />
        </section>
    );
}
