import { formatLocalTimestamp } from './timer.js';

export function handleClick(e){

    console.log("clicked")

    // ======= CLICKED ON SAVE =======
    if (e.target === document.querySelector('#save')){
        const text = document.querySelector('#text')
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
    }}
  
    // ======= CLICKED ON BEGIN =======
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


    // ======= CLICKED ON COMPLETE =======
    else if (e.target.dataset.type === 'complete') {
        // get task info
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

        // if time set manually
        // console.log(localStorage.getItem('saved'))
        if (localStorage.getItem(`saved-${taskId}`) === 'true'){

            const rawStart = stickyNote.dataset.start;
            const startTime = new Date(rawStart.replace(' ', 'T'));

            if (!confirm("Complete Task? MANUALLY")) return;
            stickyNote.remove()

            const setTime = localStorage.getItem(`setTime-${taskId}`)
            console.log(setTime)
                    
            const [hours, minutes, seconds] = setTime.split(':').map(Number);
            const durationMs = ((hours * 60 + minutes) * 60 + seconds) * 1000;
            const completedTime = new Date(startTime.getTime() + durationMs);

            const completedStr = formatLocalTimestamp(completedTime); // "2025-04-10 01:32:53"

            console.log(completedStr)

            // Send data backend to be stored
            fetch("/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    type: "complete",
                    manual: true, 
                    time: completedStr,
                    id: taskId,
                    desc: desc
                })
            })
            return;
        }

        // if normal timer
        if (!confirm("Complete Task?")) return;

        // console.log(new Date())

        const formattedDate = formatLocalTimestamp(new Date()); 

        stickyNote.remove()

        // Send data backend to be stored
        fetch("/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                type: "complete",
                time: formattedDate,
                id: taskId,
                desc: desc
            })
        })
    }

    // ======= CLICKED ON DELETE =======
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
}

// ======= Handle Input Changes =======
export function handleInput(e){

    // console.log("Input Change From:", e.target)

    // console.log(e.target.tagName)

    if (e.target.tagName === 'TEXTAREA') {
        // console.log("Input Changed to: ", e.target.value, "On ID: ", e.target.dataset.id);
        setTimeout(() => {
            // code to run after the delay
            const taskId = e.target.dataset.id // get the id

            // find the task based on id
            let stickyNote = null;
            document.querySelectorAll('.sticky-note').forEach(el => {
                if (el.dataset.id === taskId) {
                    stickyNote = el;
                }
                })

                let textarea = stickyNote.querySelector('textarea');
                let content = textarea.value;

            //   console.log(content)

            // Send updated text to backend
            fetch("/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    type: "editText",
                    desc: content,
                    id: taskId
                })
            });

        }, 1000); // 1000 milliseconds = 1 second
    }
    
    if (e.target.tagName === 'SPAN') {
        console.log("Input Changed to: ", e.target.innerText, "On ID: ", e.target.dataset.id);

        setTimeout(() => {

            // Send updated text to backend
            fetch("/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    type: "editDate",
                    date: e.target.innerText,
                    id: e.target.dataset.id
                })
            });
        }, 1000); // 1000 milliseconds = 1 second

    }
    

}