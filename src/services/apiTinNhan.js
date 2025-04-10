import axios from "axios";

// ✅ Gán token trực tiếp luôn – không dùng localStorage nữa
const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXJ0bmVyX2lkIjoxLCJwYXJ0bmVyX3VzZXJfaWQiOiI2IiwibWFqb3JfaWQiOjE0MiwibmFtZSI6IsSQaW5oIEjDsmEgSGnhu4dwIiwiaWF0IjoxNzQzNzUxMzg4fQ.XzUzIqsrUY4pW9sV34yPGOeFyspT2NEWByJ0qKXDIpI";

// API 1: Lấy dữ liệu cho bảng thống kê
export const getPendingMessagesForStatistics = async (params = {}) => {
    const url = "https://apitestchat.hasaki.vn/api/v1/user/getPendingMentionOfEmployee";

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: token,
                Accept: "application/json",
            },
            params,
        });

        console.log("🔥 Full API response:", response.data);
        console.log("🔥 metaData đúng:", response.data?.data?.metaData);

        const metaData = response.data?.data?.metaData;

        if (!metaData || typeof metaData !== "object") {
            console.warn("⚠️ metaData không hợp lệ:", metaData);
            return {
                department_summarize: [],
                major_summarize: [],
                user_summarize: [],
            };
        }

        return metaData;
    } catch (error) {
        console.error("Lỗi khi gọi API thống kê:", error);
        return {
            department_summarize: [],
            major_summarize: [],
            user_summarize: [],
        };
    }
};
// ✅ API 2: Lấy dữ liệu cho bảng chi tiết
export const getPendingMessagesForDetails = async (params = {}) => {
    const url = "https://apitestchat.hasaki.vn/api/v1/user/getPendingMentionOfEmployeeV2";

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: token,
                Accept: "application/json",
            },
            params,
        });

        // ✅ Trả về mảng list từ data
        return response.data?.data?.list || [];
    } catch (error) {
        console.error("Lỗi khi gọi API chi tiết:", error);
        return [];
    }
};
