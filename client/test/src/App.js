import logo from "./logo.svg";
import "./App.css";
import { gql, useQuery } from "@apollo/client";

const GET_TODOLIST = gql`
  query getAll {
    todoList {
      id
      text
    }
  }
`;

function App() {
  const { data } = useQuery(GET_TODOLIST);

  console.log(data);
  return (
    <div className="App">
      hogehoge
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer">
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
