import express from 'express'
import {getTodos, getTodoById, postTodo, putTodo, patchTodo, deleteTodo} from "../controllers/todoController.js"

const router = express.Router();

router.get("/todos", getTodos)
router.get("/todos/:id", getTodoById)
router.post("/todos", postTodo)
router.put("/todos/:id", putTodo)
router.patch("/todos/:id", patchTodo)
router.delete("/todos/:id", deleteTodo)

export default router;