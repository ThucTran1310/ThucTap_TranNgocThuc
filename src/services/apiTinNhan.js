import axios from "axios";

// ✅ Gán token trực tiếp luôn – không dùng localStorage nữa
const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXJ0bmVyX2lkIjoxLCJwYXJ0bmVyX3VzZXJfaWQiOiIxMTgzIiwibWFqb3JfaWQiOjEzNSwibmFtZSI6IlBo4bqhbSBEdXkgQW4iLCJpYXQiOjE3NDI5MTUyMjR9.nMgvX6CVbtYD2YXFFAYY0VLtFBu8lV_Z4WkIUUt4q1Q";

export const getPendingMessages = async (params = {}) => {
    const url = "https://apitestchat.hasaki.vn/api/v1/user/getPendingMentionOfEmployeeV2";

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: token,
                Accept: "application/json",
            },
            params,
        });

        return response.data;
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        return [];
    }
};
