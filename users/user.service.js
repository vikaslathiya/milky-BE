// The user service contains the core business logic for user authentication and management in
// the node api, it encapsulates all interaction with the mongoose user model and exposes a
// simple set of methods which are used by the users controller below.

// The top of the file contains the service method definitions so it's
// easy to see all methods at a glance, the rest of the file contains the
// method implementations.

const config = require("../config.json");
const jwtWebToken = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const db = require("../_helpers/db");
const User = db.User;

module.exports = {
  authenticate,
  getAll,
  getById,
  create,
  update,
  delete: _delete,
};

async function authenticate({ agentCode, password }) {
  const user = await User.findOne({ agentCode });

  if (user && bcryptjs.compareSync(password, user.hash)) {
    const token = jwtWebToken.sign({ sub: user.id }, config.secret, {
      expiresIn: "30d",
    });
    return {
      ...user.toJSON(),
      token,
    };
  }
}

async function getAll() {
  return await User.find();
}

async function getById(id) {
  return await User.findById(id);
}

async function create(userParam) {
  // validate
  if (await User.findOne({ username: userParam.username })) {
    throw `Username ${userParam.username} is already taken`;
  }

  const user = new User(userParam);

  // hash password
  if (userParam.password) {
    user.hash = bcryptjs.hashSync(userParam.password, 10);
  }

  // create code
  const allUsers = await User.find();
  const agentCode = allUsers[allUsers.length - 1]
    ? allUsers[allUsers.length - 1].agentCode + 1
    : 1001;
  user.agentCode = agentCode;

  // save user
  await user.save();

  const login = await authenticate({
    agentCode: agentCode,
    password: userParam.password,
  });

  return login;
}

async function update(id, userParam) {
  const user = await User.findById(id);

  // validate
  if (!user) throw "User not found";

  if (
    user.username !== userParam.username &&
    (await User.findOne({ username: userParam.username }))
  ) {
    throw `Username ${userParam.username} is already taken`;
  }

  // hash password if it was entered
  if (userParam.password) {
    userParam.hash = bcryptjs.hashSync(userParam.password, 10);
  }

  // copy userParam properties to user
  Object.assign(user, userParam);

  await user.save();
}

async function _delete(id) {
  await User.findByIdAndRemove(id);
}
