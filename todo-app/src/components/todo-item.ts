class TodoItem extends HTMLElement {
  private taskText: string;
  private completed: boolean;
  private fromApi: boolean;

  constructor() {
    super();
    this.taskText = '';
    this.completed = false;
    this.fromApi = false;
    this.attachShadow({ mode: 'open' });
    this.shadowRoot!.innerHTML = `
      <style>
        .task {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 10px 0;
          padding: 10px;
          background-color: #f0f0f0;
          border-radius: 4px;
          font-family: Arial, sans-serif;
          color: #a6a4a4;
        }
        .task.done .task-text {
          text-decoration: line-through;
          color: #4d972d;
        }
        .task.from-api {
          background-color: #f0f0f0;
        }
        .checkbox-container {
          margin-right: 10px;
          display: flex;
          align-items: center;
        }
        .task-text {
          flex-grow: 1; 
          text-align: center; 
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
      </style>
      <div class="task">
        <label class="checkbox-container">
          <input type="checkbox" class="checkbox">
          <span class="checkmark" color="green"></span>
        </label>
        <span class="task-text"></span>
        <button class="remove-button">Remove</button>
      </div>
    `;
  }

  static get observedAttributes() {
    return ['task', 'completed', 'fromApi'];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'task') this.taskText = newValue;
    if (name === 'completed') this.completed = newValue === 'true';
    if (name === 'fromApi') this.fromApi = newValue === 'true';
    this.updateTask();
  }

  connectedCallback() {
    this.shadowRoot!.querySelector('.checkbox')!.addEventListener('change', this.toggleComplete.bind(this));
    this.shadowRoot!.querySelector('.remove-button')!.addEventListener('click', this.removeTask.bind(this));
  }

  updateTask() {
    const taskTextElement = this.shadowRoot!.querySelector('.task-text')!;
    const taskElement = this.shadowRoot!.querySelector('.task')!;
    taskTextElement.textContent = this.taskText;
    taskElement.classList.toggle('done', this.completed);
    taskElement.classList.toggle('from-api', this.fromApi);
    (this.shadowRoot!.querySelector('.checkbox') as HTMLInputElement).checked = this.completed;
  }

  toggleComplete() {
    this.completed = !this.completed;
    this.updateTask();

    // Dispatch event to update the completed task counter
    this.dispatchEvent(new CustomEvent('toggle-complete', {
      detail: { id: parseInt(this.getAttribute('id')!), completed: this.completed },
      bubbles: true,
      composed: true
    }));
  }

  removeTask() {
    this.dispatchEvent(new CustomEvent('remove-task', {
      detail: { id: parseInt(this.getAttribute('id')!) },
      bubbles: true,
      composed: true
    }));
  }
}

customElements.define('todo-item', TodoItem);
