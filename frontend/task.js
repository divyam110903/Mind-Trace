const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

function addTask() {
  if (inputBox.value === '') {
    alert("You must add something!");
  } else {
    fetch('/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: inputBox.value })
    })
      .then(response => response.json())
      .then(data => {
        let li = document.createElement('li');
        li.innerHTML = data.text;
        li.dataset.id = data._id; // Set the task ID as dataset
        listContainer.appendChild(li);
        let span = document.createElement('span');
        span.innerHTML = "X";
        li.appendChild(span);
        saveData(); // Save data to localStorage
      })
      .catch(error => console.error(error));
    inputBox.value = "";
  }
}

listContainer.addEventListener('click', function (e) {
  if (e.target.tagName === 'LI') {
    e.target.classList.toggle("checked");
  } else if (e.target.tagName === "SPAN") {
    const taskId = e.target.parentElement.dataset.id;
    fetch(`/tasks/${taskId}`, {
      method: 'DELETE'
    })
      .then(() => {
        e.target.parentElement.remove();
        saveData(); // Save data to localStorage
      })
      .catch(error => console.error(error));
  }
}, false);

function saveData() {
  localStorage.setItem("tasks", listContainer.innerHTML);
}

function showTask() {
  const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    listContainer.innerHTML = savedTasks;
  } else {
    fetch('/tasks')
      .then(response => response.json())
      .then(data => {
        listContainer.innerHTML = '';
        data.forEach(task => {
          let li = document.createElement('li');
          li.innerHTML = task.text;
          li.dataset.id = task._id;
          listContainer.appendChild(li);
          let span = document.createElement('span');
          span.innerHTML = "\u00d7";
          li.appendChild(span);
        });
        saveData(); // Save fetched tasks to localStorage
      })
      .catch(error => console.error(error));
  }
}

showTask();
