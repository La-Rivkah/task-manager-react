import "dotenv/config";
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// 🔹 Test server
app.get("/", (req, res) => {
  res.send("Backend is running");
});


// 🔹 GET tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await prisma.task.findMany();
    res.json(tasks);
  } catch (error) {
    console.error("Error GET /tasks:", error);
    res.status(500).json({ error: "Error al obtener tareas" });
  }
});


// 🔹 CREATE task
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


// 🔹 UPDATE task (toggle completed)
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


// 🔹 DELETE task
app.delete("/tasks/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.task.delete({
      where: { id },
    });

    res.json({ message: "Tarea eliminada ✅" });
  } catch (error) {
    console.error("Error DELETE /tasks:", error);
    res.status(500).json({ error: "Error al eliminar tarea" });
  }
});


// 🔹 Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});