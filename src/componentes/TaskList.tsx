import TaskCard from "./TaskCard";

type Task = {
    id: number;
    text: string;
    completed: boolean;
};

type Props = {
    tasks: Task[];
    deleteTask: (id: number) => void;
    toggleTask: (id: number) => void;
};

function TaskList({ tasks, deleteTask, toggleTask }: Props) {
    return (
        <ul className="task-list">
            {tasks.map((task) => (
                <TaskCard
                    key={task.id}
                    task={task}
                    deleteTask={deleteTask}
                    toggleTask={toggleTask}
                />
            ))}
        </ul>
    );
}

export default TaskList;