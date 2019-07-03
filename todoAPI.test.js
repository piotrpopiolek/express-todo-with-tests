const todoAPI = require("./todoAPI");

let req;
let res;

expectStatus = status => {
  if (status === 200) {
    return;
  }
  expect(res.status).toHaveBeenCalledTimes(1);
  expect(res.status).toHaveBeenCalledWith(status);
};

expectResponse = json => {
  expect(res.json).toHaveBeenCalledTimes(1);
  expect(res.json).toHaveBeenCalledWith(json);
  expect(res.send).not.toHaveBeenCalled();
};

expectTextResponse = text => {
  expect(res.send).toHaveBeenCalledTimes(1);
  expect(res.send).toHaveBeenCalledWith(text);
  expect(res.json).not.toHaveBeenCalled();
};

beforeEach(() => {
  req = {
    params: {}
  };
  res = {
    json: jest.fn(),
    status: jest.fn(),
    send: jest.fn()
  };
  next = jest.fn();
});

describe("list", () => {
  it("works", () => {
    todoAPI.list(req, res);

    const todos = todoAPI.getTodos();
    expectStatus(200);
    expectResponse(todos);
  });
});
describe("create", () => {
  it("works", () => {
    const name = "Supper";
    const { length } = todoAPI.getTodos();

    req.body = { name };
    todoAPI.create(req, res);

    expectStatus(200);
    const todos = todoAPI.getTodos();
    expectResponse(todos[todos.length - 1]);
    expect(todos).toHaveLength(length + 1);
    expect(todos[todos.length - 1]).toMatchObject({ name, done: false });
    expect(new Set(todos.map(todo => todo.id)).size).toEqual(todos.length);
  });

  it("handles missing body", () => {
    todoAPI.create(req, res);

    expectStatus(400);
    expectResponse({ error: "Name is missing" });
  });

  it("handles missing name in the body", () => {
    req.body = {};
    todoAPI.create(req, res);

    expectStatus(400);
    expectResponse({ error: "Name is missing" });
  });

  it("handles an empty name", () => {
    req.body = { name: "" };
    todoAPI.create(req, res);

    expectStatus(400);
    expectResponse({
      error: "Name should not be empty"
    });
  });

  it("handles an empty name (after trimming)", () => {
    req.body = { name: "    " };
    todoAPI.create(req, res);

    expectStatus(400);
    expectResponse({
      error: "Name should not be empty"
    });
  });

  it("handles wrong name type", () => {
    req.body = { name: 42 };
    todoAPI.create(req, res);

    expectStatus(400);
    expectResponse({ error: "Name should be a string" });
  });
});
describe("change", () => {
  const id = 45;
  const name = "Test";
  const nextName = "Kolacja";

  it("works", () => {
    todoAPI.addTodo(todoAPI.createToDo(name, id));
    const { length } = todoAPI.getTodos();
    req.params.id = id;
    req.body = { name: nextName };
    todoAPI.change(req, res);

    const todos = todoAPI.getTodos();
    const todo = todos.find(todo => todo.id === id);
    expectStatus(200);
    expectResponse(todo);
    expect(todos).toHaveLength(length);
    expect(todo).toMatchObject({ name: nextName });
  });

  it("handles missing todo", () => {
    req.params.id = "whatever";
    req.body = { name: nextName };
    todoAPI.change(req, res);

    expectStatus(404);
    expectTextResponse("Not found");
  });

  it("handles missing name in the body", () => {
    req.body = {};
    todoAPI.change(req, res);

    expectStatus(400);
    expectResponse({ error: "Name is missing" });
  });

  it("handles an empty name", () => {
    req.params.id = id;
    req.body = { name: "" };
    todoAPI.change(req, res);

    expectStatus(400);
    expectResponse({
      error: "Name should not be empty"
    });
  });

  it("handles an empty name (after trimming)", () => {
    req.params.id = id;
    req.body = { name: "    " };
    todoAPI.change(req, res);

    expectStatus(400);
    expectResponse({
      error: "Name should not be empty"
    });
  });

  it("handles wrong name type", () => {
    req.params.id = id;
    req.body = { name: 42 };
    todoAPI.change(req, res);

    expectStatus(400);
    expectResponse({ error: "Name should be a string" });
  });
});
describe("delete", () => {
  const id = 45;
  const name = "Test";

  it("works", () => {
    todoAPI.addTodo(todoAPI.createToDo(name, id));
    const { length } = todoAPI.getTodos();
    const todo = todoAPI.getTodos().find(todo => todo.id === id);
    req.params.id = id;
    todoAPI.delete(req, res);

    const todos = todoAPI.getTodos();
    expectStatus(200);
    expectResponse(todo);
    expect(todos).toHaveLength(length - 1);
    expect(todo).toMatchObject({ id });
  });

  it("handles missing todo", () => {
    req.params.id = "whatever";
    todoAPI.delete(req, res);

    expectStatus(404);
    expectTextResponse("Not found");
  });
});
describe("toggle", () => {
  const id = 45;
  const name = "Test";

  it("works", () => {
    todoAPI.addTodo(todoAPI.createToDo(name, id));
    const { length } = todoAPI.getTodos();
    req.params.id = id;
    todoAPI.toggle(req, res);

    const todos = todoAPI.getTodos();
    const todo = todoAPI.getTodos().find(todo => todo.id === id);
    expectStatus(200);
    expectResponse(todo);
    expect(todos).toHaveLength(length);
    expect(todo.done).toEqual(true);
  });

  it("handles missing todo", () => {
    req.params.id = "whatever";
    todoAPI.toggle(req, res);

    expectStatus(404);
    expectTextResponse("Not found");
  });
});
