const sqlite = require("sqlite");

const initializeDB = async () => {
  const db = await sqlite.open("./db.sqlite");

  const getUsers = async () => {
    const rows = db.all("Select * from users");
    return rows;
  };

  const addUser = async props => {
    const { username, password } = props;
    if (!props || !username || !password) {
      throw new Error(`You must provide a username and password`);
    }
    try {
      const addUser = await db.run(
        `Insert into users (username, password) values ('${username}', '${password}')`
      );
      return addUser.stmt.lastID;
    } catch (err) {
      err.message;
      console.log(err.message);
      throw new Error("This combination doesnt work");
    }
  };

  const deleteItem = async id => {
    try {
      const del = await db.run(`Delete from users where id = ${id}`);
      return del;
    } catch (err) {
      err.message;
      console.log(err.message);
      throw new Error("This combination doesnt work");
    }
  };

  const updateUser = async (id, props) => {
    const { username, password } = props;
    if (!props || (!props.username && !props.password)) {
      throw new Error("you must provide username and password");
    } else if (!id) {
      throw new Error("you must provide id");
    }
    let stmt = "";
    if (username && password) {
      stmt = `update users set username='${username}', password='${password}' where id='${id}'`;
    } else if (username && !password) {
      stmt = `update users set username='${username}' where id='${id}'`;
    } else if (!username && password) {
      stmt = `update users set password='${password}' where id='${id}'`;
    }
    try {
      const updateUser = await db.run(stmt);
      if (updateUser.stmt.changes == 0) {
        throw new Error(`users with id ${id} dont exist`);
      }
      return true;
    } catch (err) {
      throw new Error(`Could not update users with id ${id} ` + err);
    }
  };

  const getReviews = async () => {
    const review = await db.all("Select * from reviews");
    return review;
  };

  const addReview = async props => {
    const { username, email, review } = props;
    if (!props || !username || !email || !review) {
      throw new Error("you must provide a username, email & review");
    }
    try {
      const addReview = await db.run(
        `Insert into reviews (username, email, review) values ('${username}', '${email}', '${review}')`
      );
      return addReview.stmt.lastID;
    } catch (err) {
      err.message;
      console.log(err.message);
      throw new Error("this combination doesnt work");
    }
  };

  const deleteReview = async revID => {
    try {
      const deleteReview = await db.run(
        `Delete from reviews where revID=${revID}`
      );
      return deleteReview;
    } catch (err) {
      err.message;
      console.log(err.message);
      throw new Error("this combination doesnt work");
    }
  };

  const controller = {
    getUsers,
    addUser,
    deleteItem,
    updateUser,
    getReviews,
    addReview,
    deleteReview
  };
  return controller;
};

module.exports = initializeDB;
