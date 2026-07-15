const express = require('express');
const middlewares = require('../middlewares/middlewares');
const interviewRouter = express.Router();
const interviewController = require('../controller/interview.controller');
const upload = require('../middlewares/file.middleware');

/**
 * @route   POST /api/interview/
 * @desc    Generate an interview report based on the provided questions and answers
 * @access  Private
 */
interviewRouter.post("/", middlewares.authenticateToken, upload.single('resume'), interviewController.getInterviewReportController);

/**
 * @route   GET /api/interview/
 * @desc    List all interview reports for the logged-in user
 * @access  Private
 */
interviewRouter.get("/", middlewares.authenticateToken, interviewController.getAllInterviewReportsController);

/**
 * @route   GET /api/interview/:id
 * @desc    Fetch a single interview report by its id
 * @access  Private
 */
interviewRouter.get("/:id", middlewares.authenticateToken, interviewController.getInterviewReportByIdController);

/**
 * @route   GET /api/interview/:id/resume
 * @desc    Generate and download a tailored resume PDF for the report
 * @access  Private
 */
interviewRouter.get("/:id/resume", middlewares.authenticateToken, interviewController.downloadResumePdfController);

module.exports = interviewRouter;