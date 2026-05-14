const MAX_ROOMS = 50;

let rooms = [];

for (let i = 0; i < MAX_ROOMS; i++) {
    rooms[i] = {
        roomNumber: i + 1,
        clientName: "",
        roomType: "",
        checkInDate: "",
        checkOutDate: "",
        contactNumber: "",
        isReserved: false
    };
}

let currentAction = "book";

const tabs = document.querySelectorAll(".tab");
const form = document.querySelector(".form");
const roomNumberInput = document.querySelector('input[type="number"]');
const inputs = document.querySelectorAll(".form input");
const roomTypeSelect = document.querySelector(".form select");
const submitButton = document.querySelector(".primary-btn");
const message = document.querySelector(".message");
const roomCards = document.querySelectorAll(".room-card");
const detailsRows = document.querySelectorAll(".details-row dd");

tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        tabs.forEach((button) => button.classList.remove("active"));
        tab.classList.add("active");

        currentAction = tab.textContent.toLowerCase();

        if (currentAction === "check out") {
            currentAction = "checkout";
        }

        submitButton.textContent = tab.textContent + " Room";
        message.textContent = "Enter the room number and continue.";
    });
});

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const roomNum = Number(roomNumberInput.value);

    if (roomNum < 1 || roomNum > MAX_ROOMS) {
        message.textContent = "Invalid room number!";
        return;
    }

    const index = roomNum - 1;
    const room = rooms[index];

    if (currentAction === "book") {
        bookRoom(room, index);
    } else if (currentAction === "search") {
        searchBooking(room);
    } else if (currentAction === "checkout") {
        checkOutRoom(room, index);
    } else if (currentAction === "extend") {
        extendBooking(room);
    } else if (currentAction === "cancel") {
        cancelBooking(room, index);
    }

    updateRoomCards();
    showRoomDetails(room);
});

function bookRoom(room, index) {
    if (room.isReserved) {
        message.textContent = "Room is already booked!";
        return;
    }

    room.clientName = inputs[1].value;
    room.roomType = roomTypeSelect.value;
    room.checkInDate = inputs[2].value;
    room.checkOutDate = inputs[3].value;
    room.contactNumber = inputs[4].value;
    room.isReserved = true;

    message.textContent = "Room booked successfully!";
}

function searchBooking(room) {
    if (!room.isReserved) {
        message.textContent = "No booking found.";
        return;
    }

    message.textContent = "Booking found.";
}

function checkOutRoom(room, index) {
    if (!room.isReserved) {
        message.textContent = "Room is not reserved!";
        return;
    }

    let total = 300;

    if (room.roomType === "VIP") {
        total = 500;
    }

    clearRoom(room);
    message.textContent = "Payment successful. Total: " + total + " SAR. Room is now available.";
}

function extendBooking(room) {
    if (!room.isReserved) {
        message.textContent = "Room is not currently reserved.";
        return;
    }

    const newCheckOut = inputs[3].value;

    if (newCheckOut === room.checkOutDate) {
        message.textContent = "New check-out date is the same. No changes made.";
        return;
    }

    room.checkOutDate = newCheckOut;
    message.textContent = "Booking extended successfully.";
}

function cancelBooking(room, index) {
    if (!room.isReserved) {
        message.textContent = "No booking found for this room.";
        return;
    }

    const confirmCancel = confirm("Are you sure you want to cancel this booking?");

    if (confirmCancel) {
        clearRoom(room);
        message.textContent = "Booking cancelled successfully. Room is now available.";
    } else {
        message.textContent = "Cancellation cancelled. Booking is still active.";
    }
}

function clearRoom(room) {
    room.clientName = "";
    room.roomType = "";
    room.checkInDate = "";
    room.checkOutDate = "";
    room.contactNumber = "";
    room.isReserved = false;
}

function updateRoomCards() {
    roomCards.forEach((card, index) => {
        if (rooms[index] && rooms[index].isReserved) {
            card.classList.add("reserved");
        } else {
            card.classList.remove("reserved");
        }
    });
}

function showRoomDetails(room) {
    detailsRows[0].textContent = room.roomNumber;
    detailsRows[1].textContent = room.isReserved ? "Reserved" : "Available";
    detailsRows[2].textContent = room.clientName || "-";
    detailsRows[3].textContent = room.roomType || "-";
    detailsRows[4].textContent = room.checkInDate || "-";
    detailsRows[5].textContent = room.checkOutDate || "-";
    detailsRows[6].textContent = room.contactNumber || "-";
}

roomCards.forEach((card) => {
    card.addEventListener("click", () => {
        const roomNum = Number(card.textContent);
        const room = rooms[roomNum - 1];

        roomNumberInput.value = roomNum;
        showRoomDetails(room);

        roomCards.forEach((button) => button.classList.remove("selected"));
        card.classList.add("selected");
    });
});
