let allTasks = [];
let valueInput = "";
let input = null;

window.onload = init = async () => {
  input = document.getElementById("add-task");
  input.addEventListener("change", updateValue);
  const resp = await fetch('http://localhost:8000/allTasks', {
    method: 'GET'
  });
  const result = await resp.json();
  allTasks = result.data;
  render();
};

const onClickButton = async () => {
  allTasks.push({
    text: valueInput,
    isCheck: false,
  });
  const resp = await fetch('http://localhost:8000/createTask', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      text: valueInput,
      isCheck: false,
    })
  });
  const result = await resp.json();
  allTasks = result.data;
  valueInput = "";
  input.value = "";
  render();
};

const onClearBtn = () => {
  allTasks.map((element, index) => {
    deleteTask(index);
  })
  render();
};

const updateValue = (event) => {
  valueInput = event.target.value;
};

const render = () => {
  const content = document.getElementById("content-page");
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }

  allTasks.map((item, index) => {
    const newVal = item.text;
    const container = document.createElement("div");
    container.id = `task-${index}`;
    container.className = "task-container";
    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.checked = item.isCheck;
    checkBox.onchange = () => onChangeCheckbox(index);
    container.appendChild(checkBox);
    const text = document.createElement("p");
    text.innerText = item.text;
    text.className = item.isCheck ? "text-task done-text" : "text-task";
    container.appendChild(text);
    const imageEdit = document.createElement("img");
    imageEdit.src = "images/edit.png";
    container.appendChild(imageEdit);
    const inputTask = document.createElement("input");
    imageEdit.onclick = () => editElements(index, text, inputTask, container, item, imageEdit, imageDelete, newVal);
    const imageDelete = document.createElement("img");
    imageDelete.src = "images/close.png";
    container.appendChild(imageDelete);
    imageDelete.onclick = () => deleteTask(index, content, container);
    content.appendChild(container);
  });
};

const editElements = (index, text, inputTask, container, item, imageEdit, imageDelete) => {
  inputTask.value = text.innerText;
  container.replaceChild(inputTask, text);
  imageEdit.onclick = () => editTask(index, text, inputTask, container, item);
  imageDelete.onclick = (newVal) => {
    inputTask.value = newVal;
    render();
  };
}

const editTask = async (index, text, inputTask, container, item) => {
  const resp = await fetch('http://localhost:8000/updateTask', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      id: allTasks[index].id,
      text: inputTask.value
    })
  });
  const result = await resp.json();
  allTasks = result.data;
  text.innerText = inputTask.value;
  item.text = inputTask.value;
  container.replaceChild(text, inputTask);
  render();
};

const deleteTask = async (index, content, container) => {
  const resp = await fetch(`http://localhost:8000/deleteTask?id=${allTasks[index].id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    }
  });
  const result = await resp.json();
  allTasks = result.data;
  render();
};

const onChangeCheckbox = async (index) => {
  const resp = await fetch('http://localhost:8000/updateTask', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      id: allTasks[index].id,
      isCheck: !allTasks[index].isCheck,
    })
  });
  const result = await resp.json();
  allTasks = result.data;
  render();
};
