document.getElementById('submit').addEventListener('click', async function () {
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const email = document.getElementById('email').value;
    const color = document.getElementById('colorPicker').value;

    if (name && age && email) {
        const userDetails = { name, age, email, favoriteColor: color };

        try {
            const response = await fetch('http://localhost:5000/addUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userDetails),
            });

            if (response.ok) {
                alert('Details saved successfully!');
                const tableBody = document.getElementById('detailsTable').querySelector('tbody');
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td>${name}</td>
                    <td>${age}</td>
                    <td>${email}</td>
                    <td style="background-color: ${color};">${color}</td>
                    <td>
                        <button class="edit-btn">Edit</button>
                        <button class="delete-btn">Delete</button>
                        <button class="change-color-btn">Change Color</button>
                    </td>
                `;
                tableBody.appendChild(newRow);

                newRow.querySelector('.edit-btn').addEventListener('click', () => editRow(newRow, userDetails));
                newRow.querySelector('.delete-btn').addEventListener('click', () => deleteRow(newRow, userDetails));
                newRow.querySelector('.change-color-btn').addEventListener('click', () => changeColor(newRow));
                document.getElementById('name').value = '';
                document.getElementById('age').value = '';
                document.getElementById('email').value = '';
                document.getElementById('colorPicker').value = '#000000';
            } else {
                alert('Failed to save details.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while saving details.');
        }
    } else {
        alert('Please fill out all fields.');
    }
});
async function editRow(row, userDetails) {
    const cells = row.querySelectorAll('td');
    document.getElementById('name').value = cells[0].textContent;
    document.getElementById('age').value = cells[1].textContent;
    document.getElementById('email').value = cells[2].textContent;
    document.getElementById('colorPicker').value = cells[3].textContent;
    row.remove();
    document.getElementById('submit').addEventListener('click', async function updateUser() {
        const updatedName = document.getElementById('name').value;
        const updatedAge = document.getElementById('age').value;
        const updatedEmail = document.getElementById('email').value;
        const updatedColor = document.getElementById('colorPicker').value;

        const updatedDetails = {
            name: updatedName,
            age: updatedAge,
            email: updatedEmail,
            favoriteColor: updatedColor,
        };

        try {
            const response = await fetch(`http://localhost:5000/updateUser/${userDetails.email}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedDetails),
            });

            if (response.ok) {
                alert('Details updated successfully!');
                // Add the updated row back to the table
                const tableBody = document.getElementById('detailsTable').querySelector('tbody');
                const updatedRow = document.createElement('tr');
                updatedRow.innerHTML = `
                    <td>${updatedName}</td>
                    <td>${updatedAge}</td>
                    <td>${updatedEmail}</td>
                    <td style="background-color: ${updatedColor};">${updatedColor}</td>
                    <td>
                        <button class="edit-btn">Edit</button>
                        <button class="delete-btn">Delete</button>
                        <button class="change-color-btn">Change Color</button>
                    </td>
                `;
                tableBody.appendChild(updatedRow);
                updatedRow.querySelector('.edit-btn').addEventListener('click', () => editRow(updatedRow, updatedDetails));
                updatedRow.querySelector('.delete-btn').addEventListener('click', () => deleteRow(updatedRow, updatedDetails));
                updatedRow.querySelector('.change-color-btn').addEventListener('click', () => changeColor(updatedRow));
            } else {
                alert('Failed to update details.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while updating details.');
        }

        // Remove the temporary event listener
        document.getElementById('submit').removeEventListener('click', updateUser);
    });
}

// Function to delete a row (DELETE operation)
async function deleteRow(row, userDetails) {
    try {
        const response = await fetch(`http://localhost:5000/deleteUser/${userDetails.email}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Details deleted successfully!');
            row.remove();
        } else {
            alert('Failed to delete details.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while deleting details.');
    }
}
function changeColor(row) {
    const newColor = prompt('Enter a new color (e.g., #ff0000):', '#ffffff');
    if (newColor) {
        const colorCell = row.querySelector('td:nth-child(4)');
        colorCell.style.backgroundColor = newColor;
        colorCell.textContent = newColor;
    }
}