let id = 1;

getId = () => {
  const currentId = id;
  id += 1;
  return currentId;
};

createToDo = (name, id = getId()) => {
  return { id, name, done: false };
};

respondWithError = (res, error) => {
  res.status(400);
  res.json({ error });
};

respondNotFound = res => {
  res.status(404);
  res.send("Not found");
};

verifyName = (req, res) => {
  if (!req.body || !req.body.hasOwnProperty("name")) {
    return respondWithError(res, "Name is missing");
  }
  let { name } = req.body;
  if (typeof name !== "string") {
    return respondWithError(res, "Name should be a string");
  }
  name = name.trim();
  if (name === "") {
    return respondWithError(res, "Name should not be empty");
  }
  return { name };
};

findToDo = id => {
  const numberId = Number(id);
  return todos.find(todo => todo.id === numberId);
};

const todos = [createToDo("Dinner"), createToDo("Dinner")];

exports.getTodos = () => todos;

addTodo = todo => {
  todos.push(todo);
};

exports.addTodo = addTodo;
exports.createToDo = createToDo;

exports.list = (req, res) => {
  res.json(todos);
};
exports.create = (req, res, next) => {
  const cleanName = verifyName(req, res);
  if (!cleanName) {
    return;
  }
  const todo = createToDo(cleanName.name);
  addTodo(todo);
  res.json(todo);
};
exports.change = (req, res) => {
  const cleanName = verifyName(req, res);
  if (!cleanName) {
    return;
  }
  const todo = findToDo(req.params.id);
  if (typeof todo === "undefined") {
    return respondNotFound(res);
  }
  todo.name = cleanName.name;
  res.json(todo);
};
exports.delete = (req, res) => {
  const todo = findToDo(req.params.id);
  if (typeof todo === "undefined") {
    return respondNotFound(res);
  }
  todos.splice(todos.indexOf(todo), 1);
  res.json(todo);
};
exports.toggle = (req, res) => {
  const todo = findToDo(req.params.id);
  if (typeof todo === "undefined") {
    return respondNotFound(res);
  }
  todo.done = !todo.done;
  res.json(todo);
};
