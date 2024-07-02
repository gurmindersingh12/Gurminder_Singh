document.addEventListener("DOMContentLoaded", function() {
    // Populate publications
    const publicationsList = document.getElementById("publications");
    publications.forEach((pub, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <div class="publication-title">
                ${pub.authors} ${pub.year}. ${pub.title} ${pub.journal}. (Cited By: <a href="citations.html?pub=${index}" style="color: #1a0dab;">${pub.citations}</a>) <a href="${pub.url}" style="color: #1a0dab;">[Link]</a>
            </div>
        `;
        publicationsList.appendChild(li);
    });

    // Populate metrics
    document.getElementById("total-citations").innerText = totalCitations;

    // Create citations chart
    const ctx = document.getElementById('citations-chart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
            datasets: [{
                label: 'Citations per Year',
                data: [0, 1, 1, 1, 6, 2], // Example data, replace with actual citation data
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});

