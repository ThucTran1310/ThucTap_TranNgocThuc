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
    const [rawDetailData, setRawDetailData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalMessages, setTotalMessages] = useState(0); // ✅ thêm

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
            const { department_summerize, major_summerize, user_summerize, total_cxl } = metaData || {};
            setDepartmentData(department_summerize || []);
            setMajorData(major_summerize || []);
            setUserData(user_summerize || []);
            setTotalMessages(total_cxl || 0); // ✅ tổng số tin nhắn

            const users = (user_summerize || []).map((u) => ({
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

    const fetchDetailData = async () => {
        try {
            setLoading(true);
            const data = await getPendingMessagesForDetails();
            setRawDetailData(data);
        } catch (err) {
            console.error("Lỗi gọi API chi tiết:", err);
        } finally {
            setLoading(false);
        }
    };

    const filterData = () => {
        const receiverSet = new Set(receiver.map((r) => r.value));
        const senderSet = new Set(sender.map((s) => s.value));
        const deptSet = new Set(department.map((d) => d.value));
        const majorSet = new Set(job.map((j) => j.value));
        const posSet = new Set(position.map((p) => p.value));
        const locSet = new Set(workplace.map((w) => w.value));

        const filtered = rawDetailData.filter((item) => {
            const time = new Date(item.time);
            const inDate = (!startDate || time >= startDate) && (!endDate || time <= endDate);
            const inReceiver = receiver.length === 0 || receiverSet.has(item.partner_user_id);
            const inSender = sender.length === 0 || senderSet.has(item.from_partner_user_id);
            const inDept = department.length === 0 || deptSet.has(item.partner_user_department_id);
            const inMajor = job.length === 0 || majorSet.has(item.partner_user_major_id);
            const inPos = position.length === 0 || posSet.has(item.partner_user_position_id);
            const inLoc = workplace.length === 0 || locSet.has(item.partner_user_location_id);
            return inDate && inReceiver && inSender && inDept && inMajor && inPos && inLoc;
        });

        setDetailData(filtered);
    };

    const handleSearch = () => {
        const params = {
            fromDate: startDate?.toISOString(),
            toDate: endDate?.toISOString(),
            receiverIds: receiver.map((r) => r.value).join(",") || undefined,
            senderIds: sender.map((s) => s.value).join(",") || undefined,
            departmentIds: department.map((d) => d.value).join(",") || undefined,
            majorIds: job.map((j) => j.value).join(",") || undefined,
            position_ids: position.map((p) => p.value).join(",") || undefined,
            location_ids: workplace.map((w) => w.value).join(",") || undefined,
        };

        fetchStatisticsData(params);
        filterData();
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
            await fetchDetailData();
            handleSearch();
        };
        init();
    }, []);

    const selectProps = {
        isMulti: true,
        isLoading: loading,
        classNamePrefix: "react-select",
        menuPortalTarget: document.body,
        styles: {
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            valueContainer: (base) => ({
                ...base,
                maxHeight: "40px",
                overflowY: "auto",
            }),
            control: (base) => ({
                ...base,
                minHeight: "40px",
            }),
        },
    };

    return (
        <section>
            <div className="filter-form">
                <div className="filter-form__row">
                    <Select {...selectProps} placeholder="Người nhận" value={receiver} onChange={setReceiver} options={userOptions} />
                    <Select {...selectProps} placeholder="Người gửi" value={sender} onChange={setSender} options={userOptions} />
                    <div className="date-range-group">
                        <DatePicker selected={startDate} onChange={setStartDate} placeholderText="Từ ngày" className="custom-date-input" dateFormat="dd/MM/yyyy" />
                        <DatePicker selected={endDate} onChange={setEndDate} placeholderText="Đến ngày" className="custom-date-input" dateFormat="dd/MM/yyyy" />
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

            {/* ✅ Tổng số tin nhắn CXL */}
            <div className="total-cxl">
                Tổng tin nhắn CXL: <strong>{totalMessages.toLocaleString()}</strong>
            </div>

            <Card>
                <CardContent>
                    <h3 className="section-title">Số lượng theo bộ phận / nghiệp vụ</h3>
                    <div className="tables-wrapper">
                        <div className="table-container">
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
                                            setDepartment([{ label: bp.name, value: bp.id }]);
                                            handleSearch();
                                        }}>
                                            <TableCell>{bp.name}</TableCell>
                                            <TableCell>{bp.count}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="table-container">
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
                                            setJob([{ label: mj.name, value: mj.id }]);
                                            handleSearch();
                                        }}>
                                            <TableCell>{mj.name}</TableCell>
                                            <TableCell>{mj.count}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="table-container">
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
                                            <TableCell>
                                                <div className="user-info-row">
                                                    <img src={nv.avatar} alt={nv.name} className="avatar" />
                                                    <div>
                                                        <div className="user-name">{nv.name}</div>
                                                        <div className="user-meta">{nv.infomation_long}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{nv.count}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <DetailTable data={detailData} />
        </section>
    );
}
