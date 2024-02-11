import React from 'react'
import axios from 'axios'

const URL = 'http://localhost:9000/api/todos'

export default class App extends React.Component {
  state = {
    todos: [],
    error: '',
    todoNameInput: '',
    displayCompleted: true,
  }
  onTodoNameInputChange = evt => {
    const { value } = evt.target
    this.setState({ ...this.state, todoNameInput: value })
  }

  resetForm = () => {
    this.setState({ ...this.state, todoNameInput: '' })
  }

  setAxiosResponseError = (err) => {
    this.setState({ ...this.state, error: err.response.data.message })
  }

  postNewTodo = () => {
    axios
      .post(URL, { name: this.state.todoNameInput })
      .then(res => {
        this.setState({
          ...this.state, todos: this.state.todos.concat(
            res.data.data
          )
        })
        this.resetForm()
      })
      .catch(err => {
        this.setAxiosResponseError()
      })
  }

  onTodoFormSubmit = (evt) => {
    evt.preventDefault()
    this.postNewTodo()
  }
  toggleDisplayCompleted = () => {
    this.setState({ ...this.state, displayCompleted: !this.state.displayCompleted })
  }

  fetchAllTodos = () => {
    axios
      .get(URL)
      .then(res => {
        this.setState({ ...this.state, todos: res.data.data })
      })
      .catch(err => {
        this.setAxiosResponseError()
      })
  }

  toggleCompleted = (id) => () => {
    axios.patch(`${URL}/${id}`)
      .then(res => {
        this.setState({ ...this.state, todos: this.state.todos.map(td => td.id === id ? res.data.data : td) })
      })
      .catch(err => {
        this.setAxiosResponseError()
      })
  }

  componentDidMount() {
    this.fetchAllTodos()

  }

  render() {
    return (
      <div>
        <div id="error">Error:{this.state.error}</div>
        <div id="todos">
          <h2>Todos</h2>

          {
            this.state.todos.reduce((acc, td) => {
              if (this.state.displsayCompleted || !td.completed) return acc.concat(
                <div onClick={this.toggleCompleted(td.id)} key={td.id}>{td.name}{td.completed ? " X" : ""}</div>
              )
              return acc
            }, [])


          }
        </div>
        <form id="todoForm" onSubmit={this.onTodoFormSubmit}>
          <input value={this.state.todoNameInput} onChange={this.onTodoNameInputChange} type="text" placeHolder="Type todo"></input>
          <input type="submit"></input>

        </form>
        <button onClick={this.toggleDisplayCompleted}>{this.state.displayeCompleted ? "Hide" : "Show"} Completed</button>
      </div>
    )
  }
}
