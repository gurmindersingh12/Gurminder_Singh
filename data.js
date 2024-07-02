const publications = [
    {
        title: "Evaluation of durum and hard red spring wheat panels for sensitivity to necrotrophic effectors produced by Parastagonospora nodorum.",
        authors: "Szabo-Hever A, Running K, Seneviratne S, Singh G, et al.",
        journal: "Plant Disease (Under Review)",
        year: 2024,
        citations: 0, // Replace with actual citation count if available
        url: "#",
        citingPapers: []
    },
    {
        title: "Evolution, diversity, and function of the disease susceptibility gene Snn1 in wheat.",
        authors: "Seneviratne S, Shi G, Szabo-Hever A, Zhang Z, Haugrud A, Running K, Singh G, et al.",
        journal: "The Plant Journal (Accepted)",
        year: 2024,
        citations: 0, // Replace with actual citation count if available
        url: "https://onlinelibrary.wiley.com/doi/abs/10.1111/tpj.16879",
        citingPapers: []
    },
    {
        title: "Evaluation of wheat cultivars and germplasm lines for resistance to Pratylenchus neglectus populations collected in North Dakota.",
        authors: "Singh G, et al.",
        journal: "Plant Disease 117:3817-3824",
        year: 2023,
        citations: 2, // Replace with actual citation count if available
        url: "https://apsjournals.apsnet.org/doi/abs/10.1094/PDIS-03-23-0590-RE",
        citingPapers: [
            {
                title: "Some Citing Paper 1",
                authors: "Author A, Author B",
                journal: "Journal A",
                year: 2024,
                url: "#"
            },
            {
                title: "Some Citing Paper 2",
                authors: "Author C, Author D",
                journal: "Journal B",
                year: 2024,
                url: "#"
            }
        ]
    },
    {
        title: "Association mapping of resistance to tan spot in the Global Durum Panel.",
        authors: "Szabo-Hever A, Singh G, et al.",
        journal: "Phytopathology 113:1967-1978",
        year: 2023,
        citations: 2, // Replace with actual citation count if available
        url: "https://apsjournals.apsnet.org/doi/abs/10.1094/PHYTO-02-23-0043-R",
        citingPapers: [
            {
                title: "Some Citing Paper 3",
                authors: "Author E, Author F",
                journal: "Journal C",
                year: 2024,
                url: "#"
            },
            {
                title: "Some Citing Paper 4",
                authors: "Author G, Author H",
                journal: "Journal D",
                year: 2024,
                url: "#"
            }
        ]
    },
    {
        title: "Genome-wide association mapping of resistance to the foliar diseases septoria nodorum blotch and tan spot in a global winter wheat collection.",
        authors: "Haugrud A, Shi G, Seneviratne S, Running K, Zhang Z, Singh G, et al.",
        journal: "Molecular Breeding 43:54",
        year: 2023,
        citations: 3, // Replace with actual citation count if available
        url: "https://link.springer.com/article/10.1007/s11032-023-01400-5",
        citingPapers: [
            {
                title: "Some Citing Paper 5",
                authors: "Author I, Author J",
                journal: "Journal E",
                year: 2024,
                url: "#"
            }
        ]
    },
    {
        title: "Resistance screening and QTL mapping in wheat and triticale against root-lesion nematode.",
        authors: "Singh G.",
        journal: "MS thesis. North Dakota State University, Fargo, ND, USA",
        year: 2020,
        citations: 5, // Replace with actual citation count if available
        url: "https://www.proquest.com/openview/f06d4867c07d7e3ea21b2e2a9b5b6cb6/1?pq-origsite=gscholar&cbl=18750&diss=y",
        citingPapers: [
            {
                title: "Some Citing Paper 6",
                authors: "Author K, Author L",
                journal: "Journal F",
                year: 2024,
                url: "#"
            }
        ]
    }
];

let totalCitations = publications.reduce((sum, pub) => sum + pub.citations, 0);

