document.addEventListener('DOMContentLoaded', () => {

    // SEND TO BACKEND ON SAVE
    const text = document.querySelector('#text')
    document.querySelector('#save').addEventListener('click', () => {
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

    // CHECK FOR TIMERS
    function updateTimer(start){
        const diffMs = new Date() - start;
        const diffSec = Math.floor(diffMs/1000)
        // console.log(diffSec)
        return diffSec;
    }

    // Go through notes other than the form
    document.querySelectorAll('.sticky-note:not(.form-container)').forEach(note => { 
        const start = new Date(note.dataset.start)
        const id = note.dataset.id
        if (!start || start === "null") return; // Ignore if null or empty

        // console.log(start)

        const seconds = updateTimer(start);

        // Create the element
        const timer = document.createElement('p'); // create a p div for the timer
        timer.classList.add('timer'); // add timer class
        // Set the exact styles
        timer.style.margin = "0 auto";
        timer.style.textAlign = "center";
        timer.style.width = "fit-content";
        timer.textContent = seconds;
        const btnContainer = note.querySelector(`.btn-container[data-id="${id}"]`);
        note.insertBefore(timer, btnContainer);

        setInterval(() => {
            const seconds = updateTimer(start);
            timer.textContent = seconds;
        }, 1000); 
    })

    // Delete Button
    const deleteButton = document.querySelectorAll('.delete-btn');
    deleteButton.forEach(button => {
        button.addEventListener('click', () => { 
            const taskId = button.dataset.id; // Get the id from the button
            //console.log("deleting task with id:", taskId)
            const currentTask = document.querySelector(`.sticky-note[data-id="${taskId}"]`) // get the task based on current ID\
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
        })})

    // Begin Button
    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('begin-btn')) {
        const button = e.target; // get button element
        const taskId = button.dataset.id; // Get the id from the button
        button.classList.remove('begin-btn'); // Remove the begin class
        button.classList.add('complete-btn'); // add the started class
        button.textContent = "Complete"; // Fill th text

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
        })
        const btnContainer = document.querySelector(`.btn-container[data-id="${taskId}"]`);

        const c = document.createElement('button') // Create a <button> element for completion
        // c.classList.add('delete-btn'); // add the delete class
        c.textContent = "Pause"; // Fill th text
        btnContainer.appendChild(c) // append it to the container class
        }
    });

})