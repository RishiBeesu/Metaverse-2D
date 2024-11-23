const { default: axios } = require("axios");

const BACKEND_URL = "http://localhost:3000";

describe("Authentication", () => {
  test("User able to signup only once", async () => {
    const username = `rishi-${Math.random()}-user`;
    const email = `rishi-${Math.floor(
      Math.random() * 10000000000
    )}user@gmail.com`;
    const password = "123456";
    let signupResponse;
    let reSignupResponse;
    try {
      signupResponse = await axios.post(`${BACKEND_URL}/api/v1/user/signup`, {
        username,
        email,
        password,
        role: "User",
      });
    } catch (e) {
      console.log(e.response);
    }
    expect(signupResponse.status).toBe(200);
    try {
      reSignupResponse = await axios.post(`${BACKEND_URL}/api/v1/user/signup`, {
        username,
        email,
        password,
        role: "User",
      });
    } catch (e) {
      reSignupResponse = e.response;
    }
    console.log(reSignupResponse);
    expect(reSignupResponse.status).toBe(400);
  });

  test("User unable to signup if fields are missing", async () => {
    const username = `rishi-${Math.random()}-user`;
    const email = `rishi-${Math.floor(
      Math.random() * 10000000000
    )}user@gmail.com`;
    const password = "123456";
    let usernameSignupResponse;
    let passwordSignupResponse;
    let emailSignupResponse;
    try {
      usernameSignupResponse = await axios.post(
        `${BACKEND_URL}/api/v1/user/signup`,
        {
          email,
          password,
          role: "User",
        }
      );
    } catch (e) {
      usernameSignupResponse = e.response;
    }
    expect(usernameSignupResponse.status).toBe(400);

    try {
      passwordSignupResponse = await axios.post(
        `${BACKEND_URL}/api/v1/user/signup`,
        {
          username,
          email,
          role: "User",
        }
      );
    } catch (e) {
      passwordSignupResponse = e.response;
    }
    expect(passwordSignupResponse.status).toBe(400);

    try {
      emailSignupResponse = await axios.post(
        `${BACKEND_URL}/api/v1/user/signup`,
        {
          username,
          password,
          role: "User",
        }
      );
    } catch (e) {
      emailSignupResponse = e.response;
    }
    expect(emailSignupResponse.status).toBe(400);
  });

  test("User able to signin using correct credentials", async () => {
    const username = `rishi-${Math.random()}-user`;
    const email = `rishi-${Math.floor(
      Math.random() * 10000000000
    )}user@gmail.com`;
    const password = "123456";
    let signupResponse;
    let signinResponse;
    try {
      signupResponse = await axios.post(`${BACKEND_URL}/api/v1/user/signup`, {
        username,
        email,
        password,
        role: "User",
      });
    } catch (e) {
      signupResponse = e.response;
    }
    try {
      signinResponse = await axios.post(`${BACKEND_URL}/api/v1/user/signin`, {
        username,
        password,
        role: "User",
      });
    } catch (e) {
      signinResponse = e.response;
    }
    expect(signinResponse.status).toBe(200);
    expect(signinResponse.data.token).toBeDefined();
  });

  test("User unable to signin with incorrect credentials", async () => {
    const username = `rishi-${Math.random()}-user`;
    const email = `rishi-${Math.floor(
      Math.random() * 10000000000
    )}user@gmail.com`;
    const password = "123456";
    let signupResponse;
    let signinResponse;
    try {
      signupResponse = await axios.post(`${BACKEND_URL}/api/v1/user/signup`, {
        username,
        email,
        password,
        role: "User",
      });
    } catch (e) {
      signupResponse = e.response;
    }
    try {
      signinResponse = await axios.post(`${BACKEND_URL}/api/v1/user/signin`, {
        username,
        password: "12345",
        role: "User",
      });
    } catch (e) {
      signinResponse = e.response;
    }
    expect(signinResponse.status).toBe(401);
  });

  test("User unable to signin if not present", async () => {
    let signinResponse;
    try {
      signinResponse = await axios.post(`${BACKEND_URL}/api/v1/user/signin`, {
        username: "random",
        password: "123456",
      });
    } catch (e) {
      signinResponse = e.response;
    }
    expect(signinResponse.status).toBe(404);
  });

  test("Admin able to signup only once", async () => {
    const username = `rishi-${Math.random()}-admin`;
    const email = `rishi-${Math.floor(
      Math.random() * 10000000000
    )}admin@gmail.com`;
    const password = "123456";
    let signupResponse;
    let reSignupResponse;
    try {
      signupResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/signup`, {
        username,
        email,
        password,
        role: "Admin",
      });
    } catch (e) {
      signupResponse = e.response;
    }
    expect(signupResponse.status).toBe(200);
    try {
      reSignupResponse = await axios.post(
        `${BACKEND_URL}/api/v1/admin/signup`,
        {
          username,
          email,
          password,
          role: "Admin",
        }
      );
    } catch (e) {
      reSignupResponse = e.response;
    }
    expect(reSignupResponse.status).toBe(400);
  });

  test("Admin unable to signup if fields are missing", async () => {
    const username = `rishi-${Math.random()}-admin`;
    const email = `rishi-${Math.floor(
      Math.random() * 10000000000
    )}admin@gmail.com`;
    const password = "123456";
    let usernameSignupResponse;
    let passwordSignupResponse;
    let emailSignupResponse;
    try {
      usernameSignupResponse = await axios.post(
        `${BACKEND_URL}/api/v1/admin/signup`,
        {
          email,
          password,
          role: "Admin",
        }
      );
    } catch (e) {
      usernameSignupResponse = e.response;
    }
    expect(usernameSignupResponse.status).toBe(400);

    try {
      passwordSignupResponse = await axios.post(
        `${BACKEND_URL}/api/v1/admin/signup`,
        {
          username,
          email,
          role: "Admin",
        }
      );
    } catch (e) {
      passwordSignupResponse = e.response;
    }
    expect(passwordSignupResponse.status).toBe(400);

    try {
      emailSignupResponse = await axios.post(
        `${BACKEND_URL}/api/v1/admin/signup`,
        {
          username,
          password,
          role: "Admin",
        }
      );
    } catch (e) {
      emailSignupResponse = e.response;
    }
    expect(emailSignupResponse.status).toBe(400);
  });

  test("Admin able to signin using correct credentials", async () => {
    const username = `rishi-${Math.random()}-admin`;
    const email = `rishi-${Math.floor(
      Math.random() * 10000000000
    )}admin@gmail.com`;
    const password = "123456";
    let signupResponse;
    let signinResponse;
    try {
      signupResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/signup`, {
        username,
        email,
        password,
        role: "Admin",
      });
    } catch (e) {
      signupResponse = e.response;
    }
    try {
      signinResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/signin`, {
        username,
        password,
        role: "Admin",
      });
    } catch (e) {
      signinResponse = e.response;
    }
    expect(signinResponse.status).toBe(200);
    expect(signinResponse.data.token).toBeDefined();
  });

  test("Admin unable to signin with incorrect credentials", async () => {
    const username = `rishi-${Math.random()}-admin`;
    const email = `rishi-${Math.floor(
      Math.random() * 10000000000
    )}admin@gmail.com`;
    const password = "123456";
    let signupResponse;
    let signinResponse;
    try {
      signupResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/signup`, {
        username,
        email,
        password,
        role: "Admin",
      });
    } catch (e) {
      signupResponse = e.response;
    }
    try {
      signinResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/signin`, {
        username,
        password: "12345",
        role: "Admin",
      });
    } catch (e) {
      signinResponse = e.response;
    }
    expect(signinResponse.status).toBe(401);
  });

  test("Admin unable to signin if not present", async () => {
    let signinResponse;
    try {
      signinResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/signin`, {
        username: "random",
        password: "123456",
      });
      console.log(signinResponse);
    } catch (e) {
      signinResponse = e.response;
    }
    expect(signinResponse.status).toBe(404);
  });
});
