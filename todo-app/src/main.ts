import './style.scss';
import './components/todo-list.ts';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <todo-list></todo-list>
  </div>
`;