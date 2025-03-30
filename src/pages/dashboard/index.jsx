import React, { useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Card from "@/components/ui/Card";
import CardContent from "@/components/ui/CardContent";
import { Table, TableHead, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { Search, RefreshCcw } from "lucide-react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DetailTable from "@/components/ui/DetailTable";
import "./dashboard.scss";

export default function DashBoard() {
    const [department, setDepartment] = useState(null);
    const [job, setJob] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [position, setPosition] = useState(null);
    const [workplace, setWorkplace] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);

    const customStyles = {
        option: (provided, { isSelected }) => ({
            ...provided,
            fontWeight: isSelected ? "bold" : "normal",
            backgroundColor: isSelected ? "#798ffc" : "white",
            color: isSelected ? "white" : "black",
            ":hover": { backgroundColor: "#f0f0f0" },
        }),
        indicatorSeparator: () => ({ display: "none" }),
        control: (provided) => ({
            ...provided,
            backgroundColor: "white",
            color: "black",
            display: "flex",
            flexWrap: "nowrap",
            overflow: "hidden",
            minHeight: "40px",
            height: "40px",
            width: "100%",
            maxWidth: "350px",
        }),
        valueContainer: (provided) => ({
            ...provided,
            display: "flex",
            flexWrap: "nowrap",
            overflowX: "auto",
            overflowY: "hidden",
            whiteSpace: "nowrap",
            maxWidth: "100%",
            maxHeight: "38px",
            alignItems: "center",
        }),
        multiValue: (provided) => ({
            ...provided,
            fontWeight: "bold",
            backgroundColor: "#798ffc",
            color: "white",
            flexShrink: 0,
            whiteSpace: "nowrap",
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            color: "white",
            whiteSpace: "nowrap",
        }),
        multiValueRemove: (provided) => ({
            ...provided,
            color: "white",
            ":hover": { backgroundColor: "red", color: "white" },
        }),
    };

    const departmentOptions = [
        { value: "KAIZEN", label: "KAIZEN" },
        { value: "LOGISTICS", label: "LOGISTICS" },
        { value: "SUPPLY CHAIN", label: "SUPPLY CHAIN" },
        { value: "ADM", label: "ADM" },
        { value: "F&A", label: "F&A" },
        { value: "BOD", label: "BOD" },
        { value: "CLINIC", label: "CLINIC" },
        { value: "TECH", label: "TECH" },
    ];

    const jobOptions = [
        { value: "Kế toán", label: "Kế toán" },
        { value: "Lễ tân", label: "Lễ tân" },
        { value: "Bác sĩ Da liễu", label: "Bác sĩ Da liễu" },
        { value: "Chăm sóc da", label: "Chăm sóc da" },
        { value: "Nhân sự", label: "Nhân sự" },
        { value: "Marketing Online", label: "Marketing Online" },
        { value: "Quản lý chi nhánh", label: "Quản lý chi nhánh" },
        { value: "Thiết kế đồ họa", label: "Thiết kế đồ họa" },
        { value: "Lập trình viên", label: "Lập trình viên" },
    ];
    const positionOptions = [
        { value: "Specialist", label: "Specialist" },
        { value: "Assistant Supervisor", label: "Assistant Supervisor" },
        { value: "Sub Leader", label: "Sub Leader" },
        { value: "Supervisor", label: "Supervisor" },
        { value: "Assistant Manager", label: "Assistant Manager" },
        { value: "Director", label: "Director" },
        { value: "Doctor", label: "Doctor" },
        { value: "Manager", label: "Manager" },
    ];

    const workplaceOptions = [
        { value: "101 Lê Lợi", label: "101 Lê Lợi" },
        { value: "202 Nguyễn Trãi", label: "202 Nguyễn Trãi" },
        { value: "303 Trần Hưng Đạo", label: "303 Trần Hưng Đạo" },
        { value: "404 Hai Bà Trưng", label: "404 Hai Bà Trưng" },
        { value: "505 Cách Mạng Tháng 8", label: "505 Cách Mạng Tháng 8" },
    ];

    const data = [
        { id: 1, department: "MARKETING", count: 452, service: "Quảng cáo Facebook" },
        { id: 2, department: "SALES", count: 128, service: "Tư vấn khách hàng" },
        { id: 3, department: "HR", count: 64, service: "Phỏng vấn ứng viên" },
        { id: 4, department: "IT", count: 23, service: "Bảo trì hệ thống" },
    ];

    const details = {
        1: ["Phạm Minh Hùng - 150", "Nguyễn Thị Lan - 95"],
        2: ["Võ Quốc Khánh - 18"],
        3: ["Lê Minh Tâm - 42"],
        4: ["Trần Bảo Châu - 7"],
    };
    const employees = [
        { id: 1, name: "Trần Ngọc Thức", department: "COSMETICS", location: "176 Nguyễn Văn Cừ", count: 27 },
        { id: 2, name: "Trần Ngọc Thức", department: "COSMETICS", location: "176 Nguyễn Văn Cừ", count: 27 },
        { id: 3, name: "Trần Ngọc Thức", department: "COSMETICS", location: "176 Nguyễn Văn Cừ", count: 27 },
        { id: 4, name: "Trần Ngọc Thức", department: "COSMETICS", location: "176 Nguyễn Văn Cừ", count: 27 },
        { id: 5, name: "Trần Ngọc Thức", department: "COSMETICS", location: "176 Nguyễn Văn Cừ", count: 27 },
        { id: 6, name: "Trần Ngọc Thức", department: "COSMETICS", location: "176 Nguyễn Văn Cừ", count: 27 },
        { id: 7, name: "Trần Ngọc Thức", department: "COSMETICS", location: "176 Nguyễn Văn Cừ", count: 27 },
    ];

    return (
        <section className="p-6 text-white">
            <div className="form-container w-full h-full p-4">
                <div className="grid-container grid-cols-6 gap-4 items-center mb-4 w-full">
                    <div className="col-span-2 flex w-full">
                        <div className="button-group flex gap-2 w-full">
                            <Button className="flex items-center gap-2 w-full"><Search size={14} /></Button>
                            <Button className="flex items-center gap-2 bg-blue-600 text-white w-full"><RefreshCcw size={14} /></Button>
                            <Button className="bg-green-600 text-white w-full">Xuất Excel</Button>
                        </div>
                    </div>

                    <div className="grid-rows-2 grid gap-4">
                        <div className="grid grid-cols-4 gap-3">
                            <div className="input-wrapper"><Input placeholder="Người nhận" className="w-full" /></div>
                            <div className="input-wrapper"><Input placeholder="Người gửi" className="w-full" /></div>
                            <div className="datepicker-Day">
                                <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} selectsStart startDate={startDate} endDate={endDate} dateFormat="dd/MM/yyyy" placeholderText="Từ ngày" className="datepicker border" />
                                <span>→</span>
                                <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} selectsEnd startDate={startDate} endDate={endDate} minDate={startDate} dateFormat="dd/MM/yyyy" placeholderText="Đến ngày" className="datepicker border" />
                            </div>
                        </div>

                        <div className="filter-container grid grid-cols-4 gap-4">
                            <div className="filter-item">
                                <Select options={departmentOptions} value={department} onChange={setDepartment} placeholder="Bộ phận" isMulti closeMenuOnSelect={false} styles={customStyles} />
                            </div>
                            <div className="filter-item">
                                <Select options={jobOptions} value={job} onChange={setJob} placeholder="Nghiệp vụ" isMulti closeMenuOnSelect={false} styles={customStyles} />
                            </div>
                            <div className="filter-item">
                                <Select options={positionOptions} value={position} onChange={setPosition} placeholder="Vị trí" isMulti closeMenuOnSelect={false} styles={customStyles} />
                            </div>
                            <div className="filter-item">
                                <Select options={workplaceOptions} value={workplace} onChange={setWorkplace} placeholder="Nơi làm việc" isMulti closeMenuOnSelect={false} styles={customStyles} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Card>
                <CardContent>
                    <div className="content-wrapper">
                        <div className="header-with-total">
                            <h3 className="section-title">Số lượng chờ xử lý theo bộ phận/nghiệp vụ</h3>
                            <div className="total-count">Tổng: {data.reduce((sum, row) => sum + row.count, 0)}</div>
                        </div>
                        <div className="tables-wrapper grid grid-cols-1 gap-4">
                            <Table className="bg-white rounded-lg shadow">
                                {/* Bộ phận */}
                                <TableHead>
                                    <TableRow className="bg-green-100">
                                        <TableCell>Bộ phận</TableCell>
                                        <TableCell>Số lượng</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            className="cursor-pointer hover:bg-gray-100"
                                            onClick={() => setSelectedRow(selectedRow === row.id ? null : row.id)}
                                        >
                                            <TableCell>{row.department}</TableCell>
                                            <TableCell>{row.count}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            <Table className="bg-white rounded-lg shadow">
                                {/* Nghiệp vụ */}
                                <TableHead>
                                    <TableRow className="bg-green-100">
                                        <TableCell>Nghiệp vụ</TableCell>
                                        <TableCell>Số lượng</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            className="cursor-pointer hover:bg-gray-100"
                                            onClick={() => setSelectedRow(selectedRow === row.id ? null : row.id)}
                                        >
                                            <TableCell>{row.service}</TableCell>
                                            <TableCell>{row.count}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            <Table className="bg-white rounded-lg shadow">
                                {/* Nhân viên */}
                                <TableHead>
                                    <TableRow className="bg-green-100">
                                        <TableCell>NV có nhiều tin nhắn CXL nhất</TableCell>
                                        <TableCell>Số lượng</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {employees.map((employee) => (
                                        <TableRow
                                            key={employee.id}
                                            className="cursor-pointer hover:bg-gray-100"
                                            onClick={() => setSelectedRow(selectedRow === employee.id ? null : employee.id)}
                                        >
                                            <TableCell>
                                                {employee.name} - {employee.department} - {employee.location}
                                            </TableCell>
                                            <TableCell>{employee.count}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {selectedRow && (
                            <div className="details-section mt-4 p-4 border rounded bg-gray-50">
                                <h2 className="text-lg font-bold mb-2">Nhân viên có nhiều tin nhắn CXL nhất</h2>
                                <div className="table-container">
                                    <Table>
                                        <TableHead>
                                            <TableRow className="bg-green-100">
                                                <TableCell>Tên nhân viên</TableCell>
                                                <TableCell>Số lượng</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {details[selectedRow].map((item, index) => {
                                                const [name, count] = item.split(" - ");
                                                return (
                                                    <TableRow key={index}>
                                                        <TableCell>{name}</TableCell>
                                                        <TableCell>{count}</TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
            <DetailTable />
        </section>
    );
}
