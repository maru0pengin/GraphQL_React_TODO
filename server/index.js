const { ApolloServer } = require("apollo-server");
const { gql } = require("apollo-server");
const { DataSource } = require("apollo-datasource");
const { Sequelize, DataTypes } = require("sequelize");

const createStore = () => {
  const db = new Sequelize({
    dialect: "sqlite",
    storage: "./store.sqlite",
  });

  const todoList = db.define("todo", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    text: DataTypes.TEXT,
  });
  return { db, todoList };
};

const store = createStore();

const typeDefs = gql`
  type Query {
    todoList: [todo]
  }
  type todo {
    id: ID!
    text: String
  }
  type Mutation {
    createTodo(text: String): Boolean
    deleteTodo(id: ID!): Boolean
    updateTodo(id: ID!, text: String): Boolean
  }
  # ここにスキーマを書きます
`;

class TodoListAPI extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }
  initialize(config) {
    this.context = config.context;
  }
  async createTodo({ text: text }) {
    const todo = await this.store.todoList.findOrCreate({ where: { text } });
    return !!todo;
  }

  async updateTodo({ id: id, text: text }) {
    const updateTodo = await this.store.todoList.update(
      { text: text },
      {
        where: {
          id: id,
        },
      }
    );
    return !!updateTodo;
  }

  async deleteTodo({ id: id }) {
    const todo = await this.store.todoList.destroy({
      where: { id },
    });
    return !!todo;
  }

  async getTodoList() {
    const todoList = await this.store.todoList.findAll();
    return todoList;
  }
}

const resolvers = {
  Query: {
    todoList: async (_, __, { dataSources }) =>
      dataSources.todoListAPI.getTodoList(),
    // todoList: () => sampleTodoList,
  },
  Mutation: {
    createTodo: async (_, { text }, { dataSources }) => {
      return !!(await dataSources.todoListAPI.createTodo({ text }));
    },
    deleteTodo: async (_, { id }, { dataSources }) => {
      return !!(await dataSources.todoListAPI.deleteTodo({ id }));
    },
    updateTodo: async (_, { id, text }, { dataSources }) => {
      return !!(await dataSources.todoListAPI.updateTodo({ id, text }));
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    todoListAPI: new TodoListAPI({ store }),
  }),
});

server.listen().then(({ url }) => {
  console.log(`立ち上がったよ！${url}`);
});
