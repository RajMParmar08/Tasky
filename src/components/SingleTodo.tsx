import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { MdDone , MdUndo } from "react-icons/md";
import { Todo } from "../models/models";
import { Draggable } from "react-beautiful-dnd";

const SingleTodo: React.FC<{
  index: number;
  todo: Todo;
  todos: Array<Todo>;
  setTodos: React.Dispatch<React.SetStateAction<Array<Todo>>>;
  CompletedTodos: Array<Todo>;
  setCompletedTodos: React.Dispatch<React.SetStateAction<Array<Todo>>>;
  handleUndo: (todo: Todo) => void

}> = ({ index, todo, todos, setTodos,setCompletedTodos,CompletedTodos,handleUndo }) => {
  const [edit, setEdit] = useState<boolean>(false);
  const [editTodo, setEditTodo] = useState<string>(todo.todo);

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, [edit]);

  const handleEdit = (e: React.FormEvent, id: number) => {
    e.preventDefault();
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, todo: editTodo } : todo))
    );
    setEdit(false);
  };

  const handleDelete = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleDone = (id: number) => {
    if (todo.isDone) {
      // If already done, remove from completed and add to active
      setCompletedTodos((prev) => prev.filter((t) => t.id !== id));
    } else {
      // If not done, remove from active and add to completed
      setTodos((prev) => prev.filter((t) => t.id !== id));
      setCompletedTodos((prev) => [...prev, { ...todo, isDone: true }]);    }
  };

  // const handleUndo =(todo: Todo)=>{
  //   // const taskToUndo = CompletedTodos.find((task) => task.id === id);
  //  if (todo?.isDone){
  //   console.log(todo);
  //   setTodos((prev) => [...prev, { ...todo, isDone: false }]);
  //   setCompletedTodos((prev) => prev.filter((task) => task.id !== todo.id));
  //   console.log(todo);
  //  }   
  // }

  return (
    <Draggable draggableId={todo.id.toString()} index={index}>
      {(provided, snapshot) => (
        <form
          onSubmit={(e) => handleEdit(e, todo.id)}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={`todos__single ${snapshot.isDragging ? "drag" : ""}`}
        >
          {edit ? (
            <input
              value={editTodo}
              onChange={(e) => setEditTodo(e.target.value)}
              className="todos__single--text"
              ref={inputRef}
            />
          ) : todo.isDone ? (
            <s className="todos__single--text">{todo.todo}</s>
          ) : (
            <span className="todos__single--text">{todo.todo}</span>
          )}
          
          <div>
  {todo.isDone ? (
    <>
      <span className="icon" onClick={() => handleUndo(todo)}>
       <MdUndo/>
      </span>
      <span className="icon" onClick={() => handleDelete(todo.id)}>
        <AiFillDelete />
      </span>
    </>
  ) : (
    <>
      <span
        className="icon"
        onClick={() => {
          if (!edit && !todo.isDone) {
            setEdit(!edit);
          }
        }}
      >
        <AiFillEdit />
      </span>
      <span className="icon" onClick={() => handleDelete(todo.id)}>
        <AiFillDelete />
      </span>
      <span className="icon" onClick={() => handleDone(todo.id)}>
        <MdDone />
      </span>
    </>
  )}
</div>

        </form>
      )}
    </Draggable>
  );
};

export default SingleTodo;