// The users controller defines all user routes for the api, the route definitions are grouped together
// at the top of the file and the implementations are below.

const express = require("express");
const router = express.Router();
const userService = require("./user.service");

const login = async (req, res, next) => {
  userService
    .authenticate(req.body)
    .then((user) =>
      user
        ? res.json({
            data: user,
            message: `${user.username} login successfully!`,
          })
        : res
            .status(400)
            .json({ message: "Agent code or password is incorrect" })
    )
    .catch((err) => next(err));
};

const signUp = async (req, res, next) => {
  userService
    .create(req.body)
    .then((user) =>
      res.json({ data: user, message: "User created successfully!" })
    )
    .catch((err) => {
      next(err);
    });
};

const getAllUsers = async (req, res, next) => {
  userService
    .getAll()
    .then(() => res.json({}))
    .catch((err) => next(err));
};

const getCurrent = async (req, res, next) => {
  userService
    .getById(req.user.sub)
    .then((user) => (user ? res.json(user) : res.sendStatus(404)))
    .catch((err) => next(err));
};

const getByUserId = async (req, res, next) => {
  userService
    .getById(req.params.id)
    .then((user) => (user ? res.json(user) : res.sendStatus(404)))
    .catch((err) => next(err));
};

const updateUser = async (req, res, next) => {
  userService
    .update(req.params.id, req.body)
    .then(() => res.json({}))
    .catch((err) => next(err));
};

const _delete = async (req, res, next) => {
  userService
    .delete(req.params.id)
    .then(() => res.json({}))
    .catch((err) => next(err));
};

// routes
router.post("/login", login);
router.post("/sign-up", signUp);
router.get("/", getAllUsers);
router.get("/current", getCurrent);
router.get("/:id", getByUserId);
router.put("/:id", updateUser);
router.delete(":/id", _delete);

module.exports = router;
