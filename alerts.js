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
            icon: 'success',
            title: 'Cita Confirmada',
            text: `Tu cita con Dr. ${selectedDoctor} esta confirmada a las ${selectedTimeSlot} horas.`,
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Debe seleccionar un doctor y un horario.',
        });
    }
}