const { GoogleGenAI, Type } = require("@google/genai")
const puppeteer = require("puppeteer")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

// LLM APIs intermittently return 503 (overloaded) / 429 (rate limited) / 500.
// These are transient, so we retry a few times with exponential backoff instead
// of failing the user's request on the first hiccup.
async function generateContentWithRetry(params, { retries = 4, baseDelay = 1000 } = {}) {
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            return await ai.models.generateContent(params)
        } catch (err) {
            const status = err.status
            const isTransient = status === 503 || status === 429 || status === 500
            if (!isTransient || attempt === retries) throw err
            const delay = baseDelay * Math.pow(2, attempt) // 1s, 2s, 4s, 8s
            console.warn(`Gemini ${status} — retrying in ${delay}ms (attempt ${attempt + 1}/${retries})`)
            await new Promise(resolve => setTimeout(resolve, delay))
        }
    }
}

const MODEL = "gemini-flash-latest"

// Gemini honors its own OpenAPI-subset schema (Type.*), NOT raw JSON Schema
// produced by zod-to-json-schema (which it silently ignores).
const interviewReportSchema = {
    type: Type.OBJECT,
    properties: {
        title: {
            type: Type.STRING,
            description: "The title of the job for which the interview report is generated"
        },
        matchScore: {
            type: Type.NUMBER,
            description: "A score between 0 and 100 indicating how well the candidate's profile matches the job description"
        },
        technicalQuestions: {
            type: Type.ARRAY,
            description: "Technical questions that can be asked in the interview along with their intention and how to answer them",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING, description: "The technical question that can be asked in the interview" },
                    intention: { type: Type.STRING, description: "The intention of the interviewer behind asking this question" },
                    answer: { type: Type.STRING, description: "How to answer this question, what points to cover, what approach to take etc." }
                },
                required: ["question", "intention", "answer"]
            }
        },
        behavioralQuestions: {
            type: Type.ARRAY,
            description: "Behavioral questions that can be asked in the interview along with their intention and how to answer them",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING, description: "The behavioral question that can be asked in the interview" },
                    intention: { type: Type.STRING, description: "The intention of the interviewer behind asking this question" },
                    answer: { type: Type.STRING, description: "How to answer this question, what points to cover, what approach to take etc." }
                },
                required: ["question", "intention", "answer"]
            }
        },
        skillGaps: {
            type: Type.ARRAY,
            description: "List of skill gaps in the candidate's profile along with their severity",
            items: {
                type: Type.OBJECT,
                properties: {
                    skill: { type: Type.STRING, description: "The skill which the candidate is lacking" },
                    severity: { type: Type.STRING, enum: ["low", "medium", "high"], description: "The severity of this skill gap" }
                },
                required: ["skill", "severity"]
            }
        },
        preparationPlan: {
            type: Type.ARRAY,
            description: "A day-wise preparation plan for the candidate to follow to prepare for the interview effectively",
            items: {
                type: Type.OBJECT,
                properties: {
                    day: { type: Type.NUMBER, description: "The day number in the preparation plan, starting from 1" },
                    focus: { type: Type.STRING, description: "The main focus of this day, e.g. data structures, system design, mock interviews etc." },
                    tasks: { type: Type.ARRAY, description: "List of tasks to be done on this day", items: { type: Type.STRING } }
                },
                required: ["day", "focus", "tasks"]
            }
        }
    },
    required: ["title", "matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan"],
    propertyOrdering: ["title", "matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan"]
}

async function generateInterviewReport({ resume, selfDescription, jobDescription, planDuration = "7 Days" }) {

    const prompt = `Generate a thorough interview report for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        Requirements for the report:
                        - Generate AT LEAST 10 technical questions (aim for 10-15) covering a wide range of topics
                          relevant to the job description, from fundamentals to advanced/scenario-based questions.
                        - Generate AT LEAST 8 behavioral questions (aim for 8-12) covering teamwork, conflict,
                          leadership, failure/learning, and situational judgment.
                        - For every question, include the interviewer's intention and a detailed model answer.
                        - Cover a diverse set of topics; do not repeat similar questions.
                        - The candidate wants a "${planDuration}" preparation plan. Design the preparationPlan to
                          span exactly this timeframe using sequential steps (the "day" field is the step number
                          starting at 1). Choose sensible granularity: a 7-day plan uses ~7 daily steps; a 1-month
                          plan uses ~4-6 weekly phases; a 6-month plan uses ~6 monthly phases. In each step's
                          "focus", clearly state the time period it covers (e.g. "Week 1", "Month 2") and the theme,
                          with concrete tasks for that period.
`

    const response = await generateContentWithRetry({
        model: MODEL,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: interviewReportSchema,
        }
    })

    return JSON.parse(response.text)
}



async function generatePdfFromHtml(htmlContent) {
    // These flags are required to launch Chromium in restricted/containerized
    // environments like Render (no sandbox, limited /dev/shm).
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
        ],
    })
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()

    return pdfBuffer
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const resumePdfSchema = {
        type: Type.OBJECT,
        properties: {
            html: {
                type: Type.STRING,
                description: "The HTML content of the resume which can be converted to PDF using any library like puppeteer"
            }
        },
        required: ["html"]
    }

    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `

    const response = await generateContentWithRetry({
        model: MODEL,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: resumePdfSchema,
        }
    })


    const jsonContent = JSON.parse(response.text)

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer

}

module.exports = { generateInterviewReport, generateResumePdf }
