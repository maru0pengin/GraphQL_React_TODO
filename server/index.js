const { ApolloServer } = require("apollo-server");
const { gql } = require("apollo-server");
const { DataSource } = require("apollo-datasource");
const { Sequelize, DataTypes } = require("sequelize");

// スキーマの定義 ----------
const typeDefs = gql`
  type Query {
    todoList: [todo]
  }
  type Mutation {
    createTodo(text: String): todo
    deleteTodo(id: ID!): Boolean
    updateTodo(id: ID!, text: String): Boolean
  }
  type todo {
    id: ID!
    text: String
  }
`;

// DBの初期化--------------
const createStore = () => {
  const db = new Sequelize({
    dialect: "sqlite",
    storage: "./store.sqlite",
  });

  const todoList = db.define("todo", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    text: DataTypes.TEXT,
  });
  return { db, todoList };
};
const store = createStore();
// tableの作成
store.todoList.sync();

// データとの繋ぎ込み -------
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
    return todo[0];
  }
  async updateTodo({ id: id, text: text }) {
    const updateTodo = await this.store.todoList.update(
      { text: text },
      { where: { id: id } }
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
    return await this.store.todoList.findAll();
  }
}
// リゾルバの定義 ----------
const resolvers = {
  Query: {
    todoList: async (_, __, { dataSources }) =>
      dataSources.todoListAPI.getTodoList(),
  },
  Mutation: {
    createTodo: async (_, { text }, { dataSources }) => {
      return await dataSources.todoListAPI.createTodo({ text });
    },
    deleteTodo: async (_, { id }, { dataSources }) => {
      return !!(await dataSources.todoListAPI.deleteTodo({ id }));
    },
    updateTodo: async (_, { id, text }, { dataSources }) => {
      return !!(await dataSources.todoListAPI.updateTodo({ id, text }));
    },
  },
};

// ApolloServerのインスタンス作成
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    todoListAPI: new TodoListAPI({ store }),
  }),
});
// サーバーを走らせる
server.listen().then(({ url }) => {
  console.log(`立ち上がったよ！${url}`);
});
