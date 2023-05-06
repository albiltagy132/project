
async function loadPage(pageUrl,index) {
  const mainContent = document.getElementById('main-content');
  const page = await fetch(pageUrl);
  const pageHTMLContent = await page.text();
  mainContent.innerHTML = pageHTMLContent;
  if (pageUrl=="submitmain.html" && index==-1) {
    addAuthor();
    document.getElementById("sub_bttn").addEventListener("click", savePaper);
  }
  if (pageUrl=="review.html") {
    review(index);
  }
  if (pageUrl=="scheduals.html" && index==-1) {
    displaySessions();
  }
  if (pageUrl=="schedual-editor.html" && index==-1) {
    loadpapers();
    loadDates();
    loadLocations();
    const addSessionButton = document.getElementById("add-session-btn");
    addSessionButton.addEventListener("click", addSession);
  }
  if (pageUrl=="schedual-editor.html" && index!=-1) {
    loadpapers();
    loadDates();
    loadLocations();
    editSession(index)
  }
  if (pageUrl=="viewsession.html" && index==-1) {
    loadDates();
    showSessions();
    const filterButton = document.getElementById("filter-button");
    filterButton.addEventListener("click", filterSessions);
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
        loadPage("submitmain.html", -1);
        break;
      case "reviewer":
        const reviewerIndex = users.findIndex(u => u.id === user.id);
        loadPage("review.html", reviewerIndex);
        break;
      case "organizer":
        loadPage("scheduals.html", -1);
        break;
    }
  } else {
    // Show error message if email and password are incorrect
    const errorDiv = document.getElementById("error");
    errorDiv.textContent = "Wrong email or password.";
  }
}

//   schedual-editor.html loading the papers with 2 overall Evaluation

