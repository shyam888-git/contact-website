// Contact Manager Application

// DOM Elements
const contactsContainer = document.getElementById("contacts-container")
const detailsPanel = document.getElementById("details-panel")
const addContactBtn = document.getElementById("add-contact-btn")

// State
let contacts = []
let selectedContactId = null

// Initialize the application
function init() {
  loadContacts()
  renderContacts()
  renderEmptyDetails()

  // Event Listeners
  addContactBtn.addEventListener("click", showAddContactForm)
}

// Load contacts from localStorage
function loadContacts() {
  const storedContacts = localStorage.getItem("contacts")
  contacts = storedContacts ? JSON.parse(storedContacts) : []
}

// Save contacts to localStorage
function saveContacts() {
  localStorage.setItem("contacts", JSON.stringify(contacts))
}

// Render the contacts list
function renderContacts() {
  if (contacts.length === 0) {
    contactsContainer.innerHTML = `
            <div class="empty-contacts">
                <p>No contacts found</p>
                <p class="small-text">Add a contact to get started</p>
            </div>
        `
    return
  }

  const contactsList = document.createElement("ul")
  contactsList.className = "contacts-list"

  contacts.forEach((contact) => {
    const contactItem = document.createElement("li")
    contactItem.className = `contact-item ${contact.id === selectedContactId ? "selected" : ""}`
    contactItem.innerHTML = `
            <div class="contact-avatar">
                <span>${contact.name.charAt(0).toUpperCase()}</span>
            </div>
            <span class="contact-name">${contact.name}</span>
        `
    contactItem.addEventListener("click", () => selectContact(contact.id))
    contactsList.appendChild(contactItem)
  })

  contactsContainer.innerHTML = ""
  contactsContainer.appendChild(contactsList)
}

// Select a contact
function selectContact(contactId) {
  selectedContactId = contactId
  renderContacts() // Re-render to update selection

  const selectedContact = contacts.find((contact) => contact.id === contactId)
  if (selectedContact) {
    renderContactDetails(selectedContact)
  }
}

// Render contact details
function renderContactDetails(contact) {
  detailsPanel.innerHTML = `
        <div class="contact-details">
            <div class="details-header">
                <h2>${contact.name}</h2>
                <div class="details-actions">
                    <button class="btn btn-secondary" id="edit-contact-btn">Edit</button>
                    <button class="btn btn-danger" id="delete-contact-btn">Delete</button>
                </div>
            </div>

            <div class="details-info">
                <div class="info-item">
                    <div class="info-icon">✉️</div>
                    <div class="info-content">
                        <p class="info-label">Email</p>
                        <p class="info-value">${contact.email}</p>
                    </div>
                </div>

                <div class="info-item">
                    <div class="info-icon">📞</div>
                    <div class="info-content">
                        <p class="info-label">Phone</p>
                        <p class="info-value">${contact.phone}</p>
                    </div>
                </div>
            </div>
        </div>
    `

  // Add event listeners
  document.getElementById("edit-contact-btn").addEventListener("click", () => showEditContactForm(contact))
  document.getElementById("delete-contact-btn").addEventListener("click", () => deleteContact(contact.id))
}

// Show empty details message
function renderEmptyDetails() {
  detailsPanel.innerHTML = `
        <div class="empty-details">
            <p>Select a contact to view details or add a new contact</p>
        </div>
    `
}

// Show add contact form
function showAddContactForm() {
  selectedContactId = null
  renderContacts() // Re-render to update selection

  detailsPanel.innerHTML = `
        <form class="contact-form" id="contact-form">
            <h2>Add New Contact</h2>

            <div class="form-group">
                <label for="name">Name</label>
                <input id="name" type="text" placeholder="Enter name">
                <p class="error-text" id="name-error"></p>
            </div>

            <div class="form-group">
                <label for="email">Email</label>
                <input id="email" type="email" placeholder="Enter email">
                <p class="error-text" id="email-error"></p>
            </div>

            <div class="form-group">
                <label for="phone">Phone</label>
                <input id="phone" type="text" placeholder="Enter phone number">
                <p class="error-text" id="phone-error"></p>
            </div>

            <div class="form-actions">
                <button type="button" class="btn btn-secondary" id="cancel-btn">Cancel</button>
                <button type="submit" class="btn btn-primary">Save</button>
            </div>
        </form>
    `

  // Add event listeners
  document.getElementById("contact-form").addEventListener("submit", saveContact)
  document.getElementById("cancel-btn").addEventListener("click", cancelForm)
}

