let doctors = {};
let doctorDescriptions = {};

// Load appointments from localStorage on page load
document.addEventListener('DOMContentLoaded', (event) => {
    appointments = JSON.parse(localStorage.getItem('appointments')) || [];
});

// Fetch data from JSON files
async function loadDoctors() {
    try {
        let response = await fetch('doctors.json');
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

// Function to handle key press events
document.getElementById('roleInput').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        setRole();
    }
});

// Role of the user: 0 for admin, 1 for patient
let role = null;

// Function to hide all forms
function hideAllForms() {
    document.getElementById('addDoctorForm').style.display = 'none';
    document.getElementById('editDoctorForm').style.display = 'none';
    document.getElementById('editAppointmentForm').style.display = 'none';
}

// Function to set the role and display relevant controls
function setRole() {
    hideAllForms()
    role = parseInt(document.getElementById("roleInput").value);
    const outputDiv = document.getElementById("output");
    outputDiv.innerHTML = ""; // Clear the output div

    if (role === 0) {
        document.getElementById("adminControls").style.display = 'block';
        document.getElementById("patientControls").style.display = 'none';
    } else if (role === 1) {
        document.getElementById("adminControls").style.display = 'none';
        document.getElementById("patientControls").style.display = 'block';
    } else {
        outputDiv.innerHTML = "<p>Dato ingresado inválido. Ingrese 0 si es admin, 1 si es paciente.</p>";
    }
}

// Function to display doctors and their descriptions
function showDoctors() {
    hideAllForms();
    let doctorNames = Object.keys(doctors);
    doctorNames.sort(); // Sorting doctors by name

    let outputDiv = document.getElementById("output");
    outputDiv.innerHTML = "<h2>Doctores Disponibles:</h2>";

    doctorNames.forEach(doctor => {
        let doctorInfo = `<p><strong>Dr. ${doctor}:</strong> ${doctorDescriptions[doctor]}</p>`;
        outputDiv.innerHTML += doctorInfo;
    });

    if (role === 0) {
        outputDiv.innerHTML += '<h3>Modificar o Eliminar Doctores</h3>';
        doctorNames.forEach((doctor, index) => {
            outputDiv.innerHTML += `<p>${index + 1}. Dr. ${doctor} <button onclick="showEditDoctorForm('${doctor}')">Editar</button> <button onclick="removeDoctor('${doctor}')">Eliminar</button></p>`;
        });
    }
}


function showAddDoctorForm() {
    hideAllForms();
    document.getElementById('addDoctorForm').style.display = 'block';
    document.getElementById('output').innerHTML = '';

}
// Function to handle the add doctor form submission
document.getElementById('doctorForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    let newDoctorName = document.getElementById('doctorName').value.trim();
    let newDescription = document.getElementById('doctorDescription').value.trim();
    let newTimeSlotsString = document.getElementById('timeSlots').value.trim();

    if (newDoctorName && !doctors.hasOwnProperty(newDoctorName)) {
        let newTimeSlots = newTimeSlotsString.split(",").map(slot => slot.trim());

        doctors[newDoctorName] = { description: newDescription, timeSlots: newTimeSlots };
        doctorDescriptions[newDoctorName] = newDescription;
        saveData();
        document.getElementById('output').innerHTML = `<p>El doctor ${newDoctorName} ha sido agregado exitosamente.</p>`;
        showDoctors();
        document.getElementById('doctorForm').reset(); // Reset the form
        document.getElementById('addDoctorForm').style.display = 'none'; // Hide the form
    } else if (doctors.hasOwnProperty(newDoctorName)) {
        document.getElementById('output').innerHTML = `<p>El doctor ${newDoctorName} ya existe.</p>`;
    } else {
        document.getElementById('output').innerHTML = "<p>Datos ingresados inválidos. El doctor no ha sido agregado.</p>";
    }
});


// Function to show the edit doctor form
function showEditDoctorForm(doctorName) {
    hideAllForms();
    document.getElementById('editDoctorName').value = doctorName;
    document.getElementById('editDescription').value = doctorDescriptions[doctorName];
    document.getElementById('editTimeSlots').value = doctors[doctorName].timeSlots.join(", ");
    document.getElementById('editDoctorForm').style.display = 'block';
    document.getElementById('output').innerHTML = '';
}

// Function to handle the edit doctor form submission
document.getElementById('editDoctorFormContent').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    let doctorName = document.getElementById('editDoctorName').value.trim();
    let newDescription = document.getElementById('editDescription').value.trim();
    let newTimeSlotsString = document.getElementById('editTimeSlots').value.trim();

    if (doctorName && newDescription && newTimeSlotsString) {
        let newTimeSlots = newTimeSlotsString.split(",").map(slot => slot.trim());

        doctorDescriptions[doctorName] = newDescription;
        doctors[doctorName].timeSlots = newTimeSlots;
        saveData();
        document.getElementById('output').innerHTML = `<p>La información del doctor ${doctorName} ha sido actualizada.</p>`;
        showDoctors();
        document.getElementById('editDoctorFormContent').reset(); // Reset the form
        document.getElementById('editDoctorForm').style.display = 'none'; // Hide the form
    } else {
        document.getElementById('output').innerHTML = "<p>Datos ingresados inválidos. La información del doctor no se ha actualizado.</p>";
    }
});