function loadpapers() {
  // Get reviews data from local storage
  const reviews = JSON.parse(localStorage.getItem("reviews")) || [];

  // Get select element and clear any existing options
  const selectElement = document.getElementById("session-papers");
  selectElement.innerHTML = "<option value=''>--Select a paper--</option>";

  // Loop through reviews and check overall evaluation for a value of 2
  for (let i = 0; i < reviews.length; i++) {
    if (reviews[i].overallEvaluation == "2") {
      // If overall evaluation is 2, add the paper title as an option in the select element
      const papers = JSON.parse(localStorage.getItem("papers")) || [];
      const paper = papers[reviews[i].paperIndex];
      selectElement.innerHTML += `<option value="${reviews[i].paperTitle}">${reviews[i].paperTitle}</option>`;
    }
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
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
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
    const paperTitle = document.getElementById("session-papers").value;
    const sessionTime = document.getElementById("session-time").value;


  
    if (sessionName.trim() !== '') {
      const session = {
        name: sessionName,
        location: sessionLocation,
        date: sessionDate,
        paper: paperTitle,
        time: sessionTime
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
    document.getElementById("session-papers").value= sessions[index].paper;
    document.getElementById("session-time").value= sessions[index].time;

  
    // Add an event listener to the form submit button that will update the session
    document.getElementById('add-session-btn').addEventListener('click', function() {
      // Get the updated session details from the form
      const updatedSession = {
        name: document.getElementById('session-name').value,
        location: document.getElementById('session-location').value,
        date: document.getElementById('session-date').value,
        paper:document.getElementById("session-papers").value,
        time:document.getElementById("session-time").value
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
              <h2 class="">${session.name}</h2>
            </div>
            <p class="homeTxt">Paper: ${session.paper}</p>
            <p class="homeTxt">Location: ${session.location}</p>
            <div class="artbtm">
              <span> ${session.date} |${session.time}</span>
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
  


  // submitmain.html adding inputs for more authors
  function addAuthor(){

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

// submitmain.html saving the papar in the local storage

function savePaper() {
  // Get existing data from local storage, or initialize to empty array
  const existingData = JSON.parse(localStorage.getItem("papers")) || [];

  // Get form elements
  const title = document.getElementById("title").value;
  const abstract = document.getElementById("abstract").value;
  const authors = document.querySelectorAll(".author");
  const authorData = [];

  // Loop through authors and save data
  for (let i = 0; i < authors.length; i++) {
    const name = authors[i].querySelector('input[name="name[]"]').value;
    const email = authors[i].querySelector('input[name="email[]"]').value;
    const affiliation = authors[i].querySelector('input[name="affiliation[]"]').value;
    const presenter = authors[i].querySelector('input[name="presenter[]"]:checked') ? true : false;
    authorData.push({ name, email, affiliation, presenter });
  }

  // Get path to uploaded PDF file
  const pdfFile = document.getElementById("pdf").value;

  // Generate two random reviewer IDs between 2 and 12
  const reviewerIds = [];
  while (reviewerIds.length < 2) {
    const randomId = Math.floor(Math.random() * 11) + 2;
    if (!reviewerIds.includes(randomId)) {
      reviewerIds.push(randomId);
    }
  }

  // Add new data to existing data array
  const newData = { title, abstract, authors: authorData, pdfFile, reviewerIds };
  existingData.push(newData);

  // Save updated data to local storage
  localStorage.setItem("papers", JSON.stringify(existingData));
}



  // review.html

  function review(index) {

    // Get papers data from local storage
    const papers = JSON.parse(localStorage.getItem("papers")) || [];
  
    // Get select element and clear any existing options
    const selectElement = document.getElementById("paper-list");
    selectElement.innerHTML = "<option value=''>--Select a paper--</option>";
  
    // Loop through papers and check reviewerIds for a match with index
    for (let i = 0; i < papers.length; i++) {
      const paper = papers[i];
      if (paper.reviewerIds.includes(index)) {
        // If there's a match, add the paper title as an option in the select element
        const optionElement = document.createElement("option");
        optionElement.value = paper.title;
        optionElement.textContent = paper.title;
        selectElement.appendChild(optionElement);
      }
    }
  
    const submitBtn = document.getElementById("submit-btn");
  
    submitBtn.addEventListener("click", () => {
      // Get form elements
      const paperTitle = document.getElementById("paper-list").value;
      const overallEvaluation = document.getElementById("overall-evaluation").value;
      const paperContribution = document.getElementById("paper-contribution").value;
      const paperStrengths = document.getElementById("paper-strengths").value;
      const paperWeaknesses = document.getElementById("paper-weaknesses").value;
  
      // Create new review object
      const newReview = {
        paperTitle,
        overallEvaluation,
        paperContribution,
        paperStrengths,
        paperWeaknesses
      };
  
      // Get existing reviews from local storage, or initialize to empty array
      const existingReviews = JSON.parse(localStorage.getItem("reviews")) || [];
  
      // Add new review to existing reviews array
      existingReviews.push(newReview);
  
      // Save updated reviews to local storage
      localStorage.setItem("reviews", JSON.stringify(existingReviews));
  
      // Clear form fields
      document.getElementById("paper-list").value = "";
      document.getElementById("overall-evaluation").value = "";
      document.getElementById("paper-contribution").value = "";
      document.getElementById("paper-strengths").value = "";
      document.getElementById("paper-weaknesses").value = "";  
    });
  }
  

  
// viewsession.html
function showSessions(filteredSessions) {
  const sessionsList = document.getElementById("sessions-list");
  sessionsList.innerHTML = ""; // clear any existing list items

  // Get papers array from local storage
  const papers = JSON.parse(localStorage.getItem("papers")) || [];
  let sessions = JSON.parse(localStorage.getItem("sessions")) || [];

  if (filteredSessions) {
    sessions = filteredSessions;
  }

  for (const session of sessions) {
    const li = document.createElement("li");
    let presenterNames = [];
    for (const paper of papers) {
      const matchingPaper = papers.find(p => p.title == session.paper);

      if (matchingPaper) {
        const presenterAuthors = matchingPaper.authors.filter(a => a.presenter);
        const presenterNamesForPaper = presenterAuthors.map(a => a.name);
        presenterNames = [...presenterNamesForPaper];


      }
    }
    li.innerHTML = `
      <h3>${session.name}</h3>
      <p><strong>Date:</strong> ${session.date}</p>
      <p><strong>Time:</strong> ${session.time}</p>
      <p><strong>Location:</strong> ${session.location}</p>
      <p><strong>Paper:</strong> ${session.paper}</p>
      <p><strong>Presenter:</strong>${presenterNames.join(" & ")}</p>
      <hr>
    `;
    sessionsList.appendChild(li);
  }
}



function filterSessions() {
  const selectedDate = document.getElementById("session-date").value;
  const filteredSessions = JSON.parse(localStorage.getItem("sessions")).filter(session => session.date === selectedDate);

  if (filteredSessions.length > 0) {
    showSessions(filteredSessions);
  } else {
    const sessionsList = document.getElementById("sessions-list");
    sessionsList.innerHTML = "<p>No sessions available on this date</p>";
  }
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