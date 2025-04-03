
var socket = io(); // Connect to Flask-SocketIO Server

document.addEventListener('DOMContentLoaded', () => {

    // CREATE STICKY NOTES FROM EMIT
    socket.on("task", (data) => {
        const taskContainer = document.querySelector('.task-container');
        const formContainer = document.querySelector('.form-container');

        const task = data;  // Grab the task from the emit

        const note = document.createElement('div'); // Create a note element
        note.classList.add('sticky-note'); // add CSS class 'sticky-note' to it

        note.dataset.id = task.id; // Store the task ID in a data attribute

        const p = document.createElement('textarea'); // Create a <textarea> element to hold the text
        p.textContent = task.description || "No description provided."; // Fill th text
        note.appendChild(p); // Nest p inside of the note div

        // BUTTONS
        const btnContainer = document.createElement('div'); // Create the button container
        btnContainer.classList.add('btn-container'); // add the btn-container class to it
        btnContainer.dataset.id = task.id // store the task ID in a data attribute

        // Delete button
        const d = document.createElement('button') // Create a <button> element for deleting
        d.classList.add('delete-btn'); // add the delete class
        d.textContent = "🗑️"; // Fill th text
        btnContainer.appendChild(d  ) // append it to the container class

        // Start button
        const s = document.createElement('button') // Create a <button> element for starting task
        s.classList.add('begin-btn'); // add the start class
        s.textContent = "Start"; // Fill the text
        btnContainer.appendChild(s); // append it to the container class

        note.appendChild(btnContainer) // append button container to the note

        // Event listener for click DELETE buttons
        d.addEventListener('click', () => {
            const taskId = note.dataset.id; // Get the id from the created task
            //console.log("deleting task with id:", taskId)
            const currentTask = document.querySelector(`.sticky-note[data-id="${taskId}"]`) // get the task based on current ID
            if (currentTask) currentTask.remove() // remove the task from js if it exists
            // Send id to backend to be deleted
            fetch("/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        type: "delete",
                        id: taskId
                    })
                });
        })

        // Click event listener for click BEGIN buttons
        s.addEventListener('click', () => {

            if (s.classList.contains('begin-btn')){
                const taskId = note.dataset.id; // Get the id from the created task

                s.classList.remove('begin-btn'); // Remove the begin class
                s.classList.add('complete-btn'); // add the started class
                s.textContent = "Complete"; // Fill th text

                // add a pause button
                const c = document.createElement('button') // Create a <button> element for completion
                // c.classList.add('complete-btn'); // add the pause class
                c.textContent = "Pause"; // Fill th text
                btnContainer.appendChild(c) // append it to the container class

                // Send id to backend to be deleted
                fetch("/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        type: "begin",
                        id: taskId
                    })
                });
            }
        })

        taskContainer.insertBefore(note, formContainer);  // Insert the new task before the formContainer
    });

    // TIMER 
    function updateTimer(start){
        const diffMs = new Date() - start;
        const diffSec = Math.floor(diffMs/1000)
        // console.log(diffSec)
        return diffSec;
    }
    // on emit
    socket.on("time", (data) => {
        const start = new Date(data.time)
        const id = data.id
        
        const seconds = updateTimer(start);

        // Create the element
        const timer = document.createElement('p'); // create a p div for the timer
        timer.classList.add('timer'); // add timer class
        // Set the exact styles
        timer.style.margin = "0 auto";
        timer.style.textAlign = "center";
        timer.style.width = "fit-content";
        timer.textContent = seconds;
        const stickyNote = document.querySelector(`.sticky-note[data-id="${id}"]`);
        const btnContainer = stickyNote.querySelector(`.btn-container[data-id="${id}"]`);
        stickyNote.insertBefore(timer, btnContainer);

        setInterval(() => {
            const seconds = updateTimer(start);
            timer.textContent = seconds;
        }, 1000);        

    })


})