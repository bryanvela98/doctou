// Example of some doctors
const doctors = JSON.parse(localStorage.getItem('doctors')) || {
    "Bryan": ["10:00 AM", "11:00 AM", "1:00 PM", "3:00 PM"],
    "Pedro": ["9:00 AM", "12:00 PM", "2:00 PM", "4:00 PM"],
    "Mario": ["10:30 AM", "11:30 AM", "1:30 PM", "2:30 PM"]
};

const doctorDescriptions = JSON.parse(localStorage.getItem('doctorDescriptions')) || {
    "Bryan": "Especialista en cardiologia con 10 años de experiencia.",
    "Pedro": "Experto en neurología con foco en epilepsias.",
    "Mario": "Medico general."
};

const appointments = JSON.parse(localStorage.getItem('appointments')) || [];

// Save doctors, descriptions, and appointments to localStorage
function saveData() {
    localStorage.setItem('doctors', JSON.stringify(doctors));
    localStorage.setItem('doctorDescriptions', JSON.stringify(doctorDescriptions));
    localStorage.setItem('appointments', JSON.stringify(appointments));
}

// Function to handle key press events
document.getElementById('roleInput').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        setRole();
    }
});

// Role of the user: 0 for admin, 1 for patient
let role = null;

// Function to set the role and display relevant controls
function setRole() {
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
    let doctorNames = Object.keys(doctors);
    doctorNames.sort(); // Sorting doctors by name

    // Creating HTML content to display doctor descriptions
    let outputDiv = document.getElementById("output");
    outputDiv.innerHTML = "<h2>Doctores Disponibles:</h2>";

    doctorNames.forEach(doctor => {
        let doctorInfo = `<p><strong>Dr. ${doctor}:</strong> ${doctorDescriptions[doctor]}</p>`;
        outputDiv.innerHTML += doctorInfo;
    });

    if (role === 0) {
        outputDiv.innerHTML += '<h3>Modificar o Eliminar Doctores</h3>';
        doctorNames.forEach((doctor, index) => {
            outputDiv.innerHTML += `<p>${index + 1}. Dr. ${doctor} <button onclick="editDoctor('${doctor}')">Editar</button> <button onclick="removeDoctor('${doctor}')">Eliminar</button></p>`;
        });
    }
}


// Function to add a new doctor
function addDoctor() {
    let newDoctorName = prompt("Ingrese el nombre del nuevo doctor:");
    if (newDoctorName && !doctors.hasOwnProperty(newDoctorName)) {
        let newDescription = prompt("Ingrese la descripción para Dr. " + newDoctorName + ":");
        let newTimeSlotsString = prompt("Ingrese los horarios disponibles (separados por coma y en formato de hora AM/PM) para Dr. " + newDoctorName + ":");

        // Convert input string into an array of time slots
        let newTimeSlots = newTimeSlotsString.split(",").map(slot => slot.trim());

        doctors[newDoctorName] = newTimeSlots;
        doctorDescriptions[newDoctorName] = newDescription;
        saveData();
        document.getElementById("output").innerHTML = `<p>El doctor ${newDoctorName} ha sido agregado exitosamente.</p>`;
        showDoctors();
    } else if (doctors.hasOwnProperty(newDoctorName)) {
        document.getElementById("output").innerHTML = `<p>El doctor ${newDoctorName} ya existe.</p>`;
    } else {
        document.getElementById("output").innerHTML = "<p>Datos ingresados inválidos. El doctor no ha sido agregado.</p>";
    }
}

// Function to edit a doctor's information
function editDoctor(doctorName) {
    let newDescription = prompt("Ingrese la nueva descripción para Dr. " + doctorName + ":", doctorDescriptions[doctorName]);
    let newTimeSlots = prompt("Ingrese el nuevo espacio de tiempo (separado por coma) para Dr. " + doctorName + ":", doctors[doctorName].join(", "));
    doctorDescriptions[doctorName] = newDescription;
    doctors[doctorName] = newTimeSlots.split(",").map(slot => slot.trim());
    saveData();
    document.getElementById("output").innerHTML = `<p>La información del doctor ${doctorName} ha sido actualizada.</p>`;
    showDoctors();
}

