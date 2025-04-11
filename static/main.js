import { handleClick, handleInput } from './events.js';
import { createTimer, setTime } from './timer.js';

document.addEventListener('DOMContentLoaded', () => {

    // Handle clicks and input events
    document.body.addEventListener('click', handleClick);
    document.body.addEventListener('input', handleInput);

    // Go through completed notes
    document.querySelectorAll('.sticky-note:not(.form-container)').forEach(note => { 
        if (note.dataset.end) { // If there is a end date, show time taken to complete
            setTime(note.dataset.start, note.dataset.end, note)
        }
    });

});