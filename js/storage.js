let doctors = {};
let doctorDescriptions = {};

// Load appointments from localStorage on page load
document.addEventListener('DOMContentLoaded', (event) => {
    appointments = JSON.parse(localStorage.getItem('appointments')) || [];
});

// Fetch data from JSON files
async function loadDoctors() {
    try {
        let response = await fetch('../doctors.json');
        let data = await response.json();
        doctors = data;
        Object.keys(doctors).forEach(doctor => {
            doctorDescriptions[doctor] = doctors[doctor].description;
        });
    } catch (error) {
        console.error('Error loading doctors:', error);
    }
}

//Loading appointments
async function loadAppointments() {
    try {
        let response = await fetch('appointments.json');
        let data = await response.json();
        appointments = data;
    } catch (error) {
        console.error('Error loading appointments:', error);
    }
}

//Saving appointments
async function saveAppointments() {
    try {
        await fetch('appointments.json', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(appointments)
        });
    } catch (error) {
        console.error('Error saving appointments:', error);
    }
}
// Save doctors, descriptions, and appointments to localStorage
async function saveData() {
    localStorage.setItem('appointments', JSON.stringify(appointments));
    await saveAppointments();
}
