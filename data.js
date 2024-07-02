const publications = [
    {
        title: "Genome-wide association mapping of resistance to the foliar diseases septoria nodorum blotch and tan spot in a global winter wheat collection",
        authors: "AR Peters Haugrud, G Shi, S Seneviratne, KLD Running, Z Zhang, ...",
        journal: "Molecular Breeding",
        year: 2023,
        url: "http://link_to_publication.com",
        citations: 3
    },
    {
        title: "Resistance Screening and QTL Mapping in Wheat and Triticale Against Root-Lesion Nematode",
        authors: "G Singh",
        journal: "North Dakota State University",
        year: 2020,
        url: "http://link_to_publication.com",
        citations: 4
    },
    {
        title: "Association mapping of resistance to tan spot in the Global Durum Panel",
        authors: "A Szabo-Hever, G Singh, ARP Haugrud, KLD Running, S Seneviratne, ...",
        journal: "Phytopathology",
        year: 2023,
        url: "http://link_to_publication.com",
        citations: 2
    },
    {
        title: "Methodology to study the resistance of root-lesion nematode (Pratylenchus neglectus) in wheat under greenhouse conditions",
        authors: "G Singh, G Yan",
        journal: "North Dakota State University",
        year: 2018,
        url: "http://link_to_publication.com",
        citations: 1
    }
];

const coAuthors = [
    {
        name: "Zhaohui Liu",
        affiliation: "North Dakota State University",
        profileUrl: "https://scholar.google.com/citations?user=abc123"
    },
    {
        name: "Justin Faris",
        affiliation: "North Dakota State University",
        profileUrl: "https://scholar.google.com/citations?user=xyz789"
    }
];

// Calculate total citations and h-index
let totalCitations = 0;
let i10Index = 0;
let citationCounts = publications.map(pub => pub.citations).sort((a, b) => b - a);
citationCounts.forEach(cite => totalCitations += cite);
i10Index = citationCounts.filter(count => count >= 10).length;

let hIndex = 0;
for (let i = 0; i < citationCounts.length; i++) {
    if (citationCounts[i] >= i + 1) {
        hIndex = i + 1;
    } else {
        break;
    }
}
