import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "mi_clave_secreta";

const app = express();
const prisma = new PrismaClient();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Token requerido",
    });
  }

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Formato de token inválido",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    jwt.verify(token, SECRET_KEY);
    next();
  } catch (error) {
    return res.status(403).json({
      message: "Token inválido o expirado",
    });
  }
};

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.get("/private", verifyToken, (_req: Request, res: Response) => {
  res.json({
    message: "Acceso permitido",
  });
});

app.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "123456") {
    const token = jwt.sign(
      { username },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    return res.json({
      message: "Login successful",
      token,
    });
  }

  return res.status(401).json({
    message: "Invalid credentials",
  });
});

app.get("/tasks", async (req, res) => {
  try {
    const tasks = await prisma.task.findMany();
    res.json(tasks);
  } catch (error) {
    console.error("Error GET /tasks:", error);
    res.status(500).json({ error: "Error al obtener tareas" });
  }
});

app.post("/tasks", async (req, res) => {
  try {
    const { text } = req.body;

    const newTask = await prisma.task.create({
      data: {
        text: text.trim(),
        completed: false,
      },
    });

    res.json(newTask);
  } catch (error) {
    console.error("Error POST /tasks:", error);
    res.status(500).json({ error: "Error al crear tarea" });
  }
});

app.put("/tasks/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        completed: req.body.completed,
      },
    });

    res.json(updatedTask);
  } catch (error) {
    console.error("Error PUT /tasks:", error);
    res.status(500).json({ error: "Error al actualizar tarea" });
  }
});

app.delete("/tasks/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.task.delete({
      where: { id },
    });

    res.json({ message: "Tarea eliminada" });
  } catch (error) {
    console.error("Error DELETE /tasks:", error);
    res.status(500).json({ error: "Error al eliminar tarea" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});