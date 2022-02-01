module.exports = {
  trailingSlash: true,
  env: {
    TEST_IF_WORKS_ENV_VAR: process.env.TEST_IF_WORKS_ENV_VAR,
    REDIRECT_URI: process.env.REDIRECT_URI,
    POST_LOGOUT_REDIRECT_URI: process.env.POST_LOGOUT_REDIRECT_URI,
    SIGNUP_SIGNIN_POLICY: process.env.SIGNUP_SIGNIN_POLICY,
    RESET_PASS_POLICY: process.env.RESET_PASS_POLICY,
    EDIT_PROFILE_POLICY: process.env.EDIT_PROFILE_POLICY,
    AUTHORITY_DOMAIN: process.env.AUTHORITY_DOMAIN,
    POLICY_DOMAIN: process.env.POLICY_DOMAIN,
    AUTH_CLIEND_ID: process.env.AUTH_CLIEND_ID,
  },
  exportPathMap: async function () {
    const paths = {
      "/": { page: "/" },
      "/login": { page: "/login" },
      "/getting-started": { page: "/getting-started" },
      "/recent-jobs": { page: "/recent-jobs" },
      "/account": { page: "/account" },
      "/usage": { page: "/usage" },
      "/access-token": { page: "/access-token" },
    };

    return paths;
  },
};
