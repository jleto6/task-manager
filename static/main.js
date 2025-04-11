import { handleClick, handleInput } from './events.js';
import { createTimer, setTime } from './timer.js';

document.addEventListener('DOMContentLoaded', () => {

    document.body.addEventListener('click', handleClick);
    document.body.addEventListener('input', handleInput);

    // Go through all COMPLETED notes
    document.querySelectorAll('.sticky-note:not(.form-container)').forEach(note => { 
        // If there is a end date, show time taken to complete
        if (note.dataset.end) {
            setTime(note.dataset.start, note.dataset.end, note)
        }
    });

});