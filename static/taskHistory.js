import { setTime } from './helpers.js';

document.addEventListener('DOMContentLoaded', () => {

    let created = false;
    let created2 = false

    // Go through all COMPLETED notes
    document.querySelectorAll('.sticky-note:not(.form-container)').forEach(note => { 

        // need to create individual divs for week and month to seperate out 

        // If there is a end date, show time taken to complete
        if (note.dataset.end) {
            setTime(note.dataset.start, note.dataset.end, note)
        }


    })

})
