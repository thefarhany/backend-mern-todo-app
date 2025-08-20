import Todo from "../models/Todo.js";

// Create Todo
export const createTodo = async (req, res) => {
  try {
    const { title, description } = req.body;

    const todo = new Todo({
      title,
      description,
      user: req.user.id,
    });

    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Todos
export const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id });
    res.status(201).json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Todo
export const getTodoById = async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user.id });
    if (!todo) return res.status(404).json({ message: "Todo tidak ditemukan" });
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Todo
export const updateTodo = async (req, res) => {
  try {
    const { title, description, completed } = req.body;
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title, description, completed },
      { new: true }
    );

    if (!todo) return res.status(404).json({ message: "Todo tidak ditemukan" });
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Todo
export const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!todo) return res.status(404).json({ message: "Todo tidak ditemukan" });
    res.status(201).json({ message: "Todo berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
