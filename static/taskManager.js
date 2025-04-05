import { createTimer } from './helpers.js';

document.addEventListener('DOMContentLoaded', () => {

    // SEND TO BACKEND ON CLICK SAVE
    const text = document.querySelector('#text')
    const saveBtn = document.querySelector('#save');

    if (saveBtn){
        saveBtn.addEventListener('click', () => {
        
            if (text.value.trim() !== "") {
                // Send text to backend
                    fetch("/", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            type: "text",
                            text: text.value
                        })
                    });
                    text.value = "" // Clear the form
            }
            else {
                alert("Text required");
        }})
    }

    // CHECK FOR TIMERS
    // Go through all notes other than the form and see if theyv been started
    document.querySelectorAll('.sticky-note:not(.form-container)').forEach(note => { 

        // Create Timer only if there is a start time
        if (note.dataset.start !== "None" && !note.dataset.end) {
            createTimer(note);
        }
    })

    // CHECK FOR CLICKS
    document.body.addEventListener('click', (e) => {

        // clicked on begin
        if (e.target.dataset.type === 'begin') {

            // console.log("clicked on begin")

            const button = e.target.closest("button");
            const taskId = button.dataset.id; // Get the id from the button
            button.classList.remove('begin-btn'); // Remove the begin class
            button.classList.add('complete-btn'); // add the started class
            button.dataset.type = 'complete'
            button.textContent = "Complete"; // Fill th text

            console.log(taskId)

            // Send id to backend to be begined
            fetch("/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    type: "begin",
                    id: taskId
                })
            })
            const btnContainer = document.querySelector(`.btn-container[data-id="${taskId}"]`);

            // const c = document.createElement('button') // Create a <button> element for pause
            // // c.classList.add('delete-btn'); // add the delete class
            // c.textContent = "Pause"; // Fill th text
            // btnContainer.appendChild(c) // append it to the container class
        }

        // clicked on complete
        else if (e.target.dataset.type === 'complete') {

            // console.log("clicked on complete")
    
            const button = e.target.closest("button");
            const taskId = button.dataset.id; // Get the id from the button
    
            let stickyNote = null;
            document.querySelectorAll('.sticky-note').forEach(el => {
                if (el.dataset.id === taskId) {
                    stickyNote = el;
                }
              })

            // const stickyNote = document.querySelector(`.sticky-note[data-id="${taskId}"]`); // get the current stickynote from id
            const desc = stickyNote.querySelector('textarea').value;
    
            if (!confirm("Complete Task?")) return;
            stickyNote.remove()
    
            // Send data backend to be stored
            fetch("/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    type: "complete",
                    id: taskId,
                    desc: desc
                })
            })
            
        }
        else if (e.target.classList.contains('delete-btn')) {
            // console.log("clicked on delete button")

            if (!confirm("Delete Task?")) return;

            const taskId = e.target.dataset.id; // Get the id from the button
            // console.log("deleting task with id:", taskId)

            let stickyNote = null;
            document.querySelectorAll('.sticky-note').forEach(el => {
                if (el.dataset.id === taskId) {
                    stickyNote = el;
                }
              })

            stickyNote.remove() // remove the task from js 

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
        }
    });
});