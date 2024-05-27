// examp. of some doctors
const doctors = {
    "Dr. Bryan": ["10:00 AM", "11:00 AM", "1:00 PM", "3:00 PM"],
    "Dr. Pedro": ["9:00 AM", "12:00 PM", "2:00 PM", "4:00 PM"],
    "Dr. Mario": ["10:30 AM", "11:30 AM", "1:30 PM", "2:30 PM"]
};

// Displaying all doctors
function displayDoctors() {
    let doctorNames = Object.keys(doctors);
    let doctorList = "Seleccione un doctor:\n";
    for (let i = 0; i < doctorNames.length; i++) {
        doctorList += (i + 1) + ". " + doctorNames[i] + "\n";
    }
    return doctorList;
}

// Display available time slots for the selected doctor
function displayTimeSlots(doctorName) {
    let timeSlots = doctors[doctorName];
    let timeSlotList = "Tiempos disponibles para " + doctorName + ":\n";
    for (let i = 0; i < timeSlots.length; i++) {
        timeSlotList += (i + 1) + ". " + timeSlots[i] + "\n";
    }
    return timeSlotList;
}


// Saving a doctor choice
function getDoctorChoice() {
    let doctorList = displayDoctors();
    let doctorChoice = parseInt(prompt(doctorList)) - 1;
    return doctorChoice;
}

// Saving the picked slot choice
function getTimeSlotChoice(doctorName) {
    let timeSlotList = displayTimeSlots(doctorName);
    let timeSlotChoice = parseInt(prompt(timeSlotList)) - 1;
    return timeSlotChoice;
}

//main function
function scheduleAppointment() {
    let doctorNames = Object.keys(doctors);
    let doctorChoice = getDoctorChoice();

    if (doctorChoice >= 0 && doctorChoice < doctorNames.length) {
        let selectedDoctor = doctorNames[doctorChoice];
        let timeSlotChoice = getTimeSlotChoice(selectedDoctor);

        if (timeSlotChoice >= 0 && timeSlotChoice < doctors[selectedDoctor].length) {
            let selectedTimeSlot = doctors[selectedDoctor][timeSlotChoice];
            alert("Tu cita con " + selectedDoctor + " esta confirmada a las " + selectedTimeSlot + " horas.");
        } else {
            alert("Horario seleccionado invalido. Por favor, intente de nuevo.");
        }
    } else {
        alert("Doctor seleccionado invalido. Por favor, intente de nuevo.");
    }
}