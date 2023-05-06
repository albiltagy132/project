
async function loadPage(pageUrl,index) {
  const mainContent = document.getElementById('main-content');
  const page = await fetch(pageUrl);
  const pageHTMLContent = await page.text();
  mainContent.innerHTML = pageHTMLContent;
  if (pageUrl=="submitmain.html" && index==-1) {
    sub();
  }
  if (pageUrl=="review.html" && index==-1) {
    review();
  }
  if (pageUrl=="scheduals.html" && index==-1) {
    displaySessions();
  }
  if (pageUrl=="schedual-editor.html" && index==-1) {
    loadDates();
    loadLocations();
    const addSessionButton = document.getElementById("add-session-btn");
    addSessionButton.addEventListener("click", addSession);
  }
  if (pageUrl=="schedual-editor.html" && index!=-1) {
    loadDates();
    loadLocations();
    editSession(index)
  }
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
    const emailInput = document.querySelector("#username").value;
    const passwordInput = document.querySelector("#password").value;
  
    // Check if entered email and password match any objects in the array
    const user = users.find(u => u.email === emailInput && u.password === passwordInput);
  
    if (user) {
      // Redirect to appropriate page based on user's role
      switch (user.role) {
        case "author":
          loadPage("submitmain.html",-1);
          break;
        case "reviewer":
          loadPage("review.html",-1);
          break;
        case "organizer":
          loadPage("scheduals.html",-1);
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
  


  //   schedual-editor.html saving a new session in the local storage
  function addSession() {
    const sessionName = document.getElementById("session-name").value;
    const sessionLocation = document.getElementById("session-location").value;
    const sessionDate = document.getElementById("session-date").value;
  
    if (sessionName.trim() !== '') {
      const session = {
        name: sessionName,
        location: sessionLocation,
        date: sessionDate
      };
  
      const sessionsString = localStorage.getItem("sessions");
      const sessions = sessionsString ? JSON.parse(sessionsString) : [];
  
      sessions.push(session);
  
      localStorage.setItem("sessions", JSON.stringify(sessions));
  
      loadPage("scheduals.html", -1);
    }
  }

  //schedual-editor.html saving a edited session in the local storage

  function editSession(index) {
    // Get the sessions from local storage
    const sessions = JSON.parse(localStorage.getItem('sessions'));

    // Populate the form with the session details
    document.getElementById('session-name').value = sessions[index].name;
    document.getElementById('session-date').value = sessions[index].date;
    document.getElementById('session-location').value= sessions[index].location;

  
    // Add an event listener to the form submit button that will update the session
    document.getElementById('add-session-btn').addEventListener('click', function() {
      // Get the updated session details from the form
      const updatedSession = {
        name: document.getElementById('session-name').value,
        location: document.getElementById('session-location').value,
        date: document.getElementById('session-date').value
      };
  
      // Update the session in the sessions array
      sessions[index] = updatedSession;
  
      // Save the updated sessions array to local storage
      localStorage.setItem('sessions', JSON.stringify(sessions));
  
      // Go back to the schedules page
      loadPage("scheduals.html", -1);
    });
  }
  

  // scheduals.html display all sessions in the localstorage

  function displaySessions() {
    const sessions = JSON.parse(localStorage.getItem('sessions'));
    const container = document.getElementById('session-container');
  
    container.innerHTML = ''; // clear previous content before re-adding
  
    for (let i = 0; i < sessions.length; i++) {
      const session = sessions[i];

        const sessionHtml = `
          <div class="box session-box">
            <div class="content">
              <h2 class="homeTitle">${session.name}</h2>
            </div>
            <div class="artbtm">
              <span>${session.location} | ${session.date}</span>
              <div>
                <button class="sessionbtn" onclick="loadPage('schedual-editor.html',${i})">edit</button>
                <button class="sessionbtn red" onclick="deleteSession(${i})">delete</button>
              </div>
            </div>
          </div>
        `;
        container.innerHTML += sessionHtml;
      
    }
  }
  
   // scheduals.html delete a sessions in the localstorage
  function deleteSession(index) {
    const sessions = JSON.parse(localStorage.getItem('sessions'));
    sessions.splice(index, 1);
    localStorage.setItem('sessions', JSON.stringify(sessions));
    displaySessions();
  }
  


  // submitmain.html
  const currentFile = window.location.pathname;
  const fileName = currentFile.substring(currentFile.lastIndexOf('/')+1);
  if (fileName=="submitmain.html") {
  const addAuthorBtn = document.getElementById("add-author");
  const authorsDiv = document.getElementById("authors");

  addAuthorBtn.addEventListener("click", () => {
    authorsDiv.innerHTML += `
      <div class="author">
        <input type="text" name="name[]" placeholder="Name" required>
        <input type="email" name="email[]" placeholder="Email" required>
        <input type="text" name="affiliation[]" placeholder="Affiliation" required>
        <label>
          Presenter:
          <input type="checkbox" name="presenter[]" value="yes">
        </label>
      </div>
    `;
  });
  }
  
  function sub(){

    const submitBtn = document.querySelector("#sub_bttn");
    submitBtn.addEventListener("click", () => {
      const fileInput = document.getElementById("pdf");

      if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
          const pdfData = event.target.result;
          localStorage.setItem("pdf", pdfData);
        };

        reader.readAsDataURL(file);
      }
    });

    // const downloadBtn = document.getElementById("download");
    // downloadBtn.addEventListener("click", () => {
    //   const pdfData = localStorage.getItem("pdf");
    //   const pdfBlob = dataURLtoBlob(pdfData);
    //   const pdfUrl = URL.createObjectURL(pdfBlob);
    //   const a = document.createElement("a");
    //   a.href = pdfUrl;
    //   a.download = "paper.pdf";
    //   document.body.appendChild(a);
    //   a.click();
    // });

    // function dataURLtoBlob(dataURL) {
    //   const byteString = atob(dataURL.split(",")[1]);
    //   const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
    //   const ab = new ArrayBuffer(byteString.length);
    //   const ia = new Uint8Array(ab);
    //   for (let i = 0; i < byteString.length; i++) {
    //     ia[i] = byteString.charCodeAt(i);
    //   }
    //   return new Blob([ab], { type: mimeString });
    // }

}

  function review() {
    const submitBtn = document.getElementById("submit-btn");

    submitBtn.addEventListener("click", () => {
      const paperId = document.getElementById("paper-list").value;
      const evalOverall = document.getElementById("overall-evaluation").value;
      const evalContribution = document.getElementById("paper-contribution").value;
      const evalStrengths = document.getElementById("paper-strengths").value;
      const evalWeaknesses = document.getElementById("paper-weaknesses").value;

      if (!paperId || !evalOverall || !evalContribution || !evalStrengths || !evalWeaknesses) {
        alert("Please fill out all fields.");
        return;
      }

      // Retrieve papers from local storage
      let papers = JSON.parse(localStorage.getItem("papers"));
      if (!papers) {
        papers = [];
      }

      // Find the paper in the list and update its evaluation
      for (let i = 0; i < papers.length; i++) {
        if (papers[i].id === paperId) {
          papers[i].evaluation = {
            overall: evalOverall,
            contribution: evalContribution,
            strengths: evalStrengths,
            weaknesses: evalWeaknesses
          };
          break;
        }
      }

      // Save the updated list of papers to local storage
      localStorage.setItem("papers", JSON.stringify(papers));

      alert("Evaluation saved successfully.");
  });
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