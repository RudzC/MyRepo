import React from "react";

function UsersList(props) {
  return (
    <li>
      {props.value}
      <button id={props.id} onClick={props.deleteItem}>
        Delete
      </button>
      <button id={props.id} onClick={props.editItem}>
        Edit
      </button>
    </li>
  );
}

export default UsersList;
