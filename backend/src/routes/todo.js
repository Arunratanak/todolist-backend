import express from "express"
import requireAuth from "../middleware/requireAuth.js"
import { getTodos, getTodoById, postTodo, putTodo, patchTodo, deleteTodo } from "../controllers/todoController.js"

const router = express.Router();

router.get("/todos", requireAuth, getTodos)
router.get("/todos/:id", requireAuth, getTodoById)
router.post("/todos", requireAuth, postTodo)
router.put("/todos/:id", requireAuth, putTodo)
router.patch("/todos/:id", requireAuth, patchTodo)
router.delete("/todos/:id", requireAuth, deleteTodo)

export default router;