require("dotenv").config()
const app = require("./src/app")
const connectToDB = require("./src/config/database")

connectToDB()


// Render (and most hosts) provide the port via the PORT env var and only route
// traffic there. Fall back to 3000 for local development.
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})