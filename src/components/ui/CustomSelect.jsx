import { useState } from "react";

const CustomSelect = ({ options, value, onChange, placeholder }) => {
    const [search, setSearch] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative w-full">
            {/* Ô nhập liệu */}
            <input
                type="text"
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    onChange(e.target.value);
                    setIsOpen(true); // Mở danh sách khi nhập
                }}
                onFocus={() => setIsOpen(true)} // Mở khi click vào
                onBlur={() => setTimeout(() => setIsOpen(false), 200)} // Tránh đóng ngay khi chọn
                placeholder={placeholder}
                className="border p-2 w-full"
            />

            {/* Danh sách gợi ý */}
            {isOpen && (
                <div
                    className="absolute top-full left-0 w-full border bg-white rounded-md max-h-40 overflow-y-auto z-[9999]"
                    style={{ position: "absolute" }} // Chắc chắn rằng absolute được áp dụng
                >
                    {options
                        .filter((opt) => opt.toLowerCase().includes(search.toLowerCase()))
                        .map((opt, index) => (
                            <div
                                key={index}
                                onClick={() => {
                                    onChange(opt);
                                    setSearch(opt);
                                    setIsOpen(false);
                                }}
                                className="cursor-pointer hover:bg-gray-200 p-2"
                            >
                                {opt}
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
};

export default CustomSelect;
