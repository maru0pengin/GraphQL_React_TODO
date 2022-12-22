import "./App.css";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";

const GET_TODOLIST = gql`
  query getAll {
    todoList {
      id
      text
    }
  }
`;
const DELETE_TODO = gql`
  mutation deleteTodoByID($deleteTodoId: ID!) {
    deleteTodo(id: $deleteTodoId)
  }
`;
const UPDATE_TODO = gql`
  mutation createTodo($updateTodoId: ID!, $updateTodoText: String) {
    updateTodo(id: $updateTodoId, text: $updateTodoText)
  }
`;
const CREATE_TODO = gql`
  mutation createTodo($createTodoText: String) {
    createTodo(text: $createTodoText) {
      id
      text
    }
  }
`;
function App() {
  const { data } = useQuery(GET_TODOLIST);
  const [addTodo] = useMutation(CREATE_TODO);
  const [deleteTodo] = useMutation(DELETE_TODO);
  const [updateTodo] = useMutation(UPDATE_TODO);
  const [inputText, setInputText] = useState("");
  const [editingId, setEditingId] = useState(-1);
  const [editingText, setEditingText] = useState("");

  const [todoList, setTodoList] = useState([]);
  useEffect(() => {
    setTodoList(data?.todoList);
  }, [data]);

  const handleCreateChange = (e) => setInputText(e.target.value);
  const handleEditingChange = (e) => setEditingText(e.target.value);

  const handleCreateEnter = (e) => {
    if (e.key === "Enter") {
      handleCreate(inputText);
      setInputText("");
    }
  };

  const handleEditingEnter = (e) => {
    if (e.key === "Enter") {
      handleUpdate(editingId, editingText);
      setEditingId(-1);
    }
  };

  const handleDelete = async (id) => {
    const { data: deleteResponse } = await deleteTodo({
      variables: { deleteTodoId: id },
    });
    if (deleteResponse?.deleteTodo) {
      console.log(`${id}を削除`);
      const index = todoList.findIndex((e) => e.id === id);
      let _todoList = todoList.slice();
      _todoList.splice(index, 1);
      setTodoList(_todoList);
    }
  };

  const handleUpdate = async (id, text) => {
    const { data: updateResonse } = await updateTodo({
      variables: { updateTodoId: id, updateTodoText: text },
    });
    if (updateResonse?.updateTodo) {
      console.log(`${id}を更新`);
      const index = todoList.findIndex((e) => e.id === id);
      let _todoList = todoList.slice();
      _todoList[index] = { id: id, text: text };
      setTodoList(_todoList);
    }
  };

  const handleCreate = async (text) => {
    const { data: createResonse } = await addTodo({
      variables: { createTodoText: text },
    });
    if (createResonse?.createTodo) {
      const addedTodo = createResonse?.createTodo;
      if (!todoList.some((todo) => todo.id === addedTodo.id)) {
        console.log("同一の内容のTODOは無いので新規作成");
        let _todoList = todoList.slice();
        _todoList.push(addedTodo);
        setTodoList(_todoList);
      }
    }
  };

  return (
    <div>
      <h1>今年中に終わらせるTODOリスト</h1>
      <ul>
        {todoList &&
          todoList?.map((todo) => (
            <li key={todo.id}>
              {todo.id}：
              {editingId === todo.id ? (
                <>
                  <input
                    type="text"
                    value={editingText}
                    onChange={handleEditingChange}
                    onKeyPress={handleEditingEnter}
                  />
                  <button
                    onClick={() => {
                      handleUpdate(todo.id, editingText);
                      setEditingId(-1);
                    }}>
                    決定！
                  </button>
                </>
              ) : (
                <>
                  {todo.text}
                  <button
                    onClick={() => {
                      setEditingId(todo.id);
                      setEditingText(todo.text);
                      setTodoList(todoList);
                    }}>
                    編集するよ
                  </button>
                  <button onClick={() => handleDelete(todo.id)}>
                    消しちゃうよ
                  </button>
                </>
              )}
            </li>
          ))}
      </ul>
      <input
        type="text"
        placeholder="新しいタスク"
        value={inputText}
        onChange={handleCreateChange}
        onKeyPress={handleCreateEnter}
      />
      {todoList?.length === 0 ? (
        <img src={"./GraphQL_2.png"} width="200"></img>
      ) : (
        <img src={"./GraphQL_1.png"} width="200"></img>
      )}
    </div>
  );
}

export default App;
