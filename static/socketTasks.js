
// @ts-nocheck
var socket = io(); // Connect to Flask-SocketIO Server

import { createTimer } from './helpers.js';


document.addEventListener('DOMContentLoaded', () => {

    // CREATE STICKY NOTES FROM EMIT
    socket.on("task", (data) => {

        // CONTANERS
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
        d.dataset.id = task.id // Store the associated task ID in a data attrbute
        d.classList.add('delete-btn'); // add the delete class
        d.textContent = "🗑️"; // Fill the text
        btnContainer.appendChild(d  ) // append it to the container class

        // Start button
        const s = document.createElement('button') // Create a <button> element for starting task
        s.classList.add('begin-btn'); // add the start class
        s.textContent = "Start"; // Fill the text
        s.dataset.type = "begin"
        s.dataset.id = task.id
        btnContainer.appendChild(s); // append it to the container class

        note.appendChild(btnContainer) // append button container to the note

        taskContainer.insertBefore(note, formContainer);  // Insert the new task before the formContainer
    });

    // CREATE TIMER ON EMIT
    socket.on("time", (data) => {
        const id = data.id
        const note = document.querySelector(`.sticky-note[data-id="${id}"]`);

        note.dataset.start = data.time

        createTimer(note);

    })


})