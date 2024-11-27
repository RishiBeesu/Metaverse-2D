const { default: axios, all } = require("axios");

const BACKEND_URL = "http://localhost:3000";

async function setupHTTP() {
  let userTokenfn;
  let adminTokenfn;
  let avatarIdfn;
  let userIdfn;
  let adminIdfn;
  const userUsername = `rishi-${Math.random()}-user`;
  const userEmail = `rishi-${Math.random()}-user@gmail.com`;
  const userPassword = "userPassword";
  const adminUsername = `rishi-${Math.random()}-admin`;
  const adminEmail = `rishi-${Math.random()}-admin@gmai.com`;
  const adminPassword = "adminPassword";
  let userSignupResponse;
  let adminSignupResponse;
  let userSigninResponse;
  let adminSigninResponse;
  let avatarIdResponse;
  try {
    userSignupResponse = await axios.post(`${BACKEND_URL}/api/v1/user/signup`, {
      username: userUsername,
      email: userEmail,
      password: userPassword,
      role: "User",
    });
  } catch (e) {
    userSignupResponse = e.response;
  }
  try {
    adminSignupResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/signup`,
      {
        username: adminUsername,
        email: adminEmail,
        password: adminPassword,
        role: "Admin",
      }
    );
  } catch (e) {
    adminSignupResponse = e.response;
  }
  try {
    userSigninResponse = await axios.post(`${BACKEND_URL}/api/v1/user/signin`, {
      username: userUsername,
      password: userPassword,
    });
  } catch (e) {
    userSigninResponse = e.response;
  }
  try {
    adminSigninResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/signin`,
      {
        username: adminUsername,
        password: adminPassword,
      }
    );
  } catch (e) {
    adminSigninResponse = e.response;
  }
  userIdfn = userSignupResponse.data.userId;
  userTokenfn = userSigninResponse.data.token;
  adminIdfn = adminSignupResponse.data.userId;
  adminTokenfn = adminSigninResponse.data.token;
  try {
    avatarIdResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/avatar`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
        name: `Timmy-${Math.random()}`,
      },
      {
        headers: {
          authorization: `Bearer ${adminTokenfn}`,
        },
      }
    );
  } catch (e) {
    avatarIdResponse = e.response;
  }
  avatarIdfn = avatarIdResponse.data.avatarId;
  return {
    userTokenfn,
    adminTokenfn,
    avatarIdfn,
    userIdfn,
    adminIdfn,
  };
} // needs userToken, adminToken, avatarId, userId, adminId

describe.skip("Authentication", () => {
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
    } catch (e) {
      signinResponse = e.response;
    }
    expect(signinResponse.status).toBe(404);
  });
});

describe.skip("Avatar choosing", () => {
  let userToken;
  let adminToken;
  let avatarId;
  let userId;
  let adminId;
  beforeAll(async () => {
    let { userTokenfn, adminTokenfn, avatarIdfn, userIdfn, adminIdfn } =
      await setupHTTP();
    userToken = userTokenfn;
    adminToken = adminTokenfn;
    avatarId = avatarIdfn;
    userId = userIdfn;
    adminId = adminIdfn;
  });

  test("Able to choose avatar if avatarId is legit", async () => {
    let userAvatarResponse;
    try {
      userAvatarResponse = await axios.post(
        `${BACKEND_URL}/api/v1/user/metadata`,
        {
          avatarId,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
    } catch (e) {
      userAvatarResponse = e.response;
    }
    expect(userAvatarResponse.status).toBe(200);
  });

  test("Not able to choose avatar if avatarId is not legit", async () => {
    let avatarIdResponse;
    try {
      avatarIdResponse = await axios.post(
        `${BACKEND_URL}/api/v1/user/metadata`,
        {
          avatarId: "random",
        },
        {
          headers: {
            authorization: `Bearer ${userToken}`,
          },
        }
      );
    } catch (e) {
      avatarIdResponse = e.response;
    }
    expect(avatarIdResponse.status).toBe(404);
  });

  test("Not able to choose avatat if no auth header is present", async () => {
    let avatarIdResponse;
    try {
      avatarIdResponse = await axios.post(
        `${BACKEND_URL}/api/v1/user/metadata`,
        {
          avatarId,
        }
      );
    } catch (e) {
      avatarIdResponse = e.response;
    }
    expect(avatarIdResponse.status).toBe(403);
  });
});

describe("Avatar Information", () => {
  let userToken;
  let adminToken;
  let avatarId;
  let userId;
  let adminId;

  beforeAll(async () => {
    let { userTokenfn, adminTokenfn, avatarIdfn, userIdfn, adminIdfn } =
      await setupHTTP();
    userToken = userTokenfn;
    adminToken = adminTokenfn;
    avatarId = avatarIdfn;
    userId = userIdfn;
    adminId = adminIdfn;
  });

  test("Getting avatar information of required user", async () => {
    let reqAvatarResponse;
    try {
      reqAvatarResponse = await axios.get(
        `${BACKEND_URL}/api/v1/user/metadata/bulk?ids=[${userId}]`
      );
    } catch (e) {
      reqAvatarResponse = e.response;
    }
    expect(reqAvatarResponse.data.avatars.length).toBe(1);
    expect(reqAvatarResponse.data.avatars[0].userId).toBe(userId);
  });

  test("All avatars contain recently created avatar", async () => {
    let allAvatarResponse;
    try {
      allAvatarResponse = await axios.get(`${BACKEND_URL}/api/v1/avatars`);
    } catch (e) {
      allAvatarResponse = e.response;
    }
    expect(allAvatarResponse.data.avatars.length).not.toBe(0);
    const currentAvatar = allAvatarResponse.data.avatars.find(
      (avatar) => avatar.id === avatarId
    );
    expect(currentAvatar).toBeDefined();
  });
});
