// examp. of some doctors
const doctors = {
    "Bryan": ["10:00 AM", "11:00 AM", "1:00 PM", "3:00 PM"],
    "Pedro": ["9:00 AM", "12:00 PM", "2:00 PM", "4:00 PM"],
    "Mario": ["10:30 AM", "11:30 AM", "1:30 PM", "2:30 PM"]
};

const doctorDescriptions = {
    "Bryan": "Especialista en cardiologia con 10 años de experiencia.",
    "Pedro": "Experto en neurología con foco en epilepsias.",
    "Mario": "Medico general."
};

// Function to handle key press events
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        setRole();
    }
}
// Role of the user: 0 for admin, 1 for patient
let role = null;

// Function to set the role and display relevant controls
function setRole() {
    role = parseInt(document.getElementById("roleInput").value);
    if (role === 0) {
        document.getElementById("adminControls").style.display = 'block';
        document.getElementById("patientControls").style.display = 'none';
    } else if (role === 1) {
        document.getElementById("adminControls").style.display = 'none';
        document.getElementById("patientControls").style.display = 'block';
    } else {
        alert("Dato ingresado inválido. Ingrese 0 si es admin, 1 si es paciente.");
    }
}

// Function to display doctors and their descriptions
function displayDoctors() {
    let doctorNames = Object.keys(doctors);
    let doctorList = "Seleccione un doctor:\n";
    doctorNames.forEach((doctor, index) => {
        doctorList += `${index + 1}. Dr. ${doctor}\n`;
    });
    return doctorList;
}

// Function to display available time slots for a selected doctor
function displayTimeSlots(doctorName) {
    let timeSlots = doctors[doctorName];
    let timeSlotList = "Tiempos disponibles para Dr. " + doctorName + ":\n";
    for (let i = 0; i < timeSlots.length; i++) {
        timeSlotList += (i + 1) + ". " + timeSlots[i] + "\n";
    }
    return timeSlotList;
}


// Function to get the doctor's choice from the user
function getDoctorChoice() {
    let doctorList = displayDoctors();
    let doctorChoice = parseInt(prompt(doctorList)) - 1;
    return doctorChoice;
}

// Function to get the time slot choice from the user
function getTimeSlotChoice(doctorName) {
    let timeSlotList = displayTimeSlots(doctorName);
    let timeSlotChoice = parseInt(prompt(timeSlotList)) - 1;
    return timeSlotChoice;
}

// Function to show doctors' descriptions in sorted order by name
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
}

// Function for admin to modify doctor information
function modifyDoctorInfo() {
    let doctorName = prompt("Ingrese el nombre del doctor a modificar:");
    if (doctors.hasOwnProperty(doctorName)) {
        let newDescription = prompt("Ingrese la nueva descripción:");
        let newTimeSlots = prompt("Ingrese el nuevo espacio de tiempo (separado por coma):");
        doctorDescriptions[doctorName] = newDescription;
        doctors[doctorName] = newTimeSlots.split(",").map(slot => slot.trim());
        alert(`La información del doctor ${doctorName} ha sido actualizada.`);
    } else {
        alert("Doctor no encontrado.");
    }
}

// Function for admin to modify scheduled appointments
function modifyAppointments() {
    let doctorName = prompt("Ingrese el nombre del doctor a modificar:");
    if (doctors.hasOwnProperty(doctorName)) {
        let newTimeSlots = prompt("Ingrese el nuevo espacio de tiempo (separado por coma):");
        doctors[doctorName] = newTimeSlots.split(",").map(slot => slot.trim());
        alert(`Las citas del doctor ${doctorName} han sido actualizadas.`);
    } else {
        alert("Doctor no encontrado.");
    }
}

// Main function to schedule an appointment
function scheduleAppointment() {
    let doctorNames = Object.keys(doctors);
    let doctorChoice = getDoctorChoice();

    if (doctorChoice >= 0 && doctorChoice < doctorNames.length) {
        let selectedDoctor = doctorNames[doctorChoice];
        let timeSlotChoice = getTimeSlotChoice(selectedDoctor);

        if (timeSlotChoice >= 0 && timeSlotChoice < doctors[selectedDoctor].length) {
            let selectedTimeSlot = doctors[selectedDoctor][timeSlotChoice];
            alert("Tu cita con Dr. " + selectedDoctor + " esta confirmada a las " + selectedTimeSlot + " horas.");
        } else {
            alert("Horario seleccionado invalido. Por favor, intente de nuevo.");
        }
    } else {
        alert("Doctor seleccionado invalido. Por favor, intente de nuevo.");
    }
}