import React, { Component } from "react";

import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      username: "",
      password: "",
      editing: false,
      editingIndex: -1
    };
  }

  async componentDidMount() {
    fetch("/users")
      .then(res => res.json())
      .then(users => {
        this.setState({ users }, () => {
          debugger;
          console.log("users fetch", users);
        });
      });
  }

  username = e => {
    this.setState({ username: e.target.value });
  };

  password = e => {
    this.setState({ password: e.target.value });
  };

  addUser() {
    let newList = this.state.users;
    if (this.state.password === "" || this.state.username === "") {
      return "error";
    } else
      fetch(
        `/users/add?id=${this.state.id}&username=${this.state.username}&password=${this.state.password}`
      )
        .then(res => res.json())
        .then(user => {
          newList.push(user);
          this.setState({ users: newList });
        });
  }

  deleteItem(id) {
    let array = this.state.users;
    const new_users = array.filter(user => {
      return user.id !== id;
    });
    fetch(`/users/delete/${id}`)
      .then(res => res.json())
      .then(users => {
        this.setState({ users: new_users });
      });
  }

  editItem = id => {
    const user = this.state.users.find(user => user.id === id);
    this.setState({
      editing: true,
      username: user.username,
      editingIndex: id
    });
  };

  updateItem = async () => {
    const res = await fetch(
      `/users/update/${this.state.editingIndex}?username=${this.state.username}&password=${this.state.password}`
    );
    const users = await res.json();
    this.setState({
      users: this.state.users.map(user =>
        user.id === this.state.editingIndex
          ? { ...user, username: this.state.username }
          : user
      ),
      editing: false,
      username: "",
      password: ""
    });
  };

  render() {
    return (
      <>
        <h2>Customers</h2>
        <form
          onSubmit={event => {
            event.preventDefault();
          }}
        >
          <input
            onChange={e => this.username(e)}
            type="text"
            placeholder="enter username"
            value={this.state.username}
          />
          <input
            onChange={e => this.password(e)}
            type="password"
            placeholder="enter password"
            value={this.state.password}
          />
          <input
            type="submit"
            value={this.state.editing ? "update" : "Add"}
            onClick={
              this.state.editing ? e => this.updateItem() : e => this.addUser()
            }
          />

          <ul>
            {this.state.users.map((user, index) => (
              <li key={user.index}>
                {user.id}-{user.username}
                <button
                  onClick={() => {
                    this.deleteItem(user.id);
                  }}
                >
                  delete
                </button>
                <button onClick={() => this.editItem(user.id)}>Edit</button>
              </li>
            ))}
          </ul>
        </form>
      </>
    );
  }
}

export default App;
