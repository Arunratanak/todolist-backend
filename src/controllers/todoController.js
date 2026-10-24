import Todo from "../models/todo.js";
// get function consist of "Getting All" and "Getting by id"
const getTodos = async (req, res) => {
  try {
    const filter = {};

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
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).jason({ error: "Todo not found" });
    }
    res.json(todo);
  } catch (err) {
    res.status(400).json({ error: "err.message" });
  }
};

// post = create
const postTodo = async (req, res) => {
  try {
    if (Array.isArray(req.body)) {
      const items = req.body.map((item) => ({ title: item.title }));
      const todos = await Todo.insertMany(items);
      return res.status(201).json(todos);
    }

    const todo = await Todo.create({ title: req.body.title });
    res.status(201).json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// put = replace
const putTodo = async (req, res) => {
  try {
    const title = req.body.title;
    const completed = req.body.completed;

    if (title === undefined || completed === undefined) {
      return res
        .status(400)
        .json({ error: "PUT requires both title and completed" });
    }
    // findByIdAndUpdate takes 3 args (id, newData, options)
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
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

// patch = update
// patch is always by id

const patchTodo = async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, // $set means to change only what is sent
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

// delete
const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json({ message: "Todo deleted", id: todo._id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export { getTodos, getTodoById, postTodo, putTodo, patchTodo, deleteTodo };
