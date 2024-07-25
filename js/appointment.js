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
        
        // SweetAlert for success
        Swal.fire({
            title: 'Éxito',
            text: 'La cita ha sido actualizada correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        }).then(() => {
            showAppointments();
            document.getElementById('appointmentForm').reset(); // Reset the form
            document.getElementById('editAppointmentForm').style.display = 'none'; // Hide the form
        });

    } else {
        // SweetAlert for error
        Swal.fire({
            title: 'Error',
            text: 'Datos ingresados inválidos. La cita no se ha actualizado.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
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