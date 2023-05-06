

async function loadPage(pageUrl) {
  const mainContent = document.getElementById('main-content');
  const page = await fetch(pageUrl);
  const pageHTMLContent = await page.text();
  mainContent.innerHTML = pageHTMLContent;
 
}

function login() {
    // Retrieve array from local storage
    let usersString = localStorage.getItem("users");
    if (!usersString) {
      const users = allUsers;
      usersString = JSON.stringify(users);
      localStorage.setItem("users", usersString);
    }
    const users = JSON.parse(usersString);
  
    // Get entered email and password
    const emailInput = document.getElementById("username").value;
    const passwordInput = document.getElementById("password").value;
  
    // Check if entered email and password match any objects in the array
    const user = users.find(u => u.email === emailInput && u.password === passwordInput);
  
    if (user) {
      // Redirect to appropriate page based on user's role
      switch (user.role) {
        case "author":
          window.location.href = "submitmain.html";
          break;
        case "reviewer":
          window.location.href = "review.html";
          break;
        case "organizer":
          window.location.href = "schedual-editor.html";
          break;
        default:
          console.log("Unknown role:", user.role);
          break;
      }
    } else {
      // Show error message if email and password are incorrect
      const errorDiv = document.getElementById("error");
      errorDiv.textContent = "Wrong email or password.";
    }
  }
  


//   schedual-editor.html loading the locations
  function loadLocations() {
    let locstring = localStorage.getItem("locations");
    if (!locstring) {
      const location = locarray;
      locstring = JSON.stringify(location);
      localStorage.setItem("locations", locstring);
    }
    const locations = JSON.parse(locstring);
    const selectElement = document.getElementById("session-location");
    locations.forEach(location => {
      const option = document.createElement("option");
      option.text = `${location.name} (${location.building_code} - ${location.room})`;
      option.value = `${location.name},${location.building_code},${location.room}`;
      selectElement.add(option);
    });
  }

  //   schedual-editor.html loading the date
  function loadDates() {
    const dateArray = [];
    const startDate = new Date('2023-04-01');
    const endDate = new Date('2023-05-01');
    let currentDate = startDate;
    while (currentDate <= endDate) {
      dateArray.push(currentDate);
      currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000); // add 1 day
    }
  
    let datestring = localStorage.getItem("dates");
    if (!datestring) {
      const dates = dateArray.map(date => date.toISOString().substring(0, 10));
      datestring = JSON.stringify(dates);
      localStorage.setItem("dates", datestring);
    }
    const dates = JSON.parse(datestring);
  
    const selectElement = document.getElementById("session-date");
    dates.forEach(date => {
      const option = document.createElement("option");
      option.text = date;
      option.value = date;
      selectElement.add(option);
    });
  }
  
  document.addEventListener("DOMContentLoaded", loadDates);
  document.addEventListener("DOMContentLoaded", loadLocations);


  //   schedual-editor.html saving a new session in the local storage
  function addSession() {
    const sessionName = document.getElementById("session-name").value;
    const sessionLocation = document.getElementById("session-location").value;
    const sessionDate = document.getElementById("session-date").value;
  
    const session = {
      name: sessionName,
      location: sessionLocation,
      date: sessionDate
    };
  
    const sessionsString = localStorage.getItem("sessions");
    const sessions = sessionsString ? JSON.parse(sessionsString) : [];
  
    sessions.push(session);
  
    localStorage.setItem("sessions", JSON.stringify(sessions));
  
    alert("Session added successfully!");
  }
  









// the array of users
  const allUsers =[
    {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "email": "johndoe@organizer.com",
      "password": "password123",
      "role": "organizer"
    },
    {
      "id": 2,
      "first_name": "Jane",
      "last_name": "Doe",
      "email": "janedoe@organizer.com",
      "password": "password123",
      "role": "organizer"
    },
    {
      "id": 3,
      "first_name": "Bob",
      "last_name": "Smith",
      "email": "bobsmith@reviewer.com",
      "password": "password123",
      "role": "reviewer"
    },
    {
      "id": 4,
      "first_name": "Alice",
      "last_name": "Johnson",
      "email": "alicejohnson@reviewer.com",
      "password": "password123",
      "role": "reviewer"
    },
    {
      "id": 5,
      "first_name": "David",
      "last_name": "Brown",
      "email": "davidbrown@reviewer.com",
      "password": "password123",
      "role": "reviewer"
    },
    {
      "id": 6,
      "first_name": "Emily",
      "last_name": "Davis",
      "email": "emilydavis@reviewer.com",
      "password": "password123",
      "role": "reviewer"
    },
    {
      "id": 7,
      "first_name": "Oliver",
      "last_name": "Martin",
      "email": "olivermartin@reviewer.com",
      "password": "password123",
      "role": "reviewer"
    },
    {
      "id": 8,
      "first_name": "Sophie",
      "last_name": "Miller",
      "email": "sophiemiller@reviewer.com",
      "password": "password123",
      "role": "reviewer"
    },
    {
      "id": 9,
      "first_name": "Luke",
      "last_name": "Harris",
      "email": "lukeharris@reviewer.com",
      "password": "password123",
      "role": "reviewer"
    },
    {
      "id": 10,
      "first_name": "Mia",
      "last_name": "Wilson",
      "email": "miawilson@reviewer.com",
      "password": "password123",
      "role": "reviewer"
    },
    {
      "id": 11,
      "first_name": "Noah",
      "last_name": "Thomas",
      "email": "noahthomas@reviewer.com",
      "password": "password123",
      "role": "reviewer"
    },
    {
      "id": 12,
      "first_name": "Ava",
      "last_name": "Lee",
      "email": "avalee@reviewer.com",
      "password": "password123",
      "role": "reviewer"
    },
    {
      "id": 13,
      "first_name": "Jacob",
      "last_name": "Clark",
      "email": "jacobclark@reviewer.com",
      "password": "password123",
      "role": "reviewer"
    },
  {
      "id": 14,
      "first_name": "Emma",
      "last_name": "Walker",
      "email": "emmawalker@author.com",
      "password": "password123",
      "role": "author"
  },
  {
      "id": 15,
      "first_name": "Ethan",
      "last_name": "Turner",
      "email": "ethanturner@author.com",
      "password": "password123",
      "role": "author"
  },
  {
      "id": 16,
      "first_name": "Chloe",
      "last_name": "Parker",
      "email": "chloeparker@author.com",
      "password": "password123",
      "role": "author"
  },
  {
      "id": 17,
      "first_name": "William",
      "last_name": "Hall",
      "email": "williamhall@author.com",
      "password": "password123",
      "role": "author"
  },
  {
      "id": 18,
      "first_name": "Grace",
      "last_name": "Garcia",
      "email": "gracegarcia@author.com",
      "password": "password123",
      "role": "author"
  },
  {
      "id": 19,
      "first_name": "Daniel",
      "last_name": "Young",
      "email": "danielyoung@author.com",
      "password": "password123",
      "role": "author"
  },
  {
      "id": 20,
      "first_name": "Zoe",
      "last_name": "Allen",
      "email": "zoeallen@author.com",
      "password": "password123",
      "role": "author"
  }
];

// the array of locations
const locarray = [
    {
      "name": "Female Engineering Building",
      "building_code": "C07",
      "room": "145"
    },
    {
      "name": "CSE Meeting Room",
      "building_code": "BCR",
      "room": "E104"
    },
    {
      "name": "QU Library",
      "building_code": "B13",
      "room": "201"
    }
  ];