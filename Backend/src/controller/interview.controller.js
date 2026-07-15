const pdfParse = require('pdf-parse');
const { generateInterviewReport, generateResumePdf } = require('../../services/ai.service');
const interviewReportModel = require('../models/interviewReport.model');

async function getInterviewReportController(req, res) {
    try {
        const { selfDescription, jobDescription } = req.body;

        // A resume file is optional — if one was uploaded, read its text; otherwise
        // we fall back to the self-description the user typed.
        let resumeText = "";
        if (req.file) {
            const resumeParser = new pdfParse.PDFParse({ data: req.file.buffer });
            const resumeContent = await resumeParser.getText();
            resumeText = resumeContent.text;
        }

        if (!resumeText && !selfDescription) {
            return res.status(400).json({ message: "Please provide a resume or a self-description" });
        }

        const interviewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription
        });

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription,
            jobDescription,
            title: interviewReportByAi.title,
            matchScore: interviewReportByAi.matchScore,
            technicalQuestions: interviewReportByAi.technicalQuestions,
            behavioralQuestions: interviewReportByAi.behavioralQuestions,
            skillGaps: interviewReportByAi.skillGaps,
            preparationPlan: interviewReportByAi.preparationPlan,
        });

        res.status(200).json({ message: "Interview report generated successfully", interviewReport });
    } catch (error) {
        console.error("generateInterviewReport failed:", error);
        res.status(500).json({ message: "Failed to generate interview report", error: error.message });
    }
}


async function getInterviewReportByIdController(req, res) {
    try {
        const interviewReport = await interviewReportModel.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!interviewReport) {
            return res.status(404).json({ message: "Interview report not found" });
        }

        res.status(200).json({ message: "Interview report fetched successfully", interviewReport });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch interview report", error: error.message });
    }
}


async function downloadResumePdfController(req, res) {
    try {
        const interviewReport = await interviewReportModel.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!interviewReport) {
            return res.status(404).json({ message: "Interview report not found" });
        }

        const pdfBuffer = await generateResumePdf({
            resume: interviewReport.resume,
            selfDescription: interviewReport.selfDescription,
            jobDescription: interviewReport.jobDescription
        });

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="resume-${req.params.id}.pdf"`
        });
        res.send(pdfBuffer);
    } catch (error) {
        res.status(500).json({ message: "Failed to generate resume PDF", error: error.message });
    }
}


async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = await interviewReportModel
            .find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select("title matchScore createdAt");

        res.status(200).json({ message: "Interview reports fetched successfully", interviewReports });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch interview reports", error: error.message });
    }
}


module.exports = {
    getInterviewReportController,
    getAllInterviewReportsController,
    getInterviewReportByIdController,
    downloadResumePdfController
};