// Function to remove a doctor with SweetAlert confirmation
function removeDoctor(doctorName) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: `Deseas eliminar al doctor ${doctorName}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Remove the doctor
            delete doctors[doctorName];
            delete doctorDescriptions[doctorName];
            saveData();
            Swal.fire(
                'Eliminado!',
                `El doctor ${doctorName} ha sido eliminado.`,
                'success'
            );
            showDoctors(); // Refresh the list of doctors
        } else {
            Swal.fire(
                'Cancelado',
                `La eliminación del doctor ${doctorName} ha sido cancelada.`,
                'info'
            );
        }
    });
}


// Function to display appointments
function showAppointments() {
    hideAllForms();
    let outputDiv = document.getElementById("output");
    outputDiv.innerHTML = "<h2>Citas Programadas:</h2>";

    if (appointments.length === 0) {
        outputDiv.innerHTML += "<p>No hay citas programadas.</p>";
    } else {
        appointments.forEach((appointment, index) => {
            outputDiv.innerHTML += `<p>${index + 1}. Dr. ${appointment.doctor} - ${appointment.timeSlot} <button onclick="showEditAppointmentForm(${index})">Editar</button> <button onclick="removeAppointment(${index})">Eliminar</button></p>`;
        });
    }
}
// Function to show the edit appointment form
function showEditAppointmentForm(index) {
    // Ensure appointments are loaded from localStorage
    appointments = JSON.parse(localStorage.getItem('appointments')) || [];

    let appointment = appointments[index];
    if (appointment) {
        document.getElementById('editDoctor').value = appointment.doctor;
        document.getElementById('editTimeSlot').value = appointment.timeSlot;
        document.getElementById('appointmentIndex').value = index;
        document.getElementById('editAppointmentForm').style.display = 'block';
        document.getElementById('output').innerHTML = '';
    } else {
        document.getElementById('output').innerHTML = '<p>No se encontró la cita para editar.</p>';
    }
}

// Function to handle the edit appointment form submission
document.getElementById('appointmentForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    let index = document.getElementById('appointmentIndex').value;
    let newDoctor = document.getElementById('editDoctor').value.trim();
    let newTimeSlot = document.getElementById('editTimeSlot').value.trim();

    if (newDoctor && newTimeSlot) {
        appointments[index] = {
            doctor: newDoctor,
            timeSlot: newTimeSlot
        };
        saveData();
        document.getElementById('output').innerHTML = `<p>La cita ha sido actualizada.</p>`;
        showAppointments();
        document.getElementById('appointmentForm').reset(); // Reset the form
        document.getElementById('editAppointmentForm').style.display = 'none'; // Hide the form
    } else {
        document.getElementById('output').innerHTML = "<p>Datos ingresados inválidos. La cita no se ha actualizado.</p>";
    }
});


// Function to remove an appointment with confirmation
function removeAppointment(index) {
    let appointment = appointments[index];
    
    Swal.fire({
        title: '¿Estás seguro?',
        text: `Deseas eliminar la cita con Dr. ${appointment.doctor} a las ${appointment.timeSlot}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Remove the appointment
            appointments.splice(index, 1);
            saveData();
            Swal.fire(
                'Eliminado!',
                'La cita ha sido eliminada.',
                'success'
            );
            showAppointments(); // Refresh the list of appointments
        } else {
            Swal.fire(
                'Cancelado',
                'La eliminación de la cita ha sido cancelada.',
                'info'
            );
        }
    });
}

// Function to display available time slots for a selected doctor
function displayTimeSlots(doctorName) {
    let timeSlots = doctors[doctorName];
    let timeSlotList = `<h3>Tiempos disponibles para Dr. ${doctorName}:</h3>`;
    for (let i = 0; i < timeSlots.length; i++) {
        timeSlotList += `<p>${i + 1}. ${timeSlots[i]}</p>`;
    }
    return timeSlotList;
}

// Function to handle the appointment form submission
function submitAppointmentForm(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const selectedDoctor = document.getElementById("doctorSelect").value;
    const selectedTimeSlot = document.getElementById("timeSlotSelect").value;

    if (selectedDoctor && selectedTimeSlot) {
        appointments.push({
            doctor: selectedDoctor,
            timeSlot: selectedTimeSlot
        });
        saveData();
        Swal.fire({
            title: 'Cita Confirmada',
            text: `Tu cita con Dr. ${selectedDoctor} está confirmada a las ${selectedTimeSlot} horas.`,
            icon: 'success'
        });
    } else {
        Swal.fire({
            title: 'Error',
            text: 'Debe seleccionar un doctor y un horario.',
            icon: 'error'
        });
    }
}

// Main function to schedule an appointment
function scheduleAppointment() {
    let outputDiv = document.getElementById("output");
    outputDiv.innerHTML = `<h2>Programar una Cita</h2>
        <form id="appointmentForm">
            <label for="doctorSelect">Seleccione un Doctor:</label>
            <select id="doctorSelect" onchange="updateTimeSlots()">
                <option value="">Seleccione</option>
                ${Object.keys(doctors).map(doctor => `<option value="${doctor}">Dr. ${doctor}</option>`).join('')}
            </select><br>
            <label for="timeSlotSelect">Seleccione un Horario:</label>
            <select id="timeSlotSelect">
                <option value="">Seleccione</option>
            </select><br>
            <button class="button" onclick="submitAppointmentForm(event)">Confirmar Cita</button>
        </form>`;
}

// Function to update time slots when a doctor is selected
function updateTimeSlots() {
    let doctorSelect = document.getElementById("doctorSelect");
    let selectedDoctor = doctorSelect.value;
    let timeSlotSelect = document.getElementById("timeSlotSelect");

    if (selectedDoctor) {
        let timeSlots = doctors[selectedDoctor].timeSlots;
        timeSlotSelect.innerHTML = timeSlots.map(slot => `<option value="${slot}">${slot}</option>`).join('');
    } else {
        timeSlotSelect.innerHTML = '<option value="">Seleccione</option>';
    }
}

// Load initial data and initialize the application
loadDoctors().then(() => {
    loadAppointments().then(() => {
        saveData();
    });
});