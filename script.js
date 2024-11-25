let contacts = []; // Array to store contact information
let editIndex = null; // Variable to track editing contact

document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.getElementById("contactForm");
    const contactTableBody = document.querySelector("#contactTable tbody");

    // Handle form submission for adding or editing a contact
    contactForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const email = document.getElementById("email").value.trim();

        if (!name || !phone || !email) {
            // Show dialog using exposed API
            await window.electronAPI.showDialog({
                type: 'warning',
                title: 'Invalid Input',
                message: 'All fields are required.',
            });
            return;
        }

        const contact = { name, phone, email };
        const duplicate = contacts.some(
            (contact) => contact.phone === phone && contact.email === email
        );

        if (duplicate) {
            await window.electronAPI.showDialog({
                type: 'error',
                title: 'Duplicate Contact',
                message: 'Same contact already exists.',
            });
            return;
        }

        if (editIndex !== null) {
            // Update the existing contact
            contacts[editIndex] = contact;
            editIndex = null;
            document.getElementById("addButton").innerText = "Add Contact";
        } else {
            // Add a new contact
            contacts.push(contact);
        }

        resetForm();
        renderContacts();
    });

    // Render the contacts list in the table
    function renderContacts() {
        contactTableBody.innerHTML = "";

        contacts.forEach((contact, index) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${contact.name}</td>
                <td>${contact.phone}</td>
                <td>${contact.email}</td>
                <td class="actions">
                    <button class="edit" data-index="${index}">Edit</button>
                    <button class="delete" data-index="${index}">Delete</button>
                </td>
            `;

            contactTableBody.appendChild(row);
        });

        addEventListeners();
    }

    // Add event listeners for edit and delete buttons
    function addEventListeners() {
        const editButtons = document.querySelectorAll(".edit");
        const deleteButtons = document.querySelectorAll(".delete");

        editButtons.forEach((button) => {
            button.addEventListener("click", function () {
                const index = parseInt(this.dataset.index, 10);
                editContact(index);
            });
        });

        deleteButtons.forEach((button) => {
            button.addEventListener("click", async function () {
                const index = parseInt(this.dataset.index, 10);
                const result = await window.electronAPI.showDialog({
                    type: 'question',
                    title: 'Delete Contact',
                    message: 'Are you sure you want to delete this contact?',
                    buttons: ['Yes', 'No'],
                });

                if (result.response === 0) {
                    deleteContact(index);
                }
            });
        });
    }

    // Edit a contact
    function editContact(index) {
        const contact = contacts[index];

        document.getElementById("name").value = contact.name;
        document.getElementById("phone").value = contact.phone;
        document.getElementById("email").value = contact.email;

        editIndex = index;
        document.getElementById("addButton").innerText = "Update Contact";
    }

    // Delete a contact
    function deleteContact(index) {
        contacts.splice(index, 1);
        renderContacts();
    }

    // Reset the form
    function resetForm() {
        contactForm.reset();
        editIndex = null;
        document.getElementById("addButton").innerText = "Add Contact";
    }
});
