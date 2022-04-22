// HELPER FUNCTIONS
function get(element){
    return document.querySelector(`${element}`)
}

function getAll(elements){
    return document.querySelectorAll(`${elements}`)
}

function log(content){
    return console.log(content)
}

function show(element){
    element.style.visibility = 'visible'
    element.style.opacity = '1'
}

function hide(element){
    element.style.visibility = 'hidden'
    element.style.opacity = '0'
}

// Dummy Tasks
let tasksObject = {
    today: {
        tasks: [
            {id: 1, text: 'Develop a new feature for the webp aplication', completed: true},
            {id: 2, text: 'Buy a helmet for cycling', completed: true},
            {id: 3, text: 'Analyze the survey results', completed: false},
            {id: 4, text: 'Review Wireframes', completed: false},
        ]
    },
    important: {
        tasks: [
            {id: 1, text: 'Learn to use Sketch', completed: false},
            {id: 2, text: 'Learn more JavaScript', completed: true},
        ]
    },
    upcoming: {
        tasks: [
            {id: 1, text: 'Publish an article on Monday', completed: true},
            {id: 2, text: 'Review SEO practices', completed: false},
            {id: 3, text: 'Send budget upadte', completed: false},
        ]
    }
}
// Setting the object into localStorage
localStorage.setItem('tasksObject', JSON.stringify(tasksObject));
// Retrieving the object from localStorage
const tasks = JSON.parse(localStorage.getItem('tasksObject'));

// Loads/Reloads the HTML content using data from the "tasks" object
function loadContent(update = false){

    // Getting all categories names from tasks object
    let categories = Object.getOwnPropertyNames(tasks), 

    // Getting tabs
    all = get('main > section #content > div#all'), 
    completed = get('main > section #content > div#completed'), 
    containers = getAll('main > section #content > div:not(#all, #completed)')
    
    // Resets and reloads to update content
    if(update == true){
        all.innerHTML = ''
        completed.innerHTML = ''

        containers.forEach(container => {
            container.innerHTML = ''
        });
    }

    // Load and append "All" and "completed" category from localstorage

    Object.values(tasks).forEach((category, index) => {

        category.tasks.forEach(task => {

            // ALL
            all.innerHTML += `
                <section>
                    <div data-id="${task.id}" data-category="${categories[index]}">
                        <button role="img" ${task.completed == true ? 'class="completed"' : ''}></button>
                        <h2 class="task-text">${task.text}</h2>
                    </div>
                    <span role="img" class="${categories[index]}"></span>
                </section>`

            // COMPLETED
            if(task.completed == true){
                completed.innerHTML += `
                    <section>
                        <div data-id="${task.id}" data-category="${categories[index]}">
                            <button role="img" class="completed"></button>
                            <h2 class="task-text">${task.text}</h2>
                        </div>
                        <span role="img" class="${categories[index]}"></span>
                    </section>`
            }
        });
    });

    // Load and append the remaining content from localStorage (Today, Important, Upcoming)
    containers.forEach(category => {

        let task = tasks[category.id].tasks

        task.forEach(task => {
            category.innerHTML += `
                    <section>
                        <div data-id="${task.id}" data-category="${category.id}">
                            <button role="img" ${task.completed == true ? 'class="completed"' : ''}></button>
                            <h2 class="task-text">${task.text}</h2>
                        </div>
                        <span role="img" class="${category.id}"></span>
                    </section>`
            });
    });

}

// Loads content on the screen
loadContent(false)

// ADD
const textInput = get('main > section #add-task div input'),
categoryInput = get('main > section #add-task div select'),
addButton = get('main > section #add-task button')

let taskItem = getAll('main > section #content section')

// MENUS
const navs = getAll("main aside ul li")

// Updates new data on the "tasks" object
function updateData(data){
    localStorage.setItem('tasksObject', JSON.stringify(data))
}

function updateTask(id, categoryName){

    // Getting the task from the Tasks object in localStorage
    let tasksData = tasks[categoryName].tasks[id]


    // Verifying if the task is already completed to create a toggle completed: true/false
    if(tasksData.completed == true) {
        tasksData.completed = false 
    } 
    else {
        tasksData.completed = true
    }

    // Updating localStorage with changes
    updateData(tasksData)

    // Updating the "Completed" tab in HTML
    completed = get('main > section #content > div#completed')

    // Getting the same task in different tabs of HTML
    const items = getAll(`main > section #content section > div[data-id="${id+1}"][data-category="${categoryName}"]`)

    items.forEach(item => {
        // Updating the check tick of the same task in different tabs of HTML creating a toggle check icon if the task is completed/incomplete
        if(item.children[0].className){
            item.children[0].removeAttribute("class")

        } else {
            item.children[0].classList.add("completed")
        }
    });

    // Add/Remove the selected task from "Completed" tab
    if(items[0].children[0].className){
        // Adding the selected task
        const newTask = `<section>
                            ${items[0].outerHTML}
                            <span role="img" class="${categoryName}"></span>
                        </section>`
        completed.innerHTML += newTask

        taskItem = getAll('main > section #content section')
    
    } else{
        // Removing the selected task
        const removedElement = completed.querySelector(`section > div[data-id="${id+1}"][data-category="${categoryName}"]`).parentNode
        
        removedElement.style.opacity = "0"
        removedElement.style.padding = "0"
        removedElement.style.height = "0"
        removedElement.children[0].style.opacity = "0"
        removedElement.children[0].style.padding = "0"
        removedElement.children[0].style.height = "0"

        setTimeout(function(){
            
        }, 2000);
        completed.removeChild(removedElement)
    }


    // Adding event listener to "Complete" tab which has been lost when DOM was updated
    completed = getAll('main > section #content > div#completed section')

    completed.forEach(item => {
        
        item.onclick = () =>{
            id = item.children[0].dataset.id - 1
            category = item.children[1] ? item.children[1].className : get(".selected").innerText.toLowerCase()
            updateTask(id, category)
        }
    });

}

addButton.onclick = () => {
    addTask(textInput.value, categoryInput.value)
}

function addTask(text, categoryName){

    let id = tasks[categoryName].tasks.length + 1
    let data = {id: id, text: text, completed: false}

    tasks[categoryName].tasks.push(data)

    loadContent(true)
    taskItem = getAll('main > section #content section')

    taskItem.forEach(item => {
        item.onclick = () => {
            id = item.children[0].dataset.id - 1
            category = item.children[1] ? item.children[1].className : get(".selected").innerText.toLowerCase()
    
            updateTask(id, category)
        }
    });
}

// CONTENT FUNCTIONS
navs.forEach(nav => {
    nav.onclick = () =>{

        // CHANGE TAB
        navs.forEach(nav => {
            nav.removeAttribute("class")
        });

        nav.classList.add("selected")

        let categories = getAll(`main > section #content > div`)
        categories.forEach(category => {
            category.removeAttribute("class")
        });

        get(`main > section #content > div#${nav.id}`).classList.add("visible")
        get('main > section #section-title h1').innerText = nav.innerText
    }
});

textInput.onkeyup = () =>{
    textInput.value != '' ? show(addButton) : hide(addButton)
}

textInput.onkeydown = () =>{
    textInput.value != '' ? show(addButton) : hide(addButton)
}

taskItem.forEach(item => {
    item.onclick = () =>{
        id = item.children[0].dataset.id - 1
        category = item.children[1] ? item.children[1].className : get(".selected").innerText.toLowerCase()

        updateTask(id, category)
    }
});






