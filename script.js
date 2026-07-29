// =============================
// Professional Todo App
// Completed / Pending / Deleted
// =============================


const taskInput = document.getElementById("taskInput");
const priority = document.getElementById("priority");
const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");
const deletedTasks = document.getElementById("deletedTasks");

const progress = document.getElementById("progress");
const percentage = document.getElementById("percentage");

const emptyState = document.getElementById("emptyState");
const currentDateTime = document.getElementById("currentDateTime");
const searchInput = document.getElementById("searchTask");


// Load tasks

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let deletedHistory = JSON.parse(localStorage.getItem("deletedTasks")) || [];

let currentFilter = "all";




// =============================
// Clock
// =============================


function updateClock(){

    let now = new Date();

    currentDateTime.textContent =
    now.toLocaleDateString()+
    " | "+
    now.toLocaleTimeString();

}


setInterval(updateClock,1000);

updateClock();






// =============================
// Save Data
// =============================


function saveTasks(){

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );


    localStorage.setItem(
        "deletedTasks",
        JSON.stringify(deletedHistory)
    );

}





// =============================
// Add Task
// =============================


function addTask(){


    let text = taskInput.value.trim();


    if(text===""){

        alert("Please enter task");

        return;

    }


    let now = new Date();


    tasks.push({

        id:Date.now(),

        text:text,

        priority:priority.value,

        status:"pending",

        created:now.toLocaleString(),

        completedDate:"-",

        edited:"-"

    });



    taskInput.value="";


    renderTasks();

}








// =============================
// Display Tasks
// =============================


function renderTasks(){


    taskList.innerHTML="";


    let displayTasks;


    if(currentFilter==="deleted"){

        displayTasks=deletedHistory;

    }

    else if(currentFilter==="completed"){

        displayTasks=
        tasks.filter(
            task=>task.status==="completed"
        );

    }

    else if(currentFilter==="pending"){

        displayTasks=
        tasks.filter(
            task=>task.status==="pending"
        );

    }

    else{

        displayTasks=tasks;

    }




    if(displayTasks.length===0){

        emptyState.style.display="block";

    }

    else{

        emptyState.style.display="none";

    }




    displayTasks.forEach(task=>{


        let li=document.createElement("li");

        li.className="task";



        li.innerHTML=`

        <div class="task-content">


        <span class="task-name 
        ${task.status==="completed"?"completed":""}">

        ${task.text}

        </span>



        <div class="task-info">

        📅 Created : ${task.created}

        </div>



        ${
        task.status==="completed"
        ?
        `<div class="task-info">
        ✅ Completed : ${task.completedDate}
        </div>`
        :""
        }




        ${
        task.deletedDate
        ?
        `<div class="task-info">
        🗑 Deleted : ${task.deletedDate}
        </div>`
        :""
        }




        <div class="status 
        ${
        task.status==="pending"
        ?
        "pending"
        :
        task.status==="completed"
        ?
        "completed-status"
        :
        "deleted-status"
        }">

        ${
        task.status
        }

        </div>



        <div class="priority ${task.priority.toLowerCase()}">

        ${task.priority}

        </div>



        </div>





        <div class="actions">


        ${
        task.status!=="deleted"
        ?
        `

        <i class="fa-solid fa-pen"
        onclick="editTask(${task.id})">
        </i>



        <i class="fa-solid fa-check"
        onclick="completeTask(${task.id})">
        </i>



        <i class="fa-solid fa-trash"
        onclick="deleteTask(${task.id})">
        </i>

        `
        :
        ""
        }


        </div>



        `;



        taskList.appendChild(li);


    });



    updateStats();


}







// =============================
// Complete Task
// =============================


function completeTask(id){


    let task =
    tasks.find(
        task=>task.id===id
    );


    if(task){

        task.status="completed";


        task.completedDate =
        new Date().toLocaleString();


    }


    renderTasks();

}








// =============================
// Delete Task
// =============================


function deleteTask(id){


    if(confirm("Delete this task?")){


        let index =
        tasks.findIndex(
            task=>task.id===id
        );



        let deleted =
        tasks[index];



        deleted.status="deleted";


        deleted.deletedDate =
        new Date().toLocaleString();



        deletedHistory.push(deleted);



        tasks.splice(index,1);



        renderTasks();


    }


}








// =============================
// Edit Task
// =============================


function editTask(id){


    let task =
    tasks.find(
        task=>task.id===id
    );


    let newText =
    prompt(
        "Edit Task",
        task.text
    );



    if(newText===null)
    return;



    if(newText.trim()===""){

        alert("Task cannot empty");

        return;

    }



    task.text=newText.trim();


    task.edited =
    new Date().toLocaleString();



    renderTasks();


}








// =============================
// Search
// =============================


function searchTask(){


    let value =
    searchInput.value.toLowerCase();



    let result =
    tasks.filter(task=>

    task.text
    .toLowerCase()
    .includes(value)

    );



    taskList.innerHTML="";



    result.forEach(task=>{

        currentFilter="all";

    });


    renderTasks();

}








// =============================
// Filter
// =============================


function filterTasks(type){


    currentFilter=type;


    renderTasks();


}








// =============================
// Statistics
// =============================


function updateStats(){


    let total =
    tasks.length + deletedHistory.length;


    let pending =
    tasks.filter(
        task=>task.status==="pending"
    ).length;



    let completed =
    tasks.filter(
        task=>task.status==="completed"
    ).length;



    let deleted =
    deletedHistory.length;



    totalTasks.textContent=total;

    pendingTasks.textContent=pending;

    completedTasks.textContent=completed;

    deletedTasks.textContent=deleted;




    let percent =
    total===0
    ?
    0
    :
    (completed/total)*100;



    progress.style.width =
    percent+"%";


    percentage.textContent =
    Math.round(percent);



    saveTasks();


}








// =============================
// Enter Button
// =============================


taskInput.addEventListener(
"keypress",
function(e){

    if(e.key==="Enter"){

        addTask();

    }

});




// Start App

renderTasks();