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
document.getElementById('doctorForm').addEventListener('submit', function (event) {
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
document.getElementById('editDoctorFormContent').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    let doctorName = document.getElementById('editDoctorName').value.trim();
    let newDescription = document.getElementById('editDescription').value.trim();
    let newTimeSlotsString = document.getElementById('editTimeSlots').value.trim();

    if (doctorName && newDescription && newTimeSlotsString) {
        let newTimeSlots = newTimeSlotsString.split(",").map(slot => slot.trim());

        doctorDescriptions[doctorName] = newDescription;
        doctors[doctorName].timeSlots = newTimeSlots;
        saveData();
        // SweetAlert for success
        Swal.fire({
            title: 'Éxito',
            text: 'El doctor ha sido actualizado con éxito.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        }).then(() => {
            showDoctors();
            document.getElementById('editDoctorFormContent').reset(); // Reset the form
            document.getElementById('editDoctorForm').style.display = 'none'; // Hide the form
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


// Function to display available time slots for a selected doctor
function displayTimeSlots(doctorName) {
    let timeSlots = doctors[doctorName];
    let timeSlotList = `<h3>Tiempos disponibles para Dr. ${doctorName}:</h3>`;
    for (let i = 0; i < timeSlots.length; i++) {
        timeSlotList += `<p>${i + 1}. ${timeSlots[i]}</p>`;
    }
    return timeSlotList;
}