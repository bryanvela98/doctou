
// Role of the user: 0 for admin, 1 for patient
let role = null;

// Function to handle key press events
document.getElementById('roleInput').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        setRole();
    }
});


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