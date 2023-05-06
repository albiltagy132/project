// Define accepted papers with their overall evaluation scores
const acceptedPapers = [
    {id: 1, title: 'Paper 1', overallEvaluation: 2.5},
    {id: 2, title: 'Paper 2', overallEvaluation: 1.5},
    {id: 3, title: 'Paper 3', overallEvaluation: 3.0},
    {id: 4, title: 'Paper 4', overallEvaluation: 2.0},
    {id: 5, title: 'Paper 5', overallEvaluation: 2.5},
    {id: 6, title: 'Paper 6', overallEvaluation: 1.0},
    {id: 7, title: 'Paper 7', overallEvaluation: 2.5},
    {id: 8, title: 'Paper 8', overallEvaluation: 3.5},
    {id: 9, title: 'Paper 9', overallEvaluation: 2.0},
    {id: 10, title: 'Paper 10', overallEvaluation: 2.5},
  ];
  
  let datestring = localStorage.getItem("dates");
  const dates = JSON.parse(datestring);
  const selectElement = document.getElementById("session-date");
  dates.forEach(date => {
    const option = document.createElement("option");
    option.text = date;
    option.value = date;
    selectElement.add(option);
  });

  // Define sessions array to hold created sessions
  const sessions = [];
  
  // Define function to filter accepted papers with overall evaluation score >= 2
  function filterAcceptedPapers() {
    return acceptedPapers.filter(paper => paper.overallEvaluation >= 2);
  }
  
  // Define function to render accepted papers in select element
  function renderAcceptedPapers() {
    const acceptedPapersSelect = document.getElementById('accepted-papers');
    acceptedPapersSelect.innerHTML = '';
    const filteredAcceptedPapers = filterAcceptedPapers();
    filteredAcceptedPapers.forEach(paper => {
      const option = document.createElement('option');
      option.value = paper.id;
      option.textContent = `${paper.title} (Overall Evaluation: ${paper.overallEvaluation})`;
      acceptedPapersSelect.appendChild(option);
    });
  }
  
  // Define function to create session and add it to sessions array
  function createSession(event) {
    event.preventDefault();
    const sessionNameInput = document.getElementById('session-name');
    const sessionName = sessionNameInput.value;
    const sessionLocationInput = document.getElementById('session-location');
    const sessionLocation = sessionLocationInput.value;
    const sessionDateInput = document.getElementById('session-date');
    const sessionDate = sessionDateInput.value;
    const sessionTimeInput = document.getElementById('session-time');
    const sessionTime = sessionTimeInput.value;
    const acceptedPapersSelect = document.getElementById('accepted-papers');
    const selectedPaperIds = Array.from(acceptedPapersSelect.selectedOptions).map(option => Number(option.value));
    const selectedPapers = acceptedPapers.filter(paper => selectedPaperIds.includes(paper.id));
    const presentersInput = document.getElementById('presenters');
    const presenters = presentersInput.value.split(',').map(presenter => presenter.trim());
    const session = {
      name: sessionName,
      location: sessionLocation,
      date: sessionDate,
      time: sessionTime,
      papers: selectedPapers,
      presenters: presenters,
    };
    sessions.push(session);
    renderSessions();
    sessionNameInput.value = '';
    sessionLocationInput.value = '';
    sessionDateInput.value = '';
    sessionTimeInput.value = '';
    acceptedPapersSelect.selectedIndex = -1;
    presentersInput.value = '';
  }
  
  // Define function to render created sessions
  function renderSessions() {
    const sessionsList = document.getElementById('sessions-list');
    sessionsList.innerHTML = '';
    sessions.forEach(session => {
      const sessionListItem = document.createElement('li');
      sessionListItem.innerHTML = `
        <h3>${session.name}</h3>
        <p><strong>Date:</strong> ${session.date}</p>
        <p><strong>Time:</strong> ${session.time}</p>
        <p><strong>Location:</strong> ${session.location}</p>
        <p><strong>Papers:</strong></p>
        <ul>
          ${session.papers.map(paper => `<li>${paper.title} (Overall Evaluation: ${paper.overallEvaluation})</li>`).join('')}
        </ul>
        <p><strong>Presenters:</strong> ${session.presenters.join(', ')}</p>
      `;
      sessionsList.appendChild(sessionListItem);
    });
  }
  
  // Define function to handle filter button click
  function handleFilterClick(event) {
    event.preventDefault();
    const filterDateInput = document.getElementById('filter-date');
    const filterDate = filterDateInput.value;
    const filteredSessions = sessions.filter(session => session.date === filterDate);
    renderFilteredSessions(filteredSessions);
  }
  
  // Define function to render filtered sessions
  function renderFilteredSessions(filteredSessions) {
    const filteredSessionsList = document.getElementById('filtered-sessions-list');
    filteredSessionsList.innerHTML = '';
    filteredSessions.forEach(session => {
      const filteredSessionListItem = document.createElement('li');
      filteredSessionListItem.innerHTML = `
        <h3>${session.name}</h3>
        <p><strong>Date:</strong> ${session.date}</p>
        <p><strong>Time:</strong> ${session.time}</p>
        <p><strong>Location:</strong> ${session.location}</p>
        <p><strong>Papers:</strong></p>
        <ul>
          ${session.papers.map(paper => `<li>${paper.title} (Overall Evaluation: ${paper.overallEvaluation})</li>`).join('')}
        </ul>
        <p><strong>Presenters:</strong> ${session.presenters.join(', ')}</p>
      `;
      filteredSessionsList.appendChild(filteredSessionListItem);
    });
  }
  
  // Attach event listener to create
  // Attach event listener to create session button
  const createSessionButton = document.getElementById('create-session-button');
  createSessionButton.addEventListener('click', createSession);
  
  // Attach event listener to filter button
  const filterButton = document.getElementById('filter-button');
  filterButton.addEventListener('click', handleFilterClick);