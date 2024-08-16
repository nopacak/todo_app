import './todo-item.ts';

class TodoList extends HTMLElement {
  private tasks: { id: number, task: string, completed: boolean, fromApi: boolean }[] = [];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot!.innerHTML = `
      <style>
        .list-container {
          border: 2px solid #4d972d;
          background-color: transparent; 
          padding: 50px;
          width: 800px;
          min-height: 350px;
          margin: 25px auto;
          border-radius: 8px;
        }

        .list-container__list {
          list-style-type: none;
          padding: 0;
        }

        .list-container-heading {
          color: #848181;
        }

        #completedCount {
          margin-top: 20px;
          font-weight: bold;
          color: #4d972d;
        }

        #message {
          color: #4d972d;
          margin-top: 10px;
          font-size: 14px;
        }

        .button-container {
          margin-top: 20px;
        }

        button {
          margin-right: 10px;
          padding: 5px 10px;
          border: none;
          border-radius: 4px;
          background-color: #625959;
          color: white;
          cursor: pointer;

          &:hover {
          background-color: #a6a4a4;
          }

        }
        .hidden {
          display: none;
        }
      </style>
      <ul class="list-container">
        <h1 class="list-container-heading">ToDo or NotToDo - The List!!</h1>
        <div id="taskList"></div>
        <div class="button-container">
          <button id="deleteAllButton" class="hidden">Remove All</button>
          <button id="deleteManualButton" class="hidden">Remove Manual Tasks</button>
          <button id="deleteApiButton" class="hidden">Remove API Tasks</button>
        </div>
      </ul>
      <form id="manualTaskForm">
        <input type="text" id="taskInput" placeholder="Add a new task" required />
        <button type="submit">Add Task</button>
      </form>
      <form id="apiTaskForm">
        <input type="number" id="taskCount" min="1" placeholder="Number of tasks" required />
        <button type="submit">Fetch Tasks from API</button>
      </form>
      <div id="completedCount"></div>
      <div id="message"></div>
    `;
  }

  connectedCallback() {
    this.shadowRoot!.querySelector('#manualTaskForm')!.addEventListener('submit', this.addTask.bind(this));
    this.shadowRoot!.querySelector('#apiTaskForm')!.addEventListener('submit', this.fetchTasksFromAPI.bind(this));
    this.shadowRoot!.querySelector('#deleteAllButton')!.addEventListener('click', this.deleteAllTasks.bind(this));
    this.shadowRoot!.querySelector('#deleteManualButton')!.addEventListener('click', this.deleteManualTasks.bind(this));
    this.shadowRoot!.querySelector('#deleteApiButton')!.addEventListener('click', this.deleteApiTasks.bind(this));
    this.updateCompletedCount();
  }

  addTask(event: Event) {
    event.preventDefault();
    const input = this.shadowRoot!.querySelector<HTMLInputElement>('#taskInput')!;
    const newTask = { id: Date.now(), task: input.value, completed: false, fromApi: false };
    this.tasks.push(newTask);
    this.renderTask(newTask);
    input.value = '';
    this.updateCompletedCount();
  }

  async fetchTasksFromAPI(event: Event) {
    event.preventDefault();
    const input = this.shadowRoot!.querySelector<HTMLInputElement>('#taskCount')!;
    const count = parseInt(input.value, 10);
    const message = this.shadowRoot!.querySelector<HTMLDivElement>('#message')!;

    try {
      const response = await fetch(`https://dummyjson.com/todos?limit=${count}`);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      data.todos.forEach((todo: { id: number, todo: string, completed: boolean }) => {
        const newTask = { id: todo.id, task: todo.todo, completed: todo.completed, fromApi: true };
        this.tasks.push(newTask);
        this.renderTask(newTask);
      });
      message.textContent = 'Tasks successfully added from API!';
    } catch (error) {
      message.textContent = 'Error fetching tasks from API!';
    }

    input.value = '';
    this.updateCompletedCount();
  }

  renderTask(task: { id: number, task: string, completed: boolean, fromApi: boolean }) {
    const taskList = this.shadowRoot!.querySelector('#taskList')!;
    const taskItem = document.createElement('todo-item');
    taskItem.setAttribute('task', task.task);
    taskItem.setAttribute('id', task.id.toString());
    taskItem.setAttribute('completed', task.completed.toString());
    taskItem.setAttribute('fromApi', task.fromApi.toString());
    taskItem.addEventListener('remove-task', this.removeTask.bind(this));
    taskItem.addEventListener('toggle-complete', this.toggleComplete.bind(this));
    taskList.appendChild(taskItem);
  }

  removeTask(event: CustomEvent) {
    this.tasks = this.tasks.filter(task => task.id !== event.detail.id);
    this.shadowRoot!.querySelector(`#taskList > todo-item[id="${event.detail.id}"]`)!.remove();
    this.updateCompletedCount();
  }

  toggleComplete(event: CustomEvent) {
    const task = this.tasks.find(task => task.id === event.detail.id);
    if (task) {
      task.completed = event.detail.completed;
      this.updateCompletedCount();
    }
  }

  updateCompletedCount() {
    const completedCount = this.tasks.filter(task => task.completed).length;
    const totalTasks = this.tasks.length;

    // Update the completed tasks message
    this.shadowRoot!.querySelector('#completedCount')!.textContent = `Completed Tasks: ${completedCount} / ${totalTasks}`;

    // Display a message if all tasks are completed
    const messageElement = this.shadowRoot!.querySelector('#message')!;
    if (completedCount === totalTasks && totalTasks > 0) {
      messageElement.textContent = 'All tasks are completed!';
    } else if (totalTasks === 0) {
      messageElement.textContent = 'No tasks available.';
    } else {
      messageElement.textContent = ''; // Clear the message if not all tasks are completed
    }

    // Toggle visibility of buttons based on the number of tasks
    const buttonContainer = this.shadowRoot!.querySelector('.button-container')!;
    const buttons = buttonContainer.querySelectorAll('button');
    buttons.forEach(button => button.classList.toggle('hidden', totalTasks === 0));
  }

  deleteAllTasks() {
    this.tasks = [];
    this.clearTasksFromDOM();
    this.updateCompletedCount();
  }

  deleteManualTasks() {
    this.tasks = this.tasks.filter(task => task.fromApi);
    this.clearTasksFromDOM();
    this.renderTaskList();
  }

  deleteApiTasks() {
    this.tasks = this.tasks.filter(task => !task.fromApi);
    this.clearTasksFromDOM();
    this.renderTaskList();
  }

  clearTasksFromDOM() {
    const taskList = this.shadowRoot!.querySelector('#taskList')!;
    const items = taskList.querySelectorAll('todo-item');
    items.forEach(item => item.remove());
  }

  renderTaskList() {
    this.tasks.forEach(task => this.renderTask(task));
    this.updateCompletedCount();
  }
}

customElements.define('todo-list', TodoList);
