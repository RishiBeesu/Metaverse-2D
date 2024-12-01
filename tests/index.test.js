const { default: axios, all } = require("axios");

const BACKEND_URL = "http://localhost:3000";

async function signupSigninAvatar() {
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

describe("Avatar choosing", () => {
  let userToken;
  let adminToken;
  let avatarId;
  let userId;
  let adminId;
  beforeAll(async () => {
    let { userTokenfn, adminTokenfn, avatarIdfn, userIdfn, adminIdfn } =
      await signupSigninAvatar();
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
      await signupSigninAvatar();
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

describe("Creating Elements", () => {
  let userToken;
  let adminToken;
  let avatarId;
  let userId;
  let adminId;

  beforeAll(async () => {
    let { userTokenfn, adminTokenfn, avatarIdfn, userIdfn, adminIdfn } =
      await signupSigninAvatar();
    userToken = userTokenfn;
    adminToken = adminTokenfn;
    avatarId = avatarIdfn;
    userId = userIdfn;
    adminId = adminIdfn;
  });

  test("Admin able to create element", async () => {
    let createElementResponse;
    try {
      createElementResponse = await axios.post(
        `${BACKEND_URL}/api/v1/admin/element`,
        {
          imageUrl:
            "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
          width: 1,
          height: 1,
          static: true,
        },
        {
          headers: {
            authorization: `Bearer ${adminToken}`,
          },
        }
      );
    } catch (e) {
      createElementResponse = e.response;
    }
    expect(createElementResponse.status).toBe(200);
  });

  test("Admin is able to update the imageUrl for an element", async () => {
    let createElementResponse;
    let updateElementResponse;
    try {
      createElementResponse = await axios.post(
        `${BACKEND_URL}/api/v1/admin/element`,
        {
          imageUrl:
            "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
          width: 1,
          height: 1,
          static: true,
        },
        {
          headers: {
            authorization: `Bearer ${adminToken}`,
          },
        }
      );

      updateElementResponse = await axios.put(
        `${BACKEND_URL}/api/v1/admin/element/${createElementResponse.data.id}`,
        {
          imageUrl:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
        },
        {
          headers: {
            authorization: `Bearer ${adminToken}`,
          },
        }
      );
    } catch (e) {
      createElementResponse = e.response;
      updateElementResponse = e.response;
    }
    expect(updateElementResponse.status).toBe(200);
  });
});

describe("Creating Map", () => {
  let userToken;
  let adminToken;
  let avatarId;
  let userId;
  let adminId;
  let element1Id;
  let element2Id;

  beforeAll(async () => {
    let { userTokenfn, adminTokenfn, avatarIdfn, userIdfn, adminIdfn } =
      await signupSigninAvatar();
    userToken = userTokenfn;
    adminToken = adminTokenfn;
    avatarId = avatarIdfn;
    userId = userIdfn;
    adminId = adminIdfn;
    let element1Response;
    let element2Response;
    try {
      element1Response = await axios.post(
        `${BACKEND_URL}/api/v1/admin/element`,
        {
          imageUrl:
            "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
          width: 1,
          height: 1,
          static: true,
        },
        {
          headers: {
            authorization: `Bearer ${adminTokenfn}`,
          },
        }
      );
      element2Response = await axios.post(
        `${BACKEND_URL}/api/v1/admin/element`,
        {
          imageUrl:
            "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
          width: 1,
          height: 1,
          static: true,
        },
        {
          headers: {
            authorization: `Bearer ${adminTokenfn}`,
          },
        }
      );
    } catch (e) {
      element1Response = e.response;
      element2Response = e.response;
    }
    element1Id = element1Response.data.id;
    element2Id = element2Response.data.id;
  });

  test("Admin able to create map", async () => {
    let createMapResponse;
    try {
      createMapResponse = await axios.post(
        `${BACKEND_URL}/api/v1/admin/map`,
        {
          thumbnail: "https://thumbnail.com/a.png",
          width: 200,
          height: 100,
          name: "Test space",
          defaultElements: [
            {
              elementId: element1Id,
              x: 20,
              y: 20,
            },
            {
              elementId: element1Id,
              x: 18,
              y: 20,
            },
            {
              elementId: element2Id,
              x: 19,
              y: 20,
            },
          ],
        },
        {
          headers: {
            authorization: `Bearer ${adminToken}`,
          },
        }
      );
    } catch (e) {
      createMapResponse = e.response;
    }
    expect(createMapResponse.status).toBe(200);
  });
});

describe("Space Information", () => {
  let userToken;
  let adminToken;
  let avatarId;
  let userId;
  let adminId;
  let element1Id;
  let element2Id;
  let mapId;

  beforeAll(async () => {
    let { userTokenfn, adminTokenfn, avatarIdfn, userIdfn, adminIdfn } =
      await signupSigninAvatar();
    userToken = userTokenfn;
    adminToken = adminTokenfn;
    avatarId = avatarIdfn;
    userId = userIdfn;
    adminId = adminIdfn;
    let element1Response;
    let element2Response;
    try {
      element1Response = await axios.post(
        `${BACKEND_URL}/api/v1/admin/element`,
        {
          imageUrl:
            "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
          width: 1,
          height: 1,
          static: true,
        },
        {
          headers: {
            authorization: `Bearer ${adminTokenfn}`,
          },
        }
      );
      element2Response = await axios.post(
        `${BACKEND_URL}/api/v1/admin/element`,
        {
          imageUrl:
            "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
          width: 1,
          height: 1,
          static: true,
        },
        {
          headers: {
            authorization: `Bearer ${adminTokenfn}`,
          },
        }
      );
    } catch (e) {
      element1Response = e.response;
      element2Response = e.response;
    }
    element1Id = element1Response.data.id;
    element2Id = element2Response.data.id;
    let createMapResponse;
    try {
      createMapResponse = await axios.post(
        `${BACKEND_URL}/api/v1/admin/map`,
        {
          thumbnail: "https://thumbnail.com/a.png",
          width: 200,
          height: 100,
          name: "Test space",
          defaultElements: [
            {
              elementId: element1Id,
              x: 20,
              y: 20,
            },
            {
              elementId: element1Id,
              x: 18,
              y: 20,
            },
            {
              elementId: element2Id,
              x: 19,
              y: 20,
            },
          ],
        },
        {
          headers: {
            authorization: `Bearer ${adminToken}`,
          },
        }
      );
    } catch (e) {
      createMapResponse = e.response;
    }
    mapId = createMapResponse.data.id;
  });

  test("User is able to create a space", async () => {
    let createSpaceResponse;
    try {
      createSpaceResponse = await axios.post(
        `${BACKEND_URL}/api/v1/space`,
        {
          name: "Test",
          width: 200,
          height: 100,
          mapId: mapId,
        },
        {
          headers: {
            authorization: `Bearer ${userToken}`,
          },
        }
      );
    } catch (e) {
      createSpaceResponse = e.response;
    }

    expect(createSpaceResponse.status).toBe(200);
    expect(createSpaceResponse.data.spaceId).toBeDefined();
  });

  test("User is able to create a space without mapId (empty space)", async () => {
    let createSpaceResponse;
    try {
      createSpaceResponse = await axios.post(
        `${BACKEND_URL}/api/v1/space`,
        {
          name: "Test",
          width: 200,
          height: 100,
        },
        {
          headers: {
            authorization: `Bearer ${userToken}`,
          },
        }
      );
    } catch (e) {
      createSpaceResponse = e.response;
    }

    expect(createSpaceResponse.status).toBe(200);
    expect(createSpaceResponse.data.spaceId).toBeDefined();
  });

  test("User is not able to create a space without mapId and dimensions", async () => {
    let createSpaceResponse;
    try {
      createSpaceResponse = await axios.post(
        `${BACKEND_URL}/api/v1/space`,
        {
          name: "Test",
        },
        {
          headers: {
            authorization: `Bearer ${userToken}`,
          },
        }
      );
    } catch (e) {
      createSpaceResponse = e.response;
    }
    expect(createSpaceResponse.status).toBe(400);
  });

  test("User is not able to delete a space that doesnt exist", async () => {
    let deleteSpaceResponse;
    try {
      deleteSpaceResponse = await axios.delete(
        `${BACKEND_URL}/api/v1/space/randomSpaceId`,
        {
          headers: {
            authorization: `Bearer ${userToken}`,
          },
        }
      );
    } catch (e) {
      deleteSpaceResponse = e.response;
    }

    expect(deleteSpaceResponse.status).toBe(400);
  });

  test("User is able to delete a space that does exist", async () => {
    let createSpaceResponse;
    let deleteSpaceResponse;
    try {
      createSpaceResponse = await axios.post(
        `${BACKEND_URL}/api/v1/space`,
        {
          name: "Test",
          width: 200,
          height: 100,
        },
        {
          headers: {
            authorization: `Bearer ${userToken}`,
          },
        }
      );

      deleteSpaceResponse = await axios.delete(
        `${BACKEND_URL}/api/v1/space/${createSpaceResponse.data.spaceId}`,
        {
          headers: {
            authorization: `Bearer ${userToken}`,
          },
        }
      );
    } catch (e) {
      createSpaceResponse = e.response;
      deleteSpaceResponse = e.response;
    }

    expect(deleteSpaceResponse.status).toBe(200);
  });

  test("User should not be able to delete a space created by another user", async () => {
    let createSpaceResponse;
    let deleteSpaceResponse;
    try {
      createSpaceResponse = await axios.post(
        `${BACKEND_URL}/api/v1/space`,
        {
          name: "Test",
          width: 200,
          height: 100,
        },
        {
          headers: {
            authorization: `Bearer ${userToken}`,
          },
        }
      );

      deleteSpaceResponse = await axios.delete(
        `${BACKEND_URL}/api/v1/space/${createSpaceResponse.data.spaceId}`,
        {
          headers: {
            authorization: `Bearer ${adminToken}`,
          },
        }
      );
    } catch (e) {
      createSpaceResponse = e.response;
      deleteSpaceResponse = e.response;
    }

    expect(deleteSpaceResponse.status).toBe(403);
  });

  test("Admin has no spaces initially", async () => {
    let numberOfSpacesResponse;
    try {
      numberOfSpacesResponse = await axios.get(
        `${BACKEND_URL}/api/v1/space/all`,
        {
          headers: {
            authorization: `Bearer ${adminToken}`,
          },
        }
      );
    } catch (e) {
      numberOfSpacesResponse = e.response;
    }

    expect(numberOfSpacesResponse.data.spaces.length).toBe(0);
  });

  test("Admin gets once space after", async () => {
    let createSpaceResponse;
    let numberOfSpacesResponse;
    try {
      createSpaceResponse = await axios.post(
        `${BACKEND_URL}/api/v1/space`,
        {
          name: "Test",
          width: 200,
          height: 100,
        },
        {
          headers: {
            authorization: `Bearer ${adminToken}`,
          },
        }
      );
      numberOfSpacesResponse = await axios.get(
        `${BACKEND_URL}/api/v1/space/all`,
        {
          headers: {
            authorization: `Bearer ${adminToken}`,
          },
        }
      );
    } catch (e) {
      numberOfSpacesResponse = e.response;
      createSpaceResponse = e.response;
    }

    const filteredSpace = numberOfSpacesResponse.data.spaces.find(
      (x) => x.id == createSpaceResponse.data.spaceId
    );
    expect(numberOfSpacesResponse.data.spaces.length).toBe(1);
    expect(filteredSpace).toBeDefined();
  });
});

describe("Arena Endpoints", () => {
  let userToken;
  let adminToken;
  let avatarId;
  let userId;
  let adminId;
  let element1Id;
  let element2Id;
  let mapId;
  let spaceId;

  beforeAll(async () => {
    let { userTokenfn, adminTokenfn, avatarIdfn, userIdfn, adminIdfn } =
      await signupSigninAvatar();
    userToken = userTokenfn;
    adminToken = adminTokenfn;
    avatarId = avatarIdfn;
    userId = userIdfn;
    adminId = adminIdfn;
    let element1Response;
    let element2Response;
    try {
      element1Response = await axios.post(
        `${BACKEND_URL}/api/v1/admin/element`,
        {
          imageUrl:
            "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
          width: 1,
          height: 1,
          static: true,
        },
        {
          headers: {
            authorization: `Bearer ${adminTokenfn}`,
          },
        }
      );
      element2Response = await axios.post(
        `${BACKEND_URL}/api/v1/admin/element`,
        {
          imageUrl:
            "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
          width: 1,
          height: 1,
          static: true,
        },
        {
          headers: {
            authorization: `Bearer ${adminTokenfn}`,
          },
        }
      );
    } catch (e) {
      element1Response = e.response;
      element2Response = e.response;
    }
    element1Id = element1Response.data.id;
    element2Id = element2Response.data.id;
    let createMapResponse;
    try {
      createMapResponse = await axios.post(
        `${BACKEND_URL}/api/v1/admin/map`,
        {
          thumbnail: "https://thumbnail.com/a.png",
          width: 200,
          height: 100,
          name: "Test space",
          defaultElements: [
            {
              elementId: element1Id,
              x: 20,
              y: 20,
            },
            {
              elementId: element1Id,
              x: 18,
              y: 20,
            },
            {
              elementId: element2Id,
              x: 19,
              y: 20,
            },
          ],
        },
        {
          headers: {
            authorization: `Bearer ${adminToken}`,
          },
        }
      );
    } catch (e) {
      createMapResponse = e.response;
    }
    mapId = createMapResponse.data.id;
    let createSpaceResponse;
    try {
      createSpaceResponse = await axios.post(
        `${BACKEND_URL}/api/v1/space`,
        {
          name: "Test",
          width: 200,
          height: 100,
          mapId: mapId,
        },
        {
          headers: {
            authorization: `Bearer ${userToken}`,
          },
        }
      );
    } catch (e) {
      createSpaceResponse = e.response;
    }
    spaceId = createSpaceResponse.data.spaceId;
  });

  test("Incorrect spaceId returns a 400", async () => {
    let getSpaceResponse;
    try {
      getSpaceResponse = await axios.get(
        `${BACKEND_URL}/api/v1/space/123kasdk01`,
        {
          headers: {
            authorization: `Bearer ${userToken}`,
          },
        }
      );
    } catch (e) {
      getSpaceResponse = e.response;
    }

    expect(getSpaceResponse.status).toBe(400);
  });

  test("Correct spaceId returns all the elements", async () => {
    let getSpaceResponse;
    try {
      getSpaceResponse = await axios.get(
        `${BACKEND_URL}/api/v1/space/${spaceId}`,
        {
          headers: {
            authorization: `Bearer ${userToken}`,
          },
        }
      );
    } catch (e) {
      getSpaceResponse = e.response;
    }
    expect(getSpaceResponse.data.width).toBe(200);
    expect(getSpaceResponse.data.height).toBe(100);
    expect(getSpaceResponse.data.elements.length).toBe(3);
  });

  test("Delete endpoint is able to delete an element", async () => {
    let getSpaceResponse;
    let deleteElementResponse;
    let getSpaceAfterDeleteResponse;
    try {
      getSpaceResponse = await axios.get(
        `${BACKEND_URL}/api/v1/space/${spaceId}`,
        {
          headers: {
            authorization: `Bearer ${userToken}`,
          },
        }
      );

      deleteElementResponse = await axios.delete(
        `${BACKEND_URL}/api/v1/space/element/${getSpaceResponse.data.elements[0].id}`,
        {
          headers: {
            authorization: `Bearer ${userToken}`,
          },
        }
      );

      getSpaceAfterDeleteResponse = await axios.get(
        `${BACKEND_URL}/api/v1/space/${spaceId}`,
        {
          headers: {
            authorization: `Bearer ${userToken}`,
          },
        }
      );
    } catch (e) {
      getSpaceResponse = e.response;
      deleteElementResponse = e.response;
      getSpaceAfterDeleteResponse = e.response;
    }

    expect(getSpaceAfterDeleteResponse.data.elements.length).toBe(2);
  });

  test("Adding an element fails if the element lies outside the dimensions", async () => {
    let addElementResponse;
    try {
      addElementResponse = await axios.post(
        `${BACKEND_URL}/api/v1/space/element`,
        {
          elementId: element1Id,
          spaceId: spaceId,
          x: 10000,
          y: 210000,
        },
        {
          headers: {
            authorization: `Bearer ${userToken}`,
          },
        }
      );
    } catch (e) {
      addElementResponse = e.response;
    }

    expect(addElementResponse.status).toBe(400);
  });

  test("Adding an element works as expected", async () => {
    let beforeAddSpace;
    let addElementResponse;
    let getSpaceResponse;
    try {
      beforeAddSpace = await axios.get(
        `${BACKEND_URL}/api/v1/space/${spaceId}`,
        {
          headers: {
            authorization: `Bearer ${userToken}`,
          },
        }
      );

      addElementResponse = await axios.post(
        `${BACKEND_URL}/api/v1/space/element`,
        {
          elementId: element1Id,
          spaceId: spaceId,
          x: 50,
          y: 20,
        },
        {
          headers: {
            authorization: `Bearer ${userToken}`,
          },
        }
      );

      getSpaceResponse = await axios.get(
        `${BACKEND_URL}/api/v1/space/${spaceId}`,
        {
          headers: {
            authorization: `Bearer ${userToken}`,
          },
        }
      );
    } catch (e) {
      addElementResponse = e.response;
      getSpaceResponse = e.response;
    }
    expect(getSpaceResponse.data.elements.length).toBe(3);
  });
});

describe("User Restictions", () => {
  let userToken;
  let adminToken;
  let avatarId;
  let userId;
  let adminId;

  beforeAll(async () => {
    let { userTokenfn, adminTokenfn, avatarIdfn, userIdfn, adminIdfn } =
      await signupSigninAvatar();
    userToken = userTokenfn;
    adminToken = adminTokenfn;
    avatarId = avatarIdfn;
    userId = userIdfn;
    adminId = adminIdfn;
  });

  test("User is not able to hit admin Endpoints", async () => {
    let createElementResponse;
    let createMapResponse;
    let createAvatarResponse;
    let updateElementResponse;
    try {
      createElementResponse = await axios.post(
        `${BACKEND_URL}/api/v1/admin/element`,
        {
          imageUrl:
            "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
          width: 1,
          height: 1,
          static: true,
        },
        {
          headers: {
            authorization: `Bearer ${userToken}`,
          },
        }
      );

      createMapResponse = await axios.post(
        `${BACKEND_URL}/api/v1/admin/map`,
        {
          thumbnail: "https://thumbnail.com/a.png",
          dimensions: "100x200",
          name: "test space",
          defaultElements: [],
        },
        {
          headers: {
            authorization: `Bearer ${userToken}`,
          },
        }
      );

      createAvatarResponse = await axios.post(
        `${BACKEND_URL}/api/v1/admin/avatar`,
        {
          imageUrl:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
          name: "Timmy",
        },
        {
          headers: {
            authorization: `Bearer ${userToken}`,
          },
        }
      );

      updateElementResponse = await axios.put(
        `${BACKEND_URL}/api/v1/admin/element/123`,
        {
          imageUrl:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
        },
        {
          headers: {
            authorization: `Bearer ${userToken}`,
          },
        }
      );
    } catch (e) {
      createElementResponse = e.response;
      createMapResponse = e.response;
      createMapResponse = e.response;
      updateElementResponse = e.response;
    }

    expect(createElementResponse.status).toBe(403);
    expect(createMapResponse.status).toBe(403);
    expect(createMapResponse.status).toBe(403);
    expect(updateElementResponse.status).toBe(403);
  });

  test("Admin is able to hit admin Endpoints", async () => {
    let createElementResponse;
    let createMapResponse;
    let createAvatarResponse;
    try {
      createElementResponse = await axios.post(
        `${BACKEND_URL}/api/v1/admin/element`,
        {
          imageUrl:
            "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
          width: 1,
          height: 1,
          static: true,
        },
        {
          headers: {
            authorization: `Bearer ${adminToken}`,
          },
        }
      );

      createMapResponse = await axios.post(
        `${BACKEND_URL}/api/v1/admin/map`,
        {
          thumbnail: "https://thumbnail.com/a.png",
          name: "Space",
          width: 200,
          height: 100,
          defaultElements: [],
        },
        {
          headers: {
            authorization: `Bearer ${adminToken}`,
          },
        }
      );

      createAvatarResponse = await axios.post(
        `${BACKEND_URL}/api/v1/admin/avatar`,
        {
          imageUrl:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
          name: `Timmy-${Math.random()}`,
        },
        {
          headers: {
            authorization: `Bearer ${adminToken}`,
          },
        }
      );
    } catch (e) {
      // createElementResponse = e.response;
      // createMapResponse = e.response;
      // createAvatarResponse = e.response;
    }

    expect(createElementResponse.status).toBe(200);
    expect(createMapResponse.status).toBe(200);
    expect(createAvatarResponse.status).toBe(200);
  });
});
