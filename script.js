//Get DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const greeting = document.getElementById("greeting");
const attendeeList = document.getElementById("attendeeList");
const waterCount = document.getElementById("waterCount");
const zeroCount = document.getElementById("zeroCount");
const powerCount = document.getElementById("powerCount");
const resetDataBtn = document.getElementById("resetDataBtn");

//Track attendance
let count = 0;
const maxCount = 50; //Set maximum attendance
let teamCounts = {
  water: 0,
  zero: 0,
  power: 0,
};
let attendees = [];

const storageKey = "intelEventCheckInData";
const teamLabels = {
  water: "Team Water Wise",
  zero: "Team Net Zero",
  power: "Team Renewables",
};

function saveData() {
  const data = {
    count: count,
    teamCounts: teamCounts,
    attendees: attendees,
  };

  localStorage.setItem(storageKey, JSON.stringify(data));
}

function loadData() {
  const savedData = localStorage.getItem(storageKey);

  if (!savedData) {
    return;
  }

  const parsedData = JSON.parse(savedData);
  count = parsedData.count || 0;
  teamCounts = parsedData.teamCounts || teamCounts;
  attendees = parsedData.attendees || [];
}

function resetEventData() {
  count = 0;
  teamCounts = {
    water: 0,
    zero: 0,
    power: 0,
  };
  attendees = [];

  localStorage.removeItem(storageKey);
  updateAttendanceUI();
  renderAttendeeList();
  showMessage("Event data has been reset.");
}

function updateAttendanceUI() {
  attendeeCount.textContent = count;
  waterCount.textContent = teamCounts.water;
  zeroCount.textContent = teamCounts.zero;
  powerCount.textContent = teamCounts.power;

  const percentage = Math.min(Math.round((count / maxCount) * 100), 100);
  progressBar.style.width = `${percentage}%`;
}

function renderAttendeeList() {
  attendeeList.innerHTML = "";

  if (attendees.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.textContent = "No attendees checked in yet.";
    emptyItem.classList.add("empty-attendee");
    attendeeList.appendChild(emptyItem);
    return;
  }

  for (let i = 0; i < attendees.length; i++) {
    const attendee = attendees[i];
    const listItem = document.createElement("li");

    const attendeeName = document.createElement("span");
    attendeeName.classList.add("attendee-name");
    attendeeName.textContent = attendee.name;

    const attendeeTeam = document.createElement("span");
    attendeeTeam.classList.add("attendee-team");
    attendeeTeam.textContent = attendee.teamName;

    listItem.appendChild(attendeeName);
    listItem.appendChild(attendeeTeam);
    attendeeList.appendChild(listItem);
  }
}

function getWinningTeamName() {
  let winningTeam = "water";

  if (teamCounts.zero > teamCounts[winningTeam]) {
    winningTeam = "zero";
  }

  if (teamCounts.power > teamCounts[winningTeam]) {
    winningTeam = "power";
  }

  return teamLabels[winningTeam];
}

function showMessage(messageText) {
  greeting.textContent = messageText;
  greeting.style.display = "block";
  greeting.classList.add("success-message");
}

function showGoalMessage() {
  const winningTeamName = getWinningTeamName();
  showMessage(`🎉 Goal reached! ${winningTeamName} is in the lead!`);
}

loadData();
updateAttendanceUI();
renderAttendeeList();

if (count >= maxCount) {
  showGoalMessage();
}

resetDataBtn.addEventListener("click", function () {
  resetEventData();
});

//Handle form submission
form.addEventListener("submit", function (event) {
  event.preventDefault(); //Prevent form from submitting

  if (count >= maxCount) {
    showGoalMessage();
    form.reset();
    return;
  }

  //Get form values
  const name = nameInput.value.trim();
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text; //Get the text of the selected option

  console.log(name, teamName); //Log values to console (for testing)

  //Increment count
  count++;
  console.log(`Current attendance: ${count}`);

  //Update team counter
  teamCounts[team] = teamCounts[team] + 1;

  //Save attendee details
  attendees.push({
    name: name,
    team: team,
    teamName: teamName,
  });

  updateAttendanceUI();
  renderAttendeeList();

  const percentage = Math.round((count / maxCount) * 100);
  console.log(`Attendance percentage: ${percentage}%`);

  //Show welcome message
  let message = `Welcome, ${name} from ${teamName}!`;

  if (count >= maxCount) {
    message = `🎉 Goal reached! ${getWinningTeamName()} is in the lead!`;
  }

  console.log(message);
  showMessage(message);

  saveData();

  //Reset form
  form.reset();
});