// Function to remove a doctor
function removeDoctor(doctorName) {
    delete doctors[doctorName];
    delete doctorDescriptions[doctorName];
    saveData();
    document.getElementById("output").innerHTML = `<p>El doctor ${doctorName} ha sido eliminado.</p>`;
    showDoctors();
}

// Function to display appointments
function showAppointments() {
    let outputDiv = document.getElementById("output");
    outputDiv.innerHTML = "<h2>Citas Programadas:</h2>";

    if (appointments.length === 0) {
        outputDiv.innerHTML += "<p>No hay citas programadas.</p>";
    } else {
        appointments.forEach((appointment, index) => {
            outputDiv.innerHTML += `<p>${index + 1}. Dr. ${appointment.doctor} - ${appointment.timeSlot} <button onclick="editAppointment(${index})">Editar</button> <button onclick="removeAppointment(${index})">Eliminar</button></p>`;
        });
    }
}

// Function to edit an appointment
function editAppointment(index) {
    let appointment = appointments[index];
    let newDoctor = prompt("Ingrese el nuevo nombre del doctor:", appointment.doctor);
    let newTimeSlot = prompt("Ingrese el nuevo horario:", appointment.timeSlot);

    if (newDoctor && newTimeSlot) {
        appointments[index] = {
            doctor: newDoctor,
            timeSlot: newTimeSlot
        };
        saveData();
        document.getElementById("output").innerHTML = `<p>La cita ha sido actualizada.</p>`;
        showAppointments();
    } else {
        document.getElementById("output").innerHTML = "<p>Datos ingresados inválidos. La cita no se ha actualizado.</p>";
    }
}

// Function to remove an appointment
function removeAppointment(index) {
    appointments.splice(index, 1);
    saveData();
    document.getElementById("output").innerHTML = "<p>La cita ha sido eliminada.</p>";
    showAppointments();
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
        document.getElementById("output").innerHTML = `<p>Tu cita con Dr. ${selectedDoctor} esta confirmada a las ${selectedTimeSlot} horas.</p>`;
    } else {
        document.getElementById("output").innerHTML = "<p>Debe seleccionar un doctor y un horario.</p>";
    }
}

// Main function to schedule an appointment
function scheduleAppointment() {
    let doctorNames = Object.keys(doctors);
    doctorNames.sort();

    // Creating HTML content for the appointment form
    let formHtml = `
        <form id="appointmentForm">
            <label for="doctorSelect">Seleccione un doctor:</label>
            <select id="doctorSelect" onchange="updateTimeSlots()">
                <option value="">Seleccione</option>
                ${doctorNames.map(doctor => `<option value="${doctor}">Dr. ${doctor}</option>`).join('')}
            </select>
            <br>
            <label for="timeSlotSelect">Seleccione un horario:</label>
            <select id="timeSlotSelect">
                <option value="">Seleccione</option>
            </select>
            <br>
            <button type="submit">Confirmar Cita</button>
        </form>
    `;

    document.getElementById("output").innerHTML = formHtml;
    document.getElementById("appointmentForm").addEventListener("submit", submitAppointmentForm);
}

// Function to update time slots when a doctor is selected
function updateTimeSlots() {
    const doctorSelect = document.getElementById("doctorSelect").value;
    const timeSlotSelect = document.getElementById("timeSlotSelect");

    if (doctorSelect) {
        let timeSlots = doctors[doctorSelect];
        timeSlotSelect.innerHTML = '<option value="">Seleccione</option>' + timeSlots.map(slot => `<option value="${slot}">${slot}</option>`).join('');
    } else {
        timeSlotSelect.innerHTML = '<option value="">Seleccione</option>';
    }
}

// Save initial data to localStorage if not already saved
saveData();
