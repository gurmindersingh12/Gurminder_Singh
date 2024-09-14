// Function to open tabs
function openTab(evt, tabName) {
  // Hide all tab content
  var tabcontent = document.getElementsByClassName("tab-content");
  for (var i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Remove active class from all links
  var tablinks = document.getElementsByClassName("nav-link");
  for (var i = 0; i < tablinks.length; i++) {
    tablinks[i].classList.remove("active");
  }

  // Show the current tab and add active class to the clicked link
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.classList.add("active");
}

// Show default tab on page load
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("home").style.display = "block";
  document.querySelector(".nav-link").classList.add("active");

  // Populate publications
  var publicationsList = document.getElementById("publications-list");
  publications.forEach(function (pub) {
    var col = document.createElement("div");
    col.className = "col-md-6";
    col.innerHTML = `
      <div class="card publication-card mb-4">
        <div class="card-body">
          <h5 class="card-title">${pub.title}</h5>
          <p class="card-text">
            <strong>Authors:</strong> ${pub.authors}<br>
            <strong>Journal:</strong> ${pub.journal}<br>
            <strong>Year:</strong> ${pub.year}<br>
            <strong>Citations:</strong> ${pub.citations}
          </p>
          <a href="${pub.url}" class="btn btn-primary" target="_blank">Read More</a>
        </div>
      </div>
    `;
    publicationsList.appendChild(col);
  });

  // Create citations chart
  var ctx = document.getElementById('citations-chart').getContext('2d');
  var citationData = [1, 1, 1, 6, 5]; // Replace with actual data
  var years = ['2020', '2021', '2022', '2023', '2024']; // Replace with actual years

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: years,
      datasets: [{
        label: 'Citations per Year',
        data: citationData,
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
});
