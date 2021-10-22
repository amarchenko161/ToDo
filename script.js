let allTasks = JSON.parse(localStorage.getItem("Todo")) || [];
let valueInput = "";
let input = null;

window.onload = init = () => {
  input = document.getElementById("add-task");
  input.addEventListener("change", updateValue);
  render();
};

const onClickButton = () => {
  allTasks.push({
    text: valueInput,
    isCheck: false,
  });
  localStorage.setItem("Todo", JSON.stringify(allTasks));
  valueInput = "";
  input.value = "";
  render();
};

const onClearBtn = () => {
  allTasks = [];
  localStorage.setItem("Todo", JSON.stringify(allTasks));
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
    imageEdit.onclick = () => editElements(text, inputTask, container, item, imageEdit, imageDelete, newVal);

    const imageDelete = document.createElement("img");
    imageDelete.src = "images/close.png";
    container.appendChild(imageDelete);
    imageDelete.onclick = () => deleteTask(index, content, container);
    content.appendChild(container);
  });
};


const editElements = (text, inputTask, container, item, imageEdit, imageDelete) => {
  inputTask.value = text.innerText;
  container.replaceChild(inputTask, text);
  imageEdit.onclick = () => editTask(text, inputTask, container, item);
  imageDelete.onclick = (newVal) => {
    inputTask.value = newVal;
    render();
  };
}

const editTask = (text, inputTask, container, item) => {
  text.innerText = inputTask.value;
  item.text = inputTask.value;
  container.replaceChild(text, inputTask);
  localStorage.setItem("Todo", JSON.stringify(allTasks));
  render();
};

const deleteTask = (index, content, container) => {
  allTasks.splice(index, 1);
  content.removeChild(container);
  localStorage.setItem("Todo", JSON.stringify(allTasks));
  render();
};

const onChangeCheckbox = (index) => {
  allTasks[index].isCheck = !allTasks[index].isCheck;
  localStorage.setItem("Todo", JSON.stringify(allTasks));
  render();
};
