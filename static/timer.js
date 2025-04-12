
// ======= CHECK FOR TIMERS =======
// Go through all notes other than the form and see if theyve been started
document.querySelectorAll('.sticky-note:not(.form-container)').forEach(note => { 

    // Create Timer only if there is a start time
    if (note.dataset.start !== "None" && !note.dataset.end) {
        createTimer(note);
    }
})

// ======= UPDATE TIMER =======
export function updateTimer(start){
    const diffMs = new Date() - start; // Calculate the difference 
    const seconds = Math.floor(diffMs/1000) // Convert from ms to seconds
    const hours = Math.floor(seconds/3600) // Convert from seconds to hours
    const minutes = Math.floor((seconds % 3600) / 60) // Get remaining minutes less than an hour
    const remainingSeconds = Math.floor(seconds % 60) // Get remaining seconds less than a minute

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
}

// ======= CREATE THE TIMER =======
export function createTimer(note){
    const start = new Date(note.dataset.start)
    const id = note.dataset.id

    let seconds
    if (localStorage.getItem(`saved-${id}`) !== 'true'){
        seconds = updateTimer(start);
    }

    // Create the elements
    const container = document.createElement('div') // create a container
    container.classList.add("btn-container")

    const timer = document.createElement('p'); // create a p div for the timer
    timer.contentEditable = true;
    timer.classList.add('timer'); // add timer class

    if (seconds){
        timer.textContent = seconds;
    }
    else{
        console.log(localStorage.getItem(`setTime-${id}`))
        timer.textContent = (localStorage.getItem(`setTime-${id}`));
    }

    const btnContainer = note.querySelector(`.btn-container[data-id="${id}"]`);
    const startedLabel = note.querySelector(`.started[data-id="${id}"]`);

    container.append(timer)

    note.insertBefore(container, startedLabel);


    // ALLOW EDITING TIME
    const saveButton = document.createElement('button'); // create a p div for the edit button
        saveButton.textContent = "💾";
        saveButton.style.fontSize = "0.9em";
        saveButton.title = "Edit time manually";
        saveButton.tabIndex = 0;
        saveButton.dataset.id = id

    let isEditingTimer = false;
    timer.addEventListener('focus', () => {
        // isEditingTimer = true;
        isEditingTimer = true;
        container.append(saveButton)

    });

    // CHECK FOR CLICKS
    document.body.addEventListener('click', (e) => {
        // clicked on begin
        if (e.target === saveButton) {
            // console.log("clicked on save w current time: ", timer.textContent)
            seconds = timer.textContent;
            localStorage.setItem(`setTime-${id}`, seconds);

            localStorage.setItem(`saved-${id}`, 'true');
            }
    });

    // if not set time manually and not focused
    timer.addEventListener('blur', () => {
        setTimeout(() => {
            if (document.activeElement !== saveButton) {
                isEditingTimer = false;
                container.removeChild(saveButton);
            }
        }, 10); // just enough time to catch the click
    });
    
    // Increment counter if not editing or set manually
    setInterval(() => {
        // console.log(localStorage.getItem('saved'))
        if (!isEditingTimer && (localStorage.getItem(`saved-${id}`) !== 'true')){
            timer.textContent = updateTimer(start);
        }
    }, 1000); 


}

// ======= FORMAT TIME FUNCTION =======
export function formatLocalTimestamp(date) {
    const yy = String(date.getFullYear()).slice(-2);
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
  
    let hours = date.getHours();
    const mi = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
  
    hours = hours % 12;
    hours = hours ? hours : 12; // hour 0 should be 12
    const hh = String(hours).padStart(2, '0');
  
    return `${mm}/${dd}/${yy} ${hh}:${mi} ${ampm}`;
  }

// ======= FORMAT STRDATE: "MM/DD/YY HH:MM AM/PM" → "YYYY-MM-DD HH:MM:SS" =======
export function formatStrDate(str) {
    const [datePart, timePart, meridiem] = str.split(' ');
    const [month, day, yearShort] = datePart.split('/');
    const [hourRaw, minute] = timePart.split(':');
  
    const year = String(parseInt(yearShort, 10) + 2000);
    let hour = parseInt(hourRaw, 10);
  
    if (meridiem === 'PM' && hour !== 12) hour += 12;
    if (meridiem === 'AM' && hour === 12) hour = 0;
  
    const yyyy = year;
    const mm = month.padStart(2, '0');
    const dd = day.padStart(2, '0');
    const hh = String(hour).padStart(2, '0');
    const mi = minute.padStart(2, '0');
    const ss = '00';
  
    return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
  }

// ======= SET TIME TAKEN =======
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