import Todo from "../models/todo.js";

const getTodos = async (req, res) => {
  try {
    const filter = { user: req.userId };   // CHANGED: start with the owner filter

    if (req.query.title) {
      const escaped = req.query.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.title = { $regex: escaped, $options: "i" };
    }

    const todos = await Todo.find(filter).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTodoById = async (req, res) => {
  try {
    // CHANGED: findById -> findOne with both id and owner
    const todo = await Todo.findOne({ _id: req.params.id, user: req.userId });
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const postTodo = async (req, res) => {
  try {
    if (Array.isArray(req.body)) {
      // CHANGED: each item gets the owner
      const items = req.body.map((item) => ({ title: item.title, user: req.userId }));
      const todos = await Todo.insertMany(items);
      return res.status(201).json(todos);
    }

    // CHANGED: owner added
    const todo = await Todo.create({ title: req.body.title, user: req.userId });
    res.status(201).json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const putTodo = async (req, res) => {
  try {
    const title = req.body.title;
    const completed = req.body.completed;

    if (title === undefined || completed === undefined) {
      return res
        .status(400)
        .json({ error: "PUT requires both title and completed" });
    }

    // CHANGED: findByIdAndUpdate -> findOneAndUpdate with id + owner
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { title, completed },
      { new: true, runValidators: true },
    );
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const patchTodo = async (req, res) => {
  try {
    // CHANGED: only allow title and completed to be changed
    const { title, completed } = req.body;
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (completed !== undefined) updates.completed = completed;

    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { $set: updates },
      { new: true, runValidators: true },
    );

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteTodo = async (req, res) => {
  try {
    // CHANGED: findByIdAndDelete -> findOneAndDelete with id + owner
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json({ message: "Todo deleted", id: todo._id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export { getTodos, getTodoById, postTodo, putTodo, patchTodo, deleteTodo };