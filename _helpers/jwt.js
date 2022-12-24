// The node JWT middleware checks that the JWT token received in the http request from the client
// is valid before allowing access to the API, if the token is invalid a "401 Unauthorized"
// response is sent to the client.

// JWT authentication is used on all routes except for the authenticate and register routes which are public.

const expressJwt = require("express-jwt");
const config = require("../config.json");
const userService = require("../users/user.service");

const jwt = () => {
  const secret = config.secret;
  return expressJwt({ secret, algorithms: ["HS256"], isRevoked }).unless({
    path: [
      // public routes that don't require authentication
      "/",
      "/users/login",
      "/users/sign-up",
    ],
  });
};

async function isRevoked(req, payload, done) {
  const user = await userService.getById(payload.sub);

  // revoke token if user no longer exists
  if (!user) {
    return done(null, true);
  }

  done();
}

module.exports = jwt;
