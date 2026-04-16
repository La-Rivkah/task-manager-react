import "./TaskInput.css";

import { useState } from "react";

type Props = {
  addTask: (text: string) => void;
};

function TaskInput({ addTask }: Props) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (text.trim() === "") return;

    addTask(text);
    setText("");
  };

  return (
    <form className="task-input" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Escribe una tarea..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        className="add-button"
        type="submit"
        disabled={text.trim() === ""}
      >
        Agregar
      </button>
    </form>
  );
}

export default TaskInput;