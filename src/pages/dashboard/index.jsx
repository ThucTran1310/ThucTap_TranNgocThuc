import React, { useEffect, useState, useRef } from "react";
import Card from "@/components/ui/Card";
import CardContent from "@/components/ui/CardContent";
import { Table, TableHead, TableRow, TableCell, TableBody } from "@/components/ui/table";
import Select from "react-select";
import { LocalizationProvider } from '@mui/x-date-pickers'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DetailTable from "@/components/ui/DetailTable";
import {
    getPendingMessagesForStatistics,
    getPendingMessagesForDetails,
    getFilterOptions,
} from "@/services/apiTinNhan";
import ExcelJS from "exceljs";
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
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalMessages, setTotalMessages] = useState(0);
    const [hasFiltered, setHasFiltered] = useState(false);

    const shouldApplyRef = useRef(false);

    const [isFilterClicked, setIsFilterClicked] = useState(false); // New state for tracking if filter is applied

    // Fetch filter options
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

    // Fetch initial statistics
    const fetchInitialStatistics = async () => {
        try {
            const res = await getPendingMessagesForStatistics();
            setDepartmentData(res.department_summerize || []);
            setMajorData(res.major_summerize || []);
            setUserData(res.user_summerize || []);
            setTotalMessages(res.total_cxl || 0);

            const users = (res.user_summerize || []).map((u) => ({
                label: u.name,
                value: u.partner_user_id,
            }));
            setUserOptions(users);
        } catch (err) {
            console.error("Lỗi API thống kê:", err);
        }
    };

    // Fetch detail data
    const fetchDetailData = async () => {
        try {
            setLoading(true);
            const data = await getPendingMessagesForDetails();
            setRawDetailData(data);
            setDetailData(data); // Initialize detailData with raw data
        } catch (err) {
            console.error("Lỗi gọi API chi tiết:", err);
        } finally {
            setLoading(false);
        }
    };

    // Update summary tables
    const updateSummaryTables = (data) => {
        const groupAndCount = (items, key) => {
            const map = new Map();
            for (const item of items) {
                const id = item[key + "_id"];
                if (!id) continue;
                if (!map.has(id)) {
                    map.set(id, { id, name: item[key], count: 0 });
                }
                map.get(id).count++;
            }
            return Array.from(map.values()).sort((a, b) => b.count - a.count);
        };

        setDepartmentData(groupAndCount(data, "partner_user_department"));
        setMajorData(groupAndCount(data, "partner_user_major"));

        const userMap = new Map();
        for (const item of data) {
            const id = item.partner_user_id;
            if (!id) continue;
            if (!userMap.has(id)) {
                userMap.set(id, {
                    partner_user_id: id,
                    name: item.partner_user_name,
                    avatar: item.partner_user_avatar,
                    infomation_long: `${item.partner_user_department} - ${item.partner_user_position} - ${item.partner_user_major} - ${item.partner_user_location}`,
                    count: 1,
                });
            } else {
                userMap.get(id).count++;
            }
        }
        setUserData(Array.from(userMap.values()));
        setTotalMessages(data.length);
    };

    // Handle search with filters
    const handleSearch = () => {
        setHasFiltered(true);
        setIsFilterClicked(true); // Mark that filter is clicked

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
        setFilteredData(filtered);
        updateSummaryTables(filtered);
    };

    // Handle table click
    const handleTableClick = (type, item, e) => {
        if (e) {
            e.preventDefault(); // Kiểm tra nếu e tồn tại
        }

        console.log("handleTableClick called");
        console.log("Type:", type);
        console.log("Item:", item);

        // Xử lý lọc dữ liệu
        const baseData = hasFiltered ? filteredData : rawDetailData;
        let result = [];

        if (type === "department") {
            console.log("Filtering by department:", item.partner_user_department);
            result = baseData.filter((row) => row.partner_user_department === item.partner_user_department);
        } else if (type === "major") {
            console.log("Filtering by major:", item.partner_user_major);
            result = baseData.filter((row) => row.partner_user_major === item.partner_user_major);
        } else if (type === "user") {
            console.log("Filtering by user:", item.partner_user_name);
            result = baseData.filter((row) => row.partner_user_name === item.partner_user_name);
        }

        console.log("Filtered result:", result);

        // Cập nhật lại dữ liệu sau khi lọc
        setDetailData(result);
        setTotalMessages(result.length);
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
        fetchInitialStatistics();
        fetchDetailData();
        setHasFiltered(false);
        setIsFilterClicked(false); // Reset filter flag
    };

    // Handle export to excel
    const handleExportExcel = () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("TinNhanCXL");

        worksheet.columns = [
            { header: "#", key: "index", width: 5 },
            { header: "Mã NV", key: "maNV", width: 15 },
            { header: "Họ tên", key: "hoTen", width: 25 },
            { header: "Bộ phận", key: "boPhan", width: 20 },
            { header: "Vị trí", key: "viTri", width: 15 },
            { header: "Nghiệp vụ", key: "nghiepVu", width: 20 },
            { header: "Nhóm chat", key: "nhomChat", width: 25 },
            { header: "Nội dung tin nhắn", key: "noiDungTinNhan", width: 30 },
            { header: "Tên người gửi", key: "tenNguoiGui", width: 20 },
            { header: "Ngày gửi", key: "ngayGui", width: 20 },
        ];

        worksheet.getRow(1).font = { bold: true };

        detailData.forEach((row, index) => {
            worksheet.addRow({
                index: index + 1,
                maNV: row.partner_user_code,
                hoTen: row.partner_user_name,
                boPhan: row.partner_user_department,
                viTri: row.partner_user_position,
                nghiepVu: row.partner_user_major,
                nhomChat: row.room_name,
                noiDungTinNhan: row.parsed_text,
                tenNguoiGui: row.from_partner_user_name,
                ngayGui: new Date(row.time).toLocaleString("vi-VN"),
            });
        });

        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "DanhSachTinNhanCXL.xlsx";
            link.click();
        });
    };

    useEffect(() => {
        console.log("Component rendered");
        const init = async () => {
            await fetchFilterOptions();
            await fetchInitialStatistics();
            await fetchDetailData();
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
            valueContainer: (base) => ({ ...base, maxHeight: "40px", overflowY: "auto" }),
            control: (base) => ({ ...base, minHeight: "40px" }),
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

            <Card>
                <CardContent>
                    <h3 className="section-title">Số lượng theo bộ phận / nghiệp vụ</h3>
                    <div className="tables-wrapper">
                        <div className="table-container">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Bộ phận</TableCell>
                                        <TableCell>Số lượng</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {departmentData.map((bp, idx) => (
                                        <TableRow
                                            key={bp.id || `department-${idx}`}
                                            onMouseDown={(e) => {
                                                console.log("Row clicked", bp);
                                                handleTableClick("department", { partner_user_department: bp.name, id: bp.id }, e);
                                            }}
                                            className="cursor-pointer hover:bg-gray-200"
                                        >
                                            <TableCell>{bp.name}</TableCell>
                                            <TableCell>{bp.count}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="table-container">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Nghiệp vụ</TableCell>
                                        <TableCell>Số lượng</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {majorData.map((mj, idx) => (
                                        <TableRow
                                            key={mj.id || `major-${idx}`}
                                            onClick={(e) => handleTableClick("major", { partner_user_major: mj.name, id: mj.id }, e)}
                                            className="cursor-pointer hover:bg-gray-200"
                                        >
                                            <TableCell>{mj.name}</TableCell>
                                            <TableCell>{mj.count}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="table-container">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Nhân viên</TableCell>
                                        <TableCell>Số lượng</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {userData.slice(0, 10).map((nv, idx) => (
                                        <TableRow
                                            key={nv.id || `user-${idx}`}
                                            onClick={(e) => handleTableClick("user", { partner_user_name: nv.name, id: nv.id }, e)}
                                            className="cursor-pointer hover:bg-gray-200"
                                        >
                                            <TableCell>
                                                <div className="user-info-row">
                                                    <img src={nv.avatar || "default-avatar.jpg"} alt={nv.name} className="avatar" />
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

                    <div className="total-cxl">
                        Tổng tin nhắn CXL: <strong>{totalMessages.toLocaleString()}</strong>
                    </div>
                </CardContent>
            </Card>

            <h3 className="section-title">Danh sách Thông Tin</h3>
            <DetailTable data={detailData} onRowClick={handleTableClick} />
        </section>
    );
}
