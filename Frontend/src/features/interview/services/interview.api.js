import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api/interview",
    withCredentials: true,
});

export async function generateInterviewReport({ jobDescription, selfDescription, resumeFile }) {
    try {
        const formData = new FormData();
        formData.append("jobDescription", jobDescription);
        formData.append("selfDescription", selfDescription);
        if (resumeFile) {
            formData.append("resume", resumeFile);
        }

        // Let the browser/axios set the multipart boundary automatically.
        const response = await api.post("/", formData);
        return response.data;
    } catch (error) {
        console.error("Error generating interview report:", error);
        throw error;
    }
}

export async function getAllInterviewReports() {
    try {
        const response = await api.get("/");
        return response.data;
    } catch (error) {
        console.error("Error fetching interview reports:", error);
        throw error;
    }
}

export async function getInterviewReportById(id) {
    try {
        const response = await api.get(`/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching interview report:", error);
        throw error;
    }
}

export async function generateResumePdf({ interviewReportId }) {
    try {
        const response = await api.get(`/${interviewReportId}/resume`, { responseType: "blob" });
        return response.data;
    } catch (error) {
        console.error("Error downloading resume PDF:", error);
        throw error;
    }
}
