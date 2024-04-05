// script.js

// Variable to keep track of the selected row for editing
var selectedRow = null;

// Function to show an alert with optional password strength message
function showAlert(message, className, passwordStrength) {
    // Create a new alert div
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;

    // Add the main message to the alert
    const messageNode = document.createTextNode(message);
    div.appendChild(messageNode);

    // If there's a password strength message, add it to the alert
    if (passwordStrength) {
        const strengthNode = document.createElement("p");
        strengthNode.textContent = `Password Strength: ${passwordStrength}`;
        div.appendChild(strengthNode);
    }

    // Insert the alert before the main content in the container
    const container = document.querySelector(".container");
    const main = document.querySelector(".main");
    container.insertBefore(div, main);

    // Remove the alert after 3 seconds (3000 milliseconds)
    setTimeout(() => document.querySelector(".alert").remove(), 3000);
}

// Function to check password strength
function checkPasswordStrength(password) {
    // Example: Basic length check
    if (password.length < 8) {
        return "Weak (Minimum length: 8 characters)";
    }

    // Add more checks as needed...

    // If the password passes all checks, consider it strong
    return "Strong";
}

// Function to clear all form fields
function clearFields() {
    document.querySelector("#fullName").value = "";
    document.querySelector("#email").value = "";
    document.querySelector("#password").value = "";
}

// Event listener for when the DOM content is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    // Load data from localStorage or use an empty array if there's no data
    const storedData = JSON.parse(localStorage.getItem("employeeData")) || [];
    const list = document.querySelector(".employee-list");

    // Iterate through each stored data and create rows in the table
    storedData.forEach((data) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${data.fullName}</td>
            <td>${data.email}</td>
            <td>${data.password}</td>
            <td>
                <a href="#" class="btn btn-warning btn-sm edit" >Edit</a>
                <a href="#" class="btn btn-danger btn-sm delete">Delete</a>
            </td>
        `;
        list.appendChild(row);
    });
});

// Event listener for the form submission
document.querySelector("#employee-form").addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Get form values
    const fullName = document.querySelector("#fullName").value;
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    // Validate form fields
    if (fullName == "" || email == "" || password == "") {
        showAlert("Please fill in all fields", "danger");
    } else {
        // Check password strength
        const passwordStrength = checkPasswordStrength(password);

        const list = document.querySelector(".employee-list");

        // If password is not strong, show an alert and stop execution
        if (passwordStrength !== "Strong") {
            showAlert("Weak Password. Please follow password requirements.", "danger", passwordStrength);
            return;
        }

        // If no row is selected, add a new row to the table
        if (selectedRow == null) {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${fullName}</td>
                <td>${email}</td>
                <td>${password}</td>
                <td>
                    <a href="#" class="btn btn-warning btn-sm edit" >Edit</a>
                    <a href="#" class="btn btn-danger btn-sm delete">Delete</a>
                </td>
            `;
            list.appendChild(row);
            showAlert("Employee added", "success");
        } else {
            // If a row is selected, edit the existing data in the table
            selectedRow.children[0].textContent = fullName;
            selectedRow.children[1].textContent = email;
            selectedRow.children[2].textContent = password;
            showAlert("Employee Info Edited", "info");
            selectedRow = null; // Reset selectedRow after editing
        }

        // Update localStorage with the latest employee data
        const employeeData = Array.from(list.children).map((row) => ({
            fullName: row.children[0].textContent,
            email: row.children[1].textContent,
            password: row.children[2].textContent,
        }));

        localStorage.setItem("employeeData", JSON.stringify(employeeData));

        // Clear form fields after submission
        clearFields();
    }
});

// Event listener for editing data
document.querySelector(".employee-list").addEventListener("click", (e) => {
    const target = e.target;

    // If the clicked element has the "edit" class, populate the form fields for editing
    if (target.classList.contains("edit")) {
        selectedRow = target.parentElement.parentElement;
        document.querySelector("#fullName").value = selectedRow.children[0].textContent;
        document.querySelector("#email").value = selectedRow.children[1].textContent;
        document.querySelector("#password").value = selectedRow.children[2].textContent;
    }
});

// Event listener for deleting data
document.querySelector(".employee-list").addEventListener("click", (e) => {
    const target = e.target;

    // If the clicked element has the "delete" class, prompt for confirmation and delete if confirmed
    if (target.classList.contains("delete")) {
        const emailToDelete = prompt("Enter the email ID to confirm deletion:");

        if (emailToDelete !== null) {
            const rowToDelete = target.parentElement.parentElement;
            const storedEmail = rowToDelete.children[1].textContent; // Assuming email is in the second column

            // If entered email matches the stored email, proceed with deletion
            if (emailToDelete === storedEmail) {
                const confirmDeletion = confirm("Are you sure you want to delete this record?");

                if (confirmDeletion) {
                    rowToDelete.remove(); // Remove the row from the table
                    showAlert("Employee Data Deleted", "danger");
                    selectedRow = null; // Reset selectedRow after deletion

                    // Update localStorage after deletion
                    const list = document.querySelector(".employee-list");
                    const employeeData = Array.from(list.children).map((row) => ({
                        fullName: row.children[0].textContent,
                        email: row.children[1].textContent,
                        password: row.children[2].textContent,
                    }));

                    localStorage.setItem("employeeData", JSON.stringify(employeeData));
                } else {
                    showAlert("Deletion canceled.", "info");
                }
            } else {
                showAlert("Entered email ID does not match. Deletion canceled.", "danger");
            }
        }
    }
});
 