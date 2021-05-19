import express from "express"
import fs from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import uniqid from "uniqid"
import { send } from "process"
import createError from "http-errors"
import { validationResult } from "express-validator"

const blogPostsJsonPath = join(dirname(fileURLToPath(import.meta.url)), "blogPosts.json")
console.log(blogPostsJsonPath);

const getBlogPosts = function () {
    const content = fs.readFileSync(blogPostsJsonPath)
    return JSON.parse(content)
}

const writeBlogPosts = content => fs.writeFileSync(blogPostsJsonPath, JSON.stringify(content))

const blogPostsRouter = express.Router()


blogPostsRouter.post("/", (req, res, next) => {

    try {
        const authorsPath = join(join(dirname(dirname(fileURLToPath(import.meta.url))), "authors"), "authors.json")
        const authorsArr = JSON.parse(fs.readFileSync(authorsPath))
        const errors = validationResult(req)
        console.log(errors)
        if (!errors.isEmpty()) {
            next(createError(400, { errorList: errors }))

        } else {

            const newBlog = { _id: uniqid(), ...req.body, author: authorsArr[0].name, avatar: authorsArr[0].avatar, createdAT: new Date() }

            const blogs = getBlogPosts()
            blogs.push(newBlog)

            fs.writeFileSync(blogPostsJsonPath, JSON.stringify(blogs))
            res.status(201).send(newBlog)
        }
    } catch (error) {
        console.log(error)
        next(error)
    }


})

blogPostsRouter.get("/", (req, res, next) => {
    try {
        const blogs = getBlogPosts()
        res.send(blogs)

    } catch (error) {
        console.log(error);
        next(error)
    }
})

blogPostsRouter.get("/:blogId", (req, res, next) => {
    try {
        const blogs = getBlogPosts()
        const blog = blogs.find(blog => blog._id === req.params.blogId)
        if (blog) {
            res.send(blog)
        } else {
            next(createError(404, `Blog with id: ${req.params.blogId} not found!`))
        }

    } catch (error) {
        console.log(error)
        next(error)
    }
})

blogPostsRouter.put("/:blogId", (req, res, next) => {
    try {
        const blogs = getBlogPosts()
        const blog = blogs.find(blog => blog._id === req.params.blogId)
        if (blog) {
            const remainingBlogs = blogs.filter(blog._id !== req.params.blogId)
            const editedBlog = { ...req.body, _id: req.params.blogId }
            remainingBlogs.push(editedBlog)
            fs.writeFileSync(blogPostsJsonPath, JSON.stringify(remainingBlogs))
            res.send(editedBlog)
        } else {
            next(createError(404, `Blog with id: ${req.params.blogId} not found!`))
        }
    } catch (error) {
        console.log(error);
        next(error)
    }


})

blogPostsRouter.delete("/:blogId", (req, res, next) => {
    try {
        const blogs = getBlogPosts()
        const blog = blogs.find(blog => blog._id === req.params.blogId)
        if (blog) {
            const remainingBlogs = blogs.filter(blog._id !== req.params.blogId)
            fs.writeFileSync(blogPostsJsonPath, JSON.stringify(remainingBlogs))
            res.status(204).send()
        } else {
            next(createError(404, `Blog with id: ${req.params.blogId} not found!`))
        }
    } catch (error) {

    }
})

export default blogPostsRouter