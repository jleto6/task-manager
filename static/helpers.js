// Helper Functions

// Continiously update the timer
export function updateTimer(start){
    const diffMs = new Date() - start; // Calculate the difference 
    const seconds = Math.floor(diffMs/1000) // Convert from ms to seconds
    const hours = Math.floor(seconds/3600) // Convert from seconds to hours
    const minutes = Math.floor((seconds % 3600) / 60) // Get remaining minutes less than an hour
    const remainingSeconds = Math.floor(seconds % 60) // Get remaining seconds less than a minute

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
}

// Create the timer element
export function createTimer(note){
    const start = new Date(note.dataset.start)
    const id = note.dataset.id
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
        timer.textContent = updateTimer(start);
    }, 1000); 
}

// Set time taken to complete a task 
export function setTime(start, end, note){
    start = new Date(start)
    end = new Date(end)
    const diffMs = end - start; // Calculate the difference 
    const seconds = Math.floor(diffMs/1000) // Convert from ms to seconds
    const hours = Math.floor(seconds/3600) // Convert from seconds to hours
    const minutes = Math.floor((seconds % 3600) / 60) // Get remaining minutes less than an hour
    const remainingSeconds = Math.floor(seconds % 60) // Get remaining seconds less than a minute

    const id = note.dataset.id

    // Create the element
    const timer = document.createElement('p'); // create a p div for the timer
    timer.classList.add('timer'); // add timer class

    // Set the exact styles
    timer.style.margin = "0 auto";
    timer.style.textAlign = "center";
    timer.style.width = "fit-content";
    timer.textContent = `Duration: ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    const btnContainer = note.querySelector(`.btn-container[data-id="${id}"]`);
    note.insertBefore(timer, btnContainer);

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
}