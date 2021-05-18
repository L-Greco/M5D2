/*
****************** STUDENTS CRUD ********************
1. CREATE → POST http://localhost:3001/students (+ body)
2. READ → GET http://localhost:3001/students (+ optional query parameters)
3. READ → GET http://localhost:3001/students/:id
4. UPDATE → PUT http://localhost:3001/students/:id (+ body)
5. DELETE → DELETE http://localhost:3001/students/:id
*/

import express, { response } from "express" // 3rd party module
import fs from "fs" // core module
import { fileURLToPath } from "url" // core module
import { dirname, join } from "path" // core module
import uniqid from "uniqid" // 3rd party module


// express.Router() function is used to create a new router object.
// This function is used when you want to create a new router object in your program to handle requests.
const authorsRoutes = express.Router()
// console.log(import.meta.url) -> file:///C:/Users/Costas/Desktop/STRIVE/M5/M5D2/src/authors/index.js
const filePath = fileURLToPath(import.meta.url)
// console.log(filePath)--> C:\Users\Costas\Desktop\STRIVE\M5\M5D2\src\authors\index.js
const authorsFolderPath = dirname(filePath)
// console.log(authorsFolderPath); --> C:\Users\Costas\Desktop\STRIVE\M5\M5D2\src\authors (targets the folder)
// we use this syntax because authors.json and index are in the same folder , the authors folder

// we can write the next line with "+" since we just concatenating strings but is best practise to 
// concatenate them with join()
const authorJSONPath = join(authorsFolderPath, "authors.json") // and we created the path for the database

// time to set the Routes !!

authorsRoutes.post("/", (request, response) => {
    // 1. read request body
    const newAuthor = {
        ...request.body, createdAt: new Date()
        , _id: uniqid()
    }
    console.log(newAuthor)
    // 2. read the old content of the file students.json

    const authors = JSON.parse(fs.readFileSync(authorJSONPath).toString())
    console.log(authors);
    // 3. push the newAuthor into students array
    authors.push(newAuthor)
    // 4. write the array back into the file authors.json
    fs.writeFileSync(authorJSONPath, JSON.stringify(authors))

    // 5. send back proper response
    response.status(201).send(newAuthor._id)
})

authorsRoutes.get("/", (request, response) => {
    // 1.read authors.json content
    const contentAsAbuffer = fs.readFileSync(authorJSONPath) // we get back a buffer which is MACHINE READABLE
    const authors = JSON.parse(contentAsAbuffer) // we  convert into a JSON object

    response.send(authors)

})

authorsRoutes.get("/:id", (request, response) => {
    console.log(request.params)

    // 1. read the content of the file
    const authors = JSON.parse(fs.readFileSync(authorJSONPath).toString())

    // 2. find the one with the correspondant id

    const author = authors.find(s => s._id === request.params.id)

    // 3. send it as a response
    response.send(author)
})


export default authorsRoutes