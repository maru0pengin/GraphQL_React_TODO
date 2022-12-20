const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = new Sequelize("sqlite::memory:");

const User = sequelize.define("user", {
  name: DataTypes.TEXT,
  favoriteColor: {
    type: DataTypes.TEXT,
    defaultValue: "green",
  },
  age: DataTypes.INTEGER,
  cash: DataTypes.INTEGER,
});

(async () => {
  await sequelize.sync({ force: true });

  const jane = User.build({ name: "Jane" });
  console.log(jane instanceof User); // true
  console.log(jane.name); // "Jane"
  await jane.save();
  console.log("Jane was saved to the database!");

  await User.create({ name: "tatata" });
  const users = await User.findAll();
  console.log(users);
})();
