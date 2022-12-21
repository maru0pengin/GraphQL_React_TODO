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
  const [addTodo, { data: addResponse }] = useMutation(CREATE_TODO);
  const [deleteTodo, { data: deleteResponse }] = useMutation(DELETE_TODO);
  const [updateTodo, { data: updateResponse }] = useMutation(UPDATE_TODO);
  const [inputText, setInputText] = useState("");

  const [todoList, setTodoList] = useState([]);
  // setTodoList(data?.todoList);

  useEffect(() => {
    setTodoList(data?.todoList);
    console.log(data?.todoList[0].id);
  }, [data]);

  //入力値をtextに反映
  const handleChange = (e) => setInputText(e.target.value);

  // Enter押下時、ToDoに追加
  const handleEnter = (e) => {
    // if (e.key === "Enter") {
    //   addTodo({
    //     variables: { createTodoText: inputText },
    //   });
    // }
  };

  useEffect(() => {
    console.log(deleteResponse);
  }, [deleteResponse]);

  useEffect(() => {
    // if (addResponse) {
    //   const addedTodo = addResponse.createTodo;
    //   console.log(addedTodo);
    //   // setTodoList(todoList);
    // }
  }, [addResponse]);

  // console.log("レスポンスにゃ");
  // console.log(addResponse?.createTodo);
  // useEffect(() => {
  //   if (data.todoList) {
  //     setTodoList(data.todoList);
  //     // const todoItems = todoList?.map((id, text) => (
  //     //   <li key={id}>
  //     //     {id}:{text}
  //     //   </li>
  //     // ));

  //     console.log(todoList);
  //   }
  // }, [data]);
  // console.log(todoList);
  // console.log(todoList?.todoList);
  // const test = todoList?.todoList.map((id, text) => {
  //   <div>
  //     gagagaga
  //     {id}:{text}
  //   </div>;
  // });
  // const test = todoList?todoList.map((id, text) => {
  //     <li key={id}>
  //       {id}:{text}
  //     </li>
  // });

  return (
    <div>
      <button onClick={() => deleteTodo({ variables: { deleteTodoId: 24 } })}>
        delete
      </button>
      <button
        onClick={() =>
          updateTodo({
            variables: { updateTodoId: 13, updateTodoText: "vovovvo" },
          })
        }>
        update
      </button>
      <button
        onClick={async () =>
          await addTodo({
            variables: { createTodoText: "テキスト作るgagaga" },
          })
        }>
        create
      </button>
      <ul>
        {todoList &&
          todoList?.map((todo) => <li key={todo.id}>{todo.text}</li>)}
      </ul>
      <input
        class="input"
        type="text"
        placeholder="Enter to add"
        value={inputText}
        onChange={handleChange}
        onKeyPress={handleEnter}
      />
    </div>
  );
}

export default App;
