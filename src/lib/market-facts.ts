/**
 * The "in focus" panel: one sourced market fact per industry.
 *
 * Every figure here comes from a named public source and links to it, the way
 * the dental page has always cited the Dubai Health Authority. Nothing is
 * estimated, rounded up, or attributed to HireStella. If a figure cannot be
 * sourced it does not go on the page.
 *
 * The panel says what a growing market means for a front desk. It never claims
 * a HireStella outcome, and the notes say plainly what each figure counts.
 */

export type MarketFact = {
  eyebrow: string;
  title: string;
  body: string;
  facts: { label: string; value: string; note: string }[];
  source: { title: string; url: string };
};

export const marketFacts: Record<string, MarketFact> = {
  healthcare: {
    eyebrow: 'In focus · Dubai healthcare',
    title: 'A growing city. A closer look at your front desk.',
    body: 'Dubai licensed about 5,800 healthcare facilities in 2025, up from 5,340 in 2024. More clinics and more demand mean more first contacts arriving outside the moments your team is free to answer them.',
    facts: [
      {
        label: 'Healthcare facilities',
        value: '≈5,800',
        note: 'Across the emirate in 2025, from 5,340 in 2024',
      },
      {
        label: 'General medical clinics',
        value: '126',
        note: 'A named category, not every clinic location',
      },
      {
        label: 'Specialised clinics',
        value: '68',
        note: 'Listed separately from general clinics',
      },
    ],
    source: {
      title: 'Dubai Media Office · Dubai healthcare ecosystem 2025, citing DHA',
      url: 'https://mediaoffice.ae/en/news/2026/february/18-02/dubais-healthcare-ecosystem-posts-record-growth-in-2025',
    },
  },

  hospitals: {
    eyebrow: 'In focus · Dubai healthcare',
    title: 'More departments. The same single front door.',
    body: 'Dubai counted 55 hospitals inside a licensed healthcare estate of about 5,800 facilities in 2025, staffed by a private-sector workforce of more than 69,400. Every one of those departments shares one telephone number in the mind of the person calling it.',
    facts: [
      { label: 'Hospitals', value: '55', note: 'Licensed in Dubai in 2025' },
      {
        label: 'Healthcare facilities',
        value: '≈5,800',
        note: 'All categories, from 5,340 in 2024',
      },
      {
        label: 'Private healthcare staff',
        value: '69,400+',
        note: 'In 2025, from 64,100 in 2024',
      },
    ],
    source: {
      title: 'Dubai Media Office · Dubai healthcare ecosystem 2025, citing DHA',
      url: 'https://mediaoffice.ae/en/news/2026/february/18-02/dubais-healthcare-ecosystem-posts-record-growth-in-2025',
    },
  },

  'real-estate': {
    eyebrow: 'In focus · Dubai property',
    title: 'A record year. And a lead that still goes cold overnight.',
    body: 'Dubai recorded more than 270,000 real estate transactions in 2025, worth AED 917 billion and up 20 per cent on the year. Volume on that scale arrives as enquiries, and the ones that land after hours are the ones nobody answers.',
    facts: [
      {
        label: 'Transactions',
        value: '270,000+',
        note: 'Recorded in 2025, up 20% on 2024',
      },
      { label: 'Total value', value: 'AED 917bn', note: 'All transaction types in 2025' },
      {
        label: 'Investors',
        value: '193,100',
        note: 'Up 24%, including 129,600 new investors',
      },
    ],
    source: {
      title: 'Dubai Media Office · Dubai real estate 2025, citing Dubai Land Department',
      url: 'https://mediaoffice.ae/en/news/2026/january/12-01/dubais-real-estate-market-records-new-historic-milestone',
    },
  },

  'financial-services': {
    eyebrow: 'In focus · UAE banking',
    title: 'A larger book. The same service desk behind it.',
    body: 'UAE banking assets reached about AED 5.34 trillion at the end of 2025, more than AED 780 billion above where the year started. Growth of that size arrives at the service desk as routine questions, and complex cases queue behind them.',
    facts: [
      {
        label: 'Banking assets',
        value: 'AED 5.34tn',
        note: 'At the end of December 2025',
      },
      { label: 'Growth in the year', value: 'AED 780bn+', note: 'Added across 2025' },
      {
        label: 'Deposits',
        value: 'AED 3.31tn',
        note: 'At the end of December 2025',
      },
    ],
    source: {
      title: 'Central Bank of the UAE · monetary and banking developments',
      url: 'https://www.centralbank.ae/en/research-and-statistics/latest-statistics/',
    },
  },

  automotive: {
    eyebrow: 'In focus · Dubai vehicle rental',
    title: 'More operators. More vehicles. The same enquiry.',
    body: 'Dubai ended 2024 with 3,494 active vehicle rental companies and a rental fleet of 71,040 vehicles, after growth of 33 per cent in companies and 43 per cent in commercial vehicles. The customer choosing between them asks the same questions of every one.',
    facts: [
      {
        label: 'Rental companies',
        value: '3,494',
        note: 'Active at the end of 2024, from 2,627',
      },
      {
        label: 'Rental fleet',
        value: '71,040',
        note: 'Vehicles at the end of 2024, from 49,725',
      },
      {
        label: 'Commercial vehicles',
        value: '+43%',
        note: 'Growth reported across 2024',
      },
    ],
    source: {
      title: 'Dubai Media Office · RTA licensing report 2024',
      url: 'https://mediaoffice.ae/en/news/2025/april/24-04/rta-reports-43-percent-surge-in-commercial-vehicles-and-33-percent-growth-in-vehicle-rental-firms',
    },
  },

  education: {
    eyebrow: 'In focus · Dubai private education',
    title: 'More families choosing. More questions to answer.',
    body: 'Dubai private schools enrolled 387,441 students across 227 schools in the 2024-25 academic year, enrolment up 6 per cent on the year before. Every one of those places began as questions from a family, and admissions teams need a clear way to answer them, arrange visits and follow up.',
    facts: [
      { label: 'Students enrolled', value: '387,441', note: 'Private schools, 2024-25, up 6% on the year' },
      { label: 'Private schools', value: '227', note: 'Operating in Dubai in 2024-25' },
      { label: 'Teachers', value: '27,284', note: 'Up 9% on the previous academic year' },
    ],
    source: {
      title: 'Dubai Media Office · Dubai private school sector 2024-25, citing KHDA',
      url: 'https://mediaoffice.ae/en/news/2025/january/09-01/dubais-private-school-sector',
    },
  },

  'home-services': {
    eyebrow: 'In focus · Dubai facilities management',
    title: 'Maintenance at scale becomes a coordination problem.',
    body: 'Dubai Municipality moved its public estate onto a single integrated facilities management framework covering about 2,000 buildings and more than 246,000 assets, with scheduling driven by condition rather than by a calendar. The direction is the same for a private maintenance business: the work is winnable, the coordination is what limits it.',
    facts: [
      { label: 'Buildings and facilities', value: '≈2,000', note: 'Dubai Municipality public estate, not the private market' },
      { label: 'Assets under one framework', value: '246,000+', note: 'Parks, markets, beaches, centres and buildings' },
      { label: 'Scheduling', value: 'By condition', note: 'Predictive, not a fixed maintenance calendar' },
    ],
    source: {
      title: 'Dubai Municipality · integrated facilities management model',
      url: 'https://www.dm.gov.ae/integrated-facilities-management-model-adopted/',
    },
  },

  retail: {
    eyebrow: 'In focus · UAE e-commerce',
    title: 'More orders. And a question attached to each one.',
    body: 'The UAE e-commerce market was worth AED 27.5 billion in 2023 and is forecast to pass AED 48.8 billion by 2028. Mobile commerce alone reached about AED 14.3 billion, close to four times what it was in 2018. Every order carries a question before it and often another one after it.',
    facts: [
      { label: 'Market value', value: 'AED 27.5bn', note: 'UAE e-commerce in 2023' },
      { label: 'Forecast for 2028', value: 'AED 48.8bn', note: 'A projection, not a measured figure' },
      { label: 'Mobile commerce', value: 'AED 14.3bn', note: 'In 2023, near four times the 2018 level' },
    ],
    source: {
      title: 'WAM · UAE e-commerce market to reach AED 48.8 billion by 2028',
      url: 'https://www.wam.ae/en/article/b375km1-uae-e-commerce-market-reach-aed488-billion-2028',
    },
  },

  hospitality: {
    eyebrow: 'In focus · Dubai hospitality',
    title: 'A fuller house. The same front desk behind it.',
    body: 'Dubai hotels ran at 80.7 per cent average occupancy in 2025, up from 78.2 the year before, across an inventory of 154,264 rooms in 827 establishments. Every one of those stays began as an enquiry, and the busiest hour on the floor is the busiest hour on the phone.',
    facts: [
      { label: 'Average occupancy', value: '80.7%', note: 'Dubai hotels in 2025, from 78.2% in 2024' },
      { label: 'Hotel rooms', value: '154,264', note: 'Across 827 establishments at the end of 2025' },
      { label: 'Occupied room nights', value: '44.85m', note: 'In 2025, from 43.03m in 2024' },
    ],
    source: {
      title: 'Dubai Media Office · Dubai tourism performance 2025, citing DET',
      url: 'https://mediaoffice.ae/en/news/2026/february/09-02/dubais-tourism-industry-achieves-third-successive-record-breaking-year',
    },
  },

  travel: {
    eyebrow: 'In focus · Dubai tourism',
    title: 'Every visitor asked something first.',
    body: 'Dubai welcomed 19.59 million international overnight visitors in 2025, its third successive record year. They plan from every time zone, so enquiries do not keep office hours.',
    facts: [
      { label: 'International visitors', value: '19.59m', note: 'Overnight visitors in 2025, up 5%' },
      { label: 'Average length of stay', value: '3.7 nights', note: 'Across 2025' },
      { label: 'Average daily rate', value: 'AED 579', note: 'In 2025, up 8% from AED 538' },
    ],
    source: {
      title: 'Dubai Media Office · Dubai tourism performance 2025, citing DET',
      url: 'https://mediaoffice.ae/en/news/2026/february/09-02/dubais-tourism-industry-achieves-third-successive-record-breaking-year',
    },
  },

  'professional-services': {
    eyebrow: 'In focus · Dubai business formation',
    title: 'More companies. More inbound. The same consultants.',
    body: 'Dubai Chamber of Commerce took on 53,838 new member companies in the first nine months of 2025, growth of 4 per cent on the year. Every one of them is a potential client and a potential enquiry, and qualifying them is currently somebody billable\u2019s afternoon.',
    facts: [
      { label: 'New member companies', value: '53,838', note: 'Joined in the first nine months of 2025' },
      { label: 'Year-on-year growth', value: '+4%', note: 'On the same period in 2024' },
      { label: 'What it means', value: 'More inbound', note: 'The consultant hour does not scale with it' },
    ],
    source: {
      title: 'Dubai Media Office · Dubai Chamber of Commerce membership, 2025',
      url: 'https://mediaoffice.ae/en/news/2025/november/04-11/dubai-chamber-of-commerce',
    },
  },
};
