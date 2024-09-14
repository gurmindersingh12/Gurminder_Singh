const publications = [
  {
    title: "Evaluation of durum and hard red spring wheat panels for sensitivity to necrotrophic effectors produced by Parastagonospora nodorum.",
    authors: "Szabo-Hever A, Running K, Seneviratne S, Singh G, et al.",
    journal: "Plant Disease (Under Review)",
    year: 2024,
    citations: 0,
    url: "#",
    citingPapers: []
  },
  {
    title: "Evolution, diversity, and function of the disease susceptibility gene Snn1 in wheat.",
    authors: "Seneviratne S, Shi G, Szabo-Hever A, Zhang Z, Haugrud A, Running K, Singh G, et al.",
    journal: "The Plant Journal",
    year: 2024,
    citations: 1,
    url: "https://onlinelibrary.wiley.com/doi/abs/10.1111/tpj.16879",
    citingPapers: [
      {
        title: "Citing Paper 1 for Snn1",
        authors: "Author A, Author B",
        journal: "Journal of Plant Science",
        year: 2024,
        url: "https://example.com/citing-paper-1"
      }
    ]
  },
  {
    title: "Evaluation of wheat cultivars and germplasm lines for resistance to Pratylenchus neglectus populations collected in North Dakota.",
    authors: "Singh G, et al.",
    journal: "Plant Disease 117:3817-3824",
    year: 2023,
    citations: 2,
    url: "https://apsjournals.apsnet.org/doi/abs/10.1094/PDIS-03-23-0590-RE",
    citingPapers: [
      {
        title: "Citing Paper 1 for Pratylenchus neglectus",
        authors: "Author C, Author D",
        journal: "Nematology Journal",
        year: 2023,
        url: "https://example.com/citing-paper-2"
      },
      {
        title: "Citing Paper 2 for Pratylenchus neglectus",
        authors: "Author E, Author F",
        journal: "Plant Pathology",
        year: 2023,
        url: "https://example.com/citing-paper-3"
      }
    ]
  },
  // Add the rest of your publications here, including citingPapers array for each
];
