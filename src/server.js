import express from "express"
import listEndpoints from "express-list-endpoints"
import cors from "cors"
import authorsRoutes from "./authors/index.js"
const server = express()

const port = 3001

server.use(express.json()) // If I do not specify this line of code BEFORE the routes, all the request bodies are going to be undefined
server.use(cors())
server.use("/authors", authorsRoutes)
server.listen(port, () => { console.log("server is running on port : ", port) })
