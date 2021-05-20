import fs from "fs-extra"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const { readJSON, writeJSON, writeFile, createReadStream } = fs

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../database") // now it targets the database folder
const authorsPath = join(dataFolderPath, "authors.json")
const blogPostsPath = join(dataFolderPath, "blogPosts.json")

// GET
export const getBlogPosts = async () => await readJSON(blogPostsPath)
export const getAuthors = async () => await readJSON(authorsPath)

// WRITE
export const writeBlogPosts = async (content) => await writeJSON(blogPostsPath, content)
export const writeAuthors = async (content) => await writeJSON(authorsPath, content)