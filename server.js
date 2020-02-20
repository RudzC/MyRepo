const express = require("express");

const cors = require("cors");

const app = express();

const initializeDB = require("./db");

app.use(cors());

const start = async () => {
  const controller = await initializeDB();

  app.get("/users", async (req, res) => {
    const users = await controller.getUsers();
    res.json(users);
  });

  app.get("/users/add", async (req, res) => {
    const username = req.query.username;
    const password = req.query.password;

    let errors = [];
    if (username == "" || password == "") {
      errors.push({
        status: 403,
        error: true,
        message: "you cannot add a user without username and password"
      });
    }
    if (errors.length > 0) {
      res.json({ status: 403, error: true, message: errors });
    } else {
      try {
        const addUser = await controller.addUser({ username, password });
        res.json({
          id: addUser,
          username: username,
          password: password
        });
      } catch (err) {
        res.json({ status: 403, error: true, message: err.message });
      }
    }
  });
  app.get("/users/delete/:id", async (req, res) => {
    const id = req.params.id;
    try {
      const del = await controller.deleteItem(id);
      console.log(del);

      res.json(del);
    } catch (e) {
      res.json({ status: 403, error: true, message: e.message });
    }
  });
  app.get("/users/update/:id", async (req, res) => {
    const id = req.params.id;
    const { username, password } = req.query;

    try {
      const updateUser = await controller.updateUser(id, {
        username,
        password
      });
      res.json(updateUser);
    } catch (err) {
      res.json({ status: 403, error: true, message: err.message });
    }
  });
  app.get("/review", async (req, res) => {
    const review = await controller.getReviews();
    res.json(review);
  });
  app.get("/review/add", async (req, res) => {
    const username = req.query.username;
    const email = req.query.email;
    const review = req.query.review;

    let errors = [];
    if (username == "" || email == "" || review == "") {
      errors.push({
        status: 403,
        error: true,
        message:
          "you cannot submit new review without username, email and review"
      });
      if (errors.length > 0) {
        res.json({ status: 403, error: true, message: errors });
      } else {
        try {
          const addReview = await controller.addReview({
            username,
            email,
            review
          });
          res.json({
            revID: addReview,
            username: username,
            email: email,
            review: review
          });
        } catch (e) {
          res.json({ status: 403, error: true, message: e.message });
        }
      }
    }
  });
  app.get("/review/delete/:revID", async (req, res) => {
    const revID = req.params.revID;
    try {
      const deleteReview = await controller.deleteReview(revID);
      res.json({ deleteReview });
    } catch (e) {
      res.json({ status: 403, error: true, message: e.message });
    }
  });
};

app.listen(8080, () => console.log("listening on 8080..."));
start();
