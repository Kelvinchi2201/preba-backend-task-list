import * as TaskModule from "./tareas.js";

// Variables 
const inputTask = document.querySelector('#form-input-placeholder');
const form = document.querySelector('#form');
const formBtn = document.querySelector('#form-btn');
const taskList = document.querySelector('#task-list');
const totalCountSpan = document.querySelector('.total-count');
const completedCountSpan = document.querySelector('.completed-count');
const incompletedCountSpan = document.querySelector('.incompleted-count')

const totalCount = () => {
	const howMany = document.querySelector('#task-list').children.length; 
	totalCountSpan.innerHTML = howMany;
};

const completeCount = () => {
	const howMany = document.querySelectorAll('.task-text-checked').length;
	completedCountSpan.innerHTML = howMany;
};

const incompletedCount = () => {
	const howMany = document.querySelectorAll('.task-text').length; 
	incompletedCountSpan.textContent = howMany;
};

const todoCount = () => {
	totalCount();
	completeCount();
	incompletedCount();
};

let isInputTaskValid = false;

 
const TASK_REGEX = /^[A-Za-z][A-Za-z\s]{0,99}$/;

 
 


const renderInputValidationStatus = (input) => {
    const formErrorText = input.nextElementSibling;
    
    if (inputTask.value === '') {
      
      input.classList.add('input-invalid');
      input.classList.remove('input-valid');
      formErrorText?.classList.add('show-error-text');      
    } else if (isInputTaskValid) {
      
      input.classList.add('input-valid');
      input.classList.remove('input-invalid');
      formErrorText?.classList.remove('show-error-text');
    } else {
      
      input.classList.add('input-invalid');
      input.classList.remove('input-valid');
      formErrorText?.classList.add('show-error-text');
    }
}

const renderFormBtnValidationStatus = () => {
    if (isInputTaskValid) {
      formBtn.disabled = false;
    } else {
      formBtn.disabled = true;
    }
}
  
  
inputTask.addEventListener('input', e => {
   isInputTaskValid = TASK_REGEX.test(inputTask.value);
   renderInputValidationStatus(inputTask, isInputTaskValid);
   renderFormBtnValidationStatus();
});


form.addEventListener('submit', async e => {
  e.preventDefault();
  const newTask = {
    id: crypto.randomUUID(),
    Task: inputTask.value,
    isChecked: false
  }
  inputTask.value = '';
  await TaskModule.addTask(newTask);
  TaskModule.saveTaskInBrowser();
  TaskModule.renderTasks(taskList);
  todoCount();
});


taskList.addEventListener('click', async e => {
  const deleteBtn = e.target.closest('.task-delete-btn');
  const checkedBtn = e.target.closest('.task-check-btn');

  if (deleteBtn) {
    const li = deleteBtn.parentElement;
    await TaskModule.removeTask(li.id);
    TaskModule.renderTasks(taskList);
  }

  if (checkedBtn) {
      
      const li = checkedBtn.parentElement;
      
      const taskInputText = li.querySelector('p');        
      const status = li.getAttribute('status');
  
      if (status === 'disabled-inputs') {
      // Cambio el estado del input 
        li.setAttribute('status', 'enabled-inputs');
      // Cambio el icono del checkBtn 
        checkedBtn.innerHTML = TaskModule.checkedIcon;
      // Agrega la clase del texto chequeado 
        taskInputText.classList.remove('task-text');
        taskInputText.classList.add('task-text-checked'); 
        // Actualizo la tarea
        const checkedTask = {
          id: li.id,
          Task: taskInputText.textContent,
          isChecked: true
        }

        // La guardo en el navegador  
        await TaskModule.updateTask(checkedTask);
        TaskModule.renderTasks(taskList);
      }
  
      if (status === 'enabled-inputs') {
      // Cambio el estado del input 
        li.setAttribute('status', 'disabled-inputs');        
      // Cambio el icono del checkBtn 
        checkedBtn.innerHTML = TaskModule.checkIcon;
      // Agrega la clase del texto chequeado
        taskInputText.classList.add('task-text');
        taskInputText.classList.remove('task-text-checked');
        
        // Actualizo la tarea
        const checkedTask = {
          id: li.id,
          Task: taskInputText.textContent,
          isChecked: false
        }

        // La guardo en el navegador
        await TaskModule.updateTask(checkedTask);
        TaskModule.renderTasks(taskList);      
      }
    }
});




window.onload = async () => {
  
  await TaskModule.getTaskFromDb();
  TaskModule.renderTasks(taskList);

  todoCount();
}