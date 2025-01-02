

//  register user
const registerUser = {
  tags: ["User"],
  description: "create the user account",
  requestBody: {
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            userName: {
              type: "string",
              description: "user name",
              example: "john"
            },
            email: {
              type: "string",
              description: "email",
              example: "john@gmail.com"
            },
            password: {
              type: "string",
              description: "password",
              example: "Ashu@321"
            },
            role: {
              type: "string",
              description: "role can be user(default) or admin",
              example: "admin"
            }
          }
        }
      }
    }
  },

  responses: {
    "200": {
      description: "ok",
      content: {
        "application/json": {
          schema: {
            type: "object",
            example: {
              success: "true",
              message: "User created successfully",
              token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJldfFpbCI6ImpvaG5AZ21haWwuY29tIiwiaWF0IjoxNzM1Nzk2OTM2LCJleHAiOjE3NDM1NzI5MzZ9.7ZyEWupGUu5iHQ_C5ruQdYmHy7Rw-4HL2LxfBfO9YvU"

            }
          }

        }
      }
    }
  }
}

// login user 

const loginUser = {
  tags: ["User"],
  description: "login user with email and password  you got otp on your email for verification", 
  requestBody: {
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            email: {
              type: "string",
              description: "email",
              example: "test@gmail.com"
            },
            password: {
              type: "string",
              description: "password",
              example: "Test@321"
            }
          }
        }
      }
    },
   
  },
}


const userDocsRoutes = {
  "/user/register": {
    post: registerUser
  },
  "/user/login": {
    post: loginUser
  }
  
}

export default userDocsRoutes;