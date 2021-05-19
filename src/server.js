import express from "express"
import listEndpoints from "express-list-endpoints"
import cors from "cors"
import authorsRoutes from "./authors/index.js"
import blogPostsRouter from "./blogPosts/index.js"
import { badRequestErrorHandler, notFoundErrorHandler, forbiddenErrorHandler, catchAllErrorHandler } from "./errorHandlers.js"
const server = express()

const port = process.env.PORT || 3001 // loading the environment variable called PORT, contained in .env file

server.use(express.json()) // If I do not specify this line of code BEFORE the routes, all the request bodies are going to be undefined
server.use(cors())
server.use("/authors", authorsRoutes)
server.use("/blogPosts", blogPostsRouter)


// ******** ERROR MIDDLEWARES ************

server.use(badRequestErrorHandler)
server.use(notFoundErrorHandler)
server.use(forbiddenErrorHandler)
server.use(catchAllErrorHandler)

server.listen(port, () => { console.log("Sever listens on  http://localhost: ", port) })
