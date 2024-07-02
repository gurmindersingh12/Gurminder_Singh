document.addEventListener("DOMContentLoaded", function() {
    // Populate publications
    const publicationsList = document.getElementById("publications");
    publications.forEach(pub => {
        const li = document.createElement("li");
        li.innerHTML = `
            <div class="publication-title">
                <a href="${pub.url}">${pub.title}</a>
                <div class="authors">${pub.authors}</div>
            </div>
            <div class="cited-by">Cited by ${pub.citations}</div>
            <div class="year">${pub.year}</div>
        `;
        publicationsList.appendChild(li);
    });

    // Populate co-authors
    const coAuthorsList = document.getElementById("co-authors");
    coAuthors.forEach(author => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${author.name}</strong> - <a href="${author.profileUrl}">${author.affiliation}</a>`;
        coAuthorsList.appendChild(li);
    });

    // Populate metrics
    document.getElementById("total-citations").innerText = totalCitations;
    document.getElementById("h-index").innerText = hIndex;
    document.getElementById("i10-index").innerText = i10Index;

    // Create citations chart
    const ctx = document.getElementById('citations-chart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
            datasets: [{
                label: 'Citations per Year',
                data: [1, 0, 3, 0, 1, 3, 0], // Example data, replace with actual citation data
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
