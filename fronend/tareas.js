import { createNotification } from "./notification.js";

/** 
  * @typedef Task
  * @type {object}
  * @property {string} id El id de la tarea
  * @property {string} Task Contenido de la tarea 
  * @property {boolean} isChecked Status si la tarea ha sido completada
*/
const BASE_URL = 'http://localhost:3000/tasks';
/** @type {Task[]} */
let tasks = [];
 
/**
 * Agrega una tarea al array de tareas
 * @param {Task} newTask
 */

  const addTask = async (taskToCreate) => {
  try {
    const taskToCreateJson = JSON.stringify(taskToCreate);
    const response = await fetch (BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type" : "application/json"
      },
      body: taskToCreateJson
    });
    const taskToCreated = await response.json();
    tasks = tasks.concat(taskToCreated);
    
    createNotification({
      titles: 'Nueva tarea creada',
      description: '',
      type: 'success'
    })
  } catch (error) {
    console.log(error);
    createNotification({
      titles: 'Error',
      description: 'El servidor no esta corriendo',
      type: 'error'
    })
  }
};


// Icons
const checkIcon = `
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12" />
</svg>
  

`;

const checkedIcon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
  <path fill-rule="evenodd" d="M9 1.5H5.625c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5Zm6.61 10.936a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 14.47a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" />
  <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
</svg>



`;

/**
 * Renderiza las tareas
 * @param {Element} list La lista en el html donde vamos a cargar las tareas
 */

const renderTasks = (list) => {
  // Borrar la lista del html
  list.innerHTML = '';
  // 1. Por cada tarea del array creo y agrego el contacto al HTML.
  tasks.forEach(task => {
    // 1. Crear el li 
    const li = document.createElement('li');
    // 2. Agregar la clase al li
    li.classList.add('task-item');
    // 3. Agregar el id al li
    li.id = task.id;
    // 3.1 Establecer el estatus
    li.setAttribute('status', task.isChecked ? 'enabled-inputs' : 'disabled-inputs');
    // 4. Crear div del input
    const taskTextClass = task.isChecked ? 'task-text-checked' : 'task-text';
    const inputsDiv = `
      <p class="${taskTextClass}">${task.Task}</p>
    `;
    // 5. Crear div de los botones
    const btnsDiv = `
     ${inputsDiv}
    <button class="task-check-btn">
      ${task.isChecked ? checkedIcon : checkIcon}                        
  </button>
  <button class="task-delete-btn">
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>                    
    </button>
    `;
    // 6. Crear la estructura del li
    const liChildren = `
     ${btnsDiv}
    `;
    li.innerHTML = liChildren;    
    // 7. Agregar el li a la ul
    list.appendChild(li);
    
  });
}

/**
 * Guarda el array de las tareas en el navegador
 */
const saveTaskInBrowser = () => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

const getTaskFromDb = async () => {
  try {
    const response = await fetch (BASE_URL, {method: "GET"});
    const data = await response.json();
    tasks = data;
    updateCounters();
  } catch (error) {
    console.log(error);
    if (error.message === 'Failed to fetch') {
      console.log('1');
      createNotification({
        titles: 'Error',
        description: 'El servidor no esta corriendo',
        type: 'error'
      });  
    }
  }
}


/**
 * Obtener las tareas del navegador y guardarlos en el array.
 */
const getTasksFromBrowser = () => {
  // 1. Obtener la lista de localStorage
  const taskLocalJson = localStorage.getItem('tasks');
  // 2. Transformar de JSON a JavaScript
  const taskLocal = JSON.parse(taskLocalJson);
  // 3. Guardar las tareas
  tasks = taskLocal ?? [];
}

/**
 * Elimina un contacto del array de tareas
 * @param {string} id El id del tareas a eliminar
 */
const removeTask = async (id) => {
  const url = `${BASE_URL}/${id}`;
  const response = await fetch (url, {method: 'DELETE'});
  const taskDeleted = await response.json();
  tasks = tasks.filter(task => task.id !== id);
  updateCounters();
  createNotification({
    titles: 'Tarea eliminada',
    description: ``,
    type:'error'
  });
}

/**
 * Actualizar una tarea
 * @param {Task} updateTask tarea chequeada
*/
const updateTask = async (updateTask) => {
  const url = `${BASE_URL}/${updateTask.id}`;
  const taskToUpdateJson = JSON.stringify(updateTask);
  const response = await fetch (url, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json' }, 
    body: taskToUpdateJson
  });
  const updatedTask = await response.json();
  createNotification({
    titles: 'Tarea Actualizada',
    description: ``,
    type:'success'
  });
  tasks = tasks.map(task => {
    if (task.id === updatedTask.id) {
      return updatedTask;      
    } else {
      return task;
    }
  });
  updateCounters();
}

export {
  
  addTask,
  renderTasks,
  saveTaskInBrowser,
  getTasksFromBrowser,
  getTaskFromDb,
  removeTask,
  updateTask,
  checkIcon,
  checkedIcon
}