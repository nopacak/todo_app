### Nikolina's ToDo Web App ###

#### Using this project ####

To get started:

* Run ```npm install``` from the project directory (path/to/a/todo-app) to install all the node packages.

* Run ```npm run dev``` to start serving the web app (Access via http://localhost:5173)

Test the app by browsing to the following route:

* http://localhost:5173


#### Web Components ####

##### ToDoList #####

* The TodoList component is a customizable web component for managing a to-do list. It leverages modern Web Components standards to encapsulate functionality, allowing you to easily integrate it into any web application.

* Features

    ```Add Tasks Manually```: Users can add tasks directly through a form.

    ```Fetch Tasks from API```: Users can fetch a specified number of tasks from an external API.
    
    ```Task Management```: Tasks can be marked as completed, deleted, or filtered based on their source (manual entry or API).
    
    ```Dynamic Updates```: The component dynamically updates the task list and completed tasks count.
    
    ```Encapsulated Styling```: The component uses Shadow DOM to encapsulate its styles, ensuring they do not conflict with other styles on the page.

* Interactions

    ```Add Task```: Use the "Add Task" form to manually add tasks.
    
    ```Fetch API Tasks```: Use the "Fetch Tasks from API" form to import tasks from an external API.
    
    ```Delete Tasks```: Use the provided buttons to delete all tasks, only manual tasks, or only API-fetched tasks.
    
    ```Task Completion```: Click on a task to mark it as completed or incomplete.

* Development

    Methods

    ```addTask(event: Event)```: Adds a new task based on the user's input.
    
    ```fetchTasksFromAPI(event: Event)```: Fetches tasks from an external API and adds them to the list.
    
    ```renderTask(task: Object)```: Renders an individual task item.
    
    ```removeTask(event: CustomEvent)```: Removes a task from the list.
    
    ```toggleComplete(event: CustomEvent)```: Toggles the completion status of a task.
    
    ```updateCompletedCount()```: Updates the count of completed tasks and the display message.
    
    ```deleteAllTasks()```: Deletes all tasks from the list.
    
    ```deleteManualTasks()```: Deletes only manually added tasks.
    
    ```deleteApiTasks()```: Deletes only tasks fetched from the API.
    
    ```clearTasksFromDOM()```: Clears all tasks from the DOM.
    
    ```renderTaskList()```: Re-renders the list of tasks.

* Events

    The component listens to custom events emitted by the todo-item component, such as:

    ```remove-task```: Fired when a task is removed.
    
    ```toggle-complete```: Fired when a task's completion status is toggled.

##### ToDoItem #####

* The TodoItem component is a custom HTML element designed to represent individual tasks within a to-do list. It is a subcomponent intended to be used with a parent component, like TodoList. This component encapsulates the structure, styling, and behavior of a single to-do item, providing a reusable and isolated unit for task management.

* Features

    ```Task Display```: Shows the task text, which can be marked as completed or not.
    
    ```Completion Toggle```: Allows users to mark a task as completed or incomplete by checking a checkbox.
    
    ```Task Removal```: Includes a button to remove the task from the list.
    
    ```API Task Styling```: Differentiates tasks that were fetched from an API with distinct styling.
    
    ```Encapsulated Styling```: Uses Shadow DOM to encapsulate styles, ensuring no conflicts with other elements on the page.

* Attributes

    ```task```: The text of the task to be displayed.
    
    ```completed```: A boolean attribute indicating whether the task is completed (true or false).
    
    ```fromApi```: A boolean attribute indicating whether the task was fetched from an API (true or false).

* Dynamic Updates

    The component listens for changes to its attributes and updates its display accordingly. For example, if the completed attribute changes, the component will update to reflect whether the task is marked as done.

* Development

    Methods

    ```connectedCallback()```: Called when the component is added to the DOM. Sets up event listeners for task interactions.
    
    ```attributeChangedCallback(name: string, oldValue: string, newValue: string)```: Responds to changes in the task, completed, and fromApi attributes and updates the component accordingly.
    
    ```updateTask()```: Updates the task's display based on its attributes, such as applying the done class if the task is completed.
    
    ```toggleComplete()```: Toggles the task's completion status and dispatches a toggle-complete event to notify parent components.
    
    ```removeTask()```: Dispatches a remove-task event to notify parent components that the task should be removed.

* Events

    The component emits custom events to communicate changes to parent components:

    ```toggle-complete```: Fired when the task's completion status is toggled. The event's detail includes the task's id and its new completed status.
    
    ```remove-task```: Fired when the task is removed. The event's detail includes the task's id.

* Integration

    The TodoItem component is typically used within a TodoList component, but it can be integrated into any custom component or application that requires a task item. The events emitted by TodoItem allow for seamless communication and updates in more complex applications.

* Styling

    The component uses internal styles defined within the Shadow DOM. The styles include:

    ```Task Styling```: Basic styling for the task, including layout, colors, and hover effects.
    
    ```Completed Tasks```: When a task is marked as completed, it gets a line-through style and a color change.
    
    ```API-Sourced Tasks```: Tasks fetched from an API are distinguished by a specific background color.