// Show edit contact form
function showEditContactForm(contact) {
  detailsPanel.innerHTML = `
        <form class="contact-form" id="contact-form" data-id="${contact.id}">
            <h2>Edit Contact</h2>

            <div class="form-group">
                <label for="name">Name</label>
                <input id="name" type="text" value="${contact.name}" placeholder="Enter name">
                <p class="error-text" id="name-error"></p>
            </div>

            <div class="form-group">
                <label for="email">Email</label>
                <input id="email" type="email" value="${contact.email}" placeholder="Enter email">
                <p class="error-text" id="email-error"></p>
            </div>

            <div class="form-group">
                <label for="phone">Phone</label>
                <input id="phone" type="text" value="${contact.phone}" placeholder="Enter phone number">
                <p class="error-text" id="phone-error"></p>
            </div>

            <div class="form-actions">
                <button type="button" class="btn btn-secondary" id="cancel-btn">Cancel</button>
                <button type="submit" class="btn btn-primary">Save</button>
            </div>
        </form>
    `

  // Add event listeners
  document.getElementById("contact-form").addEventListener("submit", saveContact)
  document.getElementById("cancel-btn").addEventListener("click", cancelForm)
}

// Save contact (add or update)
function saveContact(e) {
  e.preventDefault()

  // Get form values
  const nameInput = document.getElementById("name")
  const emailInput = document.getElementById("email")
  const phoneInput = document.getElementById("phone")

  const name = nameInput.value.trim()
  const email = emailInput.value.trim()
  const phone = phoneInput.value.trim()

  // Validate form
  let isValid = true

  // Clear previous errors
  document.getElementById("name-error").textContent = ""
  document.getElementById("email-error").textContent = ""
  document.getElementById("phone-error").textContent = ""

  if (!name) {
    document.getElementById("name-error").textContent = "Name is required"
    isValid = false
  }

  if (!email) {
    document.getElementById("email-error").textContent = "Email is required"
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    document.getElementById("email-error").textContent = "Email is invalid"
    isValid = false
  }

  if (!phone) {
    document.getElementById("phone-error").textContent = "Phone number is required"
    isValid = false
  }

  if (!isValid) return

  const form = document.getElementById("contact-form")
  const contactId = form.dataset.id

  if (contactId) {
    // Update existing contact
    const contactIndex = contacts.findIndex((contact) => contact.id === contactId)
    if (contactIndex !== -1) {
      contacts[contactIndex] = {
        ...contacts[contactIndex],
        name,
        email,
        phone,
      }
      selectedContactId = contactId
    }
  } else {
    // Add new contact
    const newContact = {
      id: Date.now().toString(),
      name,
      email,
      phone,
    }
    contacts.push(newContact)
    selectedContactId = newContact.id
  }

  // Save and render
  saveContacts()
  renderContacts()

  // Show the contact details
  const selectedContact = contacts.find((contact) => contact.id === selectedContactId)
  renderContactDetails(selectedContact)
}

// Delete contact
function deleteContact(contactId) {
  contacts = contacts.filter((contact) => contact.id !== contactId)
  saveContacts()
  renderContacts()
  renderEmptyDetails()
  selectedContactId = null
}

// Cancel form
function cancelForm() {
  if (selectedContactId) {
    const selectedContact = contacts.find((contact) => contact.id === selectedContactId)
    renderContactDetails(selectedContact)
  } else {
    renderEmptyDetails()
  }
}

// Initialize the application when the DOM is loaded
document.addEventListener("DOMContentLoaded", init)
