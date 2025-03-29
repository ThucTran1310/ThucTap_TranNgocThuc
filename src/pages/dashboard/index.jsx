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
        { value: "CSKH", label: "CSKH" },
        { value: "Cosmetic", label: "Cosmetic" },
        { value: "Đào tạo", label: "Đào tạo" },
        { value: "Quản lý cửa hàng", label: "Quản lý cửa hàng" },
        { value: "Bảo vệ", label: "Bảo vệ" },
        { value: "Đóng gói", label: "Đóng gói" },
        { value: "Tư vấn Clinic", label: "Tư vấn Clinic" },
        { value: "BOM", label: "BOM" },
        { value: "Giao hàng nhanh", label: "Giao hàng nhanh" },
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
        { value: "123 an khánh", label: "123 An Khánh" },
        { value: "234 bình thủy", label: "234 Bình Thủy" },
        { value: "456 cái răng", label: "456 Cái Răng" },
        { value: "789 thốt nốt", label: "789 Thốt Nốt" },
        { value: "999 cờ đỏ", label: "999 Cờ Đỏ" },
    ];

    const data = [
        { id: 1, department: "LOGISTICS", count: 3177, service: "Giao hàng nhanh" },
        { id: 2, department: "TECH", count: 9, service: "CSKH Cosmetic" },
        { id: 3, department: "SPA", count: 3, service: "Bác sĩ" },
        { id: 4, department: "SPA", count: 1, service: "CSKH Spa" },
    ];

    const details = {
        1: ["Nguyễn Văn A - 20", "Trần Thị B - 15"],
        2: ["Phạm Văn C - 10"],
        3: ["Lê Thị D - 5"],
        4: ["Hoàng Văn E - 2"],
    };

    const employees = [
        { id: 1, name: "Nguyễn Thị Luyện", department: "COSMETICS", location: "176 Phan Đăng Lưu", count: 27 },
        { id: 2, name: "Mai Yến Nhi", department: "COSMETICS", location: "447 Phan Văn Trị", count: 22 },
        { id: 3, name: "BOD Test 1", department: "BOD", location: "", count: 15 },
        { id: 4, name: "Nguyễn Văn Tính", department: "COSMETICS", location: "555 3 tháng 2", count: 10 },
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
                        <div className="tables-wrapper">
                            <div className="table-container">
                                <Table>
                                    <TableHead>
                                        <TableRow className="bg-green-100">
                                            <TableCell>Bộ phận</TableCell>
                                            <TableCell>Số lượng</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data.map((row) => (
                                            <TableRow key={row.id} className="cursor-pointer hover:bg-gray-100" onClick={() => setSelectedRow(selectedRow === row.id ? null : row.id)}>
                                                <TableCell>{row.department}</TableCell>
                                                <TableCell>{row.count}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            <div className="table-container">
                                <Table>
                                    <TableHead>
                                        <TableRow className="bg-green-100">
                                            <TableCell>Nghiệp vụ</TableCell>
                                            <TableCell>Số lượng</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data.map((row) => (
                                            <TableRow key={row.id} className="cursor-pointer hover:bg-gray-100" onClick={() => setSelectedRow(selectedRow === row.id ? null : row.id)}>
                                                <TableCell>{row.service}</TableCell>
                                                <TableCell>{row.count}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            <div className="table-container">
                                <Table>
                                    <TableHead>
                                        <TableRow className="bg-green-100">
                                            <TableCell>NV có nhiều tin nhắn CXL nhất</TableCell>
                                            <TableCell>Số lượng</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {employees.map((employee) => (
                                            <TableRow key={employee.id} className="cursor-pointer hover:bg-gray-100" onClick={() => setSelectedRow(selectedRow === employee.id ? null : employee.id)}>
                                                <TableCell>{employee.name} - {employee.department} - {employee.location}</TableCell>
                                                <TableCell>{employee.count}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
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
