import { formatLocalTimestamp, formatStrDate } from './timer.js';

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

        let stickyNote
        document.querySelectorAll('.sticky-note').forEach(el => {
            if (el.dataset.id === taskId) {
                stickyNote = el;
        }})


        // STARTED TIME
        const t = document.createElement('p'); // Create a <p> element to hold the text
        t.dataset.id = taskId // Store the task ID in a data attrribute
        t.classList.add("started")
        t.textContent = "Started On: " // outer text

        const startedDate = formatLocalTimestamp(new Date())

        const span = document.createElement('span') // Create a span element to hold text
        span.contentEditable = true;
        span.dataset.id = taskId;
        span.textContent = startedDate; // Fill th text

        t.appendChild(span)
        t.style = "font-size: 12px; text-align: center; width: 100%;"

        const btnContainer = stickyNote.querySelector(`.btn-container[data-id='${taskId}']`);

        stickyNote.insertBefore(t, btnContainer);

        console.log(new Date())
        
        // Send id to backend to be begined
        fetch("/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                type: "begin",
                time: (new Date().toLocaleString()),
                id: taskId
            })
        })

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
        const desc = stickyNote.querySelector('textarea').value; // get description

        // IF TIME SET MANUALLY
        // console.log(localStorage.getItem('saved'))
        if (localStorage.getItem(`saved-${taskId}`) === 'true'){

            const rawStart = stickyNote.dataset.start;

            console.log(rawStart)

            const startTime = new Date(rawStart.replace(' ', 'T'));

            const setTime = localStorage.getItem(`setTime-${taskId}`)

            console.log(setTime)


            if (!confirm("Complete Task? MANUALLY")) return;
            stickyNote.remove()

                    
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

        // IF TIMED TASK
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

// ======= HANDLE INPUT CHANGES =======
export function handleInput(e){

    // console.log("Input Change From:", e.target)
    // console.log(e.target.tagName)

    // For description changes
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
    
    // For date changes
    if (e.target.tagName === 'SPAN') {
        console.log("Input Changed to: ", e.target.innerText, "On ID: ", e.target.dataset.id);

        setTimeout(() => {

            // find the task based on id
            let stickyNote = null;
            document.querySelectorAll('.sticky-note').forEach(el => {
                if (el.dataset.id === e.target.dataset.id) {
                    stickyNote = el;
            }
            })

            const dateObject = (formatStrDate(e.target.innerText));
            stickyNote.dataset.start = dateObject;
            console.log(stickyNote.dataset.start)

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