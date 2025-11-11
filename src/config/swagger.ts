export default {
  openapi: "3.0.0",
  info: {
    title: "Todo API",
    version: "1.0.0",
    description: "REST API for managing todos with JWT authentication",
  },
  servers: [
    {
      url: "http://localhost:3000/api",
      description: "Development server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  paths: {
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", example: "test@example.com" },
                  password: { type: "string", example: "password123" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "User created successfully" },
          "400": { description: "Validation error" },
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", example: "test@example.com" },
                  password: { type: "string", example: "password123" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Login successful" },
          "401": { description: "Invalid credentials" },
        },
      },
    },
    "/todos": {
      get: {
        tags: ["Todos"],
        summary: "Get all todos",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "List of todos" },
          "401": { description: "Unauthorized" },
        },
      },
      post: {
        tags: ["Todos"],
        summary: "Create a new todo",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title"],
                properties: {
                  title: { type: "string", example: "Buy groceries" },
                  description: { type: "string", example: "Milk, eggs" },
                  completed: { type: "boolean", example: false },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Todo created successfully" },
          "400": { description: "Validation error" },
        },
      },
    },
    "/todos/{id}": {
      get: {
        tags: ["Todos"],
        summary: "Get todo by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": { description: "Todo details" },
          "404": { description: "Todo not found" },
        },
      },
      patch: {
        tags: ["Todos"],
        summary: "Update todo",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  completed: { type: "boolean" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Todo updated successfully" },
          "404": { description: "Todo not found" },
        },
      },
      delete: {
        tags: ["Todos"],
        summary: "Delete todo",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "204": { description: "Todo deleted successfully" },
          "404": { description: "Todo not found" },
        },
      },
    },
  },
};
