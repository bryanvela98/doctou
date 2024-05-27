// examp. of some doctors
const doctors = {
    "Dr. Bryan": ["10:00 AM", "11:00 AM", "1:00 PM", "3:00 PM"],
    "Dr. Pedro": ["9:00 AM", "12:00 PM", "2:00 PM", "4:00 PM"],
    "Dr. Mario": ["10:30 AM", "11:30 AM", "1:30 PM", "2:30 PM"]
};

function scheduleAppointment() {
    // Displaying all doctors
    let doctorNames = Object.keys(doctors);
    let doctorList = "Seleccione un doctor:\n";
    for (let i = 0; i < doctorNames.length; i++) {
        doctorList += (i + 1) + ". " + doctorNames[i] + "\n";
    }  
    // Saving a doctor choice in a variable
    let doctorChoice = parseInt(prompt(doctorList)) - 1;

    // Check if the choosen doctor is available
    if (doctorChoice >= 0 && doctorChoice < doctorNames.length) {
        let selectedDoctor = doctorNames[doctorChoice];
        let timeSlots = doctors[selectedDoctor];

        // Display available time slots for the selected doctor
        let timeSlotList = "Espacio disponible para " + selectedDoctor + ":\n";
        for (let i = 0; i < timeSlots.length; i++) {
            timeSlotList += (i + 1) + ". " + timeSlots[i] + "\n";
        }
        // Saving the picked slot choice in a variable
        let timeSlotChoice = parseInt(prompt(timeSlotList)) - 1;

        // Check if the time slot choice is valid
        if (timeSlotChoice >= 0 && timeSlotChoice < timeSlots.length) {
            let selectedTimeSlot = timeSlots[timeSlotChoice];
            alert("Su cita con " + selectedDoctor + " esta confirmada para " + selectedTimeSlot + ".");
        } else {
            alert("Espacio elegido no disponible. Por favor intente nuevamente con otro horario.");
        }
    } else {
        alert("Doctor elegido no disponible. Por favor intente nuevamente con otro doctor.");
    }
}