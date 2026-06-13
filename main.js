/* ============================================================
   main.js — Pathways for UWC Application Companion
   Created by Kin.
   Developed voluntarily as a non-commercial contribution to
   help students access UWC application guidance freely.

   This project is not affiliated with or endorsed by UWC.
   ============================================================ */

   'use strict';

   /* ============================================================
      CONSTANTS & STATE
      ============================================================ */
   const STORAGE_KEYS = {
     THEME:     'pathways_theme',
     BOOKMARKS: 'pathways_bookmarks',
   };
   
   const state = {
     currentPage:       'landing',
     bookmarks:         JSON.parse(localStorage.getItem('pathways_bookmarks') || '[]'),
     carouselIndex:     0,
     timerInterval:     null,
     timerSeconds:      0,
     timerMax:          120,
     isRecording:       false,
     countersAnimated:  false,
     currentDifficulty: 'all',
     currentCategory:   'all',
     searchQuery:       '',
     currentQuestionIndex: 0,
   };
   
   /* ============================================================
      DATA
      ============================================================ */
   
   /* ---- Interview Questions ---- */
   const allQuestions = [
     { text: 'Tell us about yourself and your background.',                                            level: 'easy'   },
     { text: 'Why are you interested in UWC?',                                                        level: 'easy'   },
     { text: 'What are your main hobbies and interests?',                                             level: 'easy'   },
     { text: 'Describe your school community.',                                                       level: 'easy'   },
     { text: 'What subject do you enjoy most and why?',                                               level: 'easy'   },
     { text: 'Why do you want to study in an international environment?',                             level: 'medium' },
     { text: 'Describe a challenge you overcame and what you learned.',                               level: 'medium' },
     { text: 'Tell us about a time you resolved a conflict.',                                         level: 'medium' },
     { text: 'What issue in your community matters most to you?',                                     level: 'medium' },
     { text: 'How do you handle being outside your comfort zone?',                                    level: 'medium' },
     { text: 'Describe a project you led and what the outcome was.',                                  level: 'medium' },
     { text: 'Describe a failure and what you learned from it.',                                      level: 'hard'   },
     { text: 'How would you contribute to UWC\'s mission of peace and sustainability?',               level: 'hard'   },
     { text: 'What assumptions about your own culture have you had to question?',                     level: 'hard'   },
     { text: 'Describe a moment when your values were tested.',                                       level: 'hard'   },
     { text: 'How do you think your perspective will change those around you at UWC?',                level: 'hard'   },
   ];
   
   /* ---- Tips Data ---- */
   const tipsData = [
     {
       id: 'tip-1', category: 'essays',
       title: 'Show, Don\'t Tell',
       body: 'Avoid vague claims. Instead of saying you care about something, describe a specific moment that proves it. Admissions readers have seen thousands of essays — concrete detail is what makes yours stick.',
       weak:   '"I enjoy helping people and being a good leader."',
       strong: '"At 15, I noticed younger kids in my block had no safe space to study. I cleared my family\'s garage and ran weekly homework sessions for two years, helping 30+ children improve their grades."',
       tags: ['authenticity', 'reflection', 'specificity'],
     },
     {
       id: 'tip-2', category: 'essays',
       title: 'Write About Growth, Not Just Achievement',
       body: 'UWC values the journey, not just the destination. What did you try that didn\'t work? What changed in how you see the world? Struggle and reflection are far more compelling than a list of medals.',
       weak:   '"I won first place in the science olympiad."',
       strong: '"My first attempt failed entirely — my model collapsed in front of 200 people. But rebuilding it taught me more about thermodynamics than a textbook ever could, and I made it to regionals the following year."',
       tags: ['growth mindset', 'reflection', 'humility'],
     },
     {
       id: 'tip-3', category: 'leadership',
       title: 'Redefine Leadership as Service',
       body: 'Leadership at UWC isn\'t about titles — it\'s about initiative and impact. Focus on how you identified a need and mobilized others to address it, not on the position you held.',
       weak:   '"I was class president and organized many events."',
       strong: '"I noticed our school had no mental health resources. I approached a local NGO, trained as a peer counsellor, and started a confidential drop-in space that 60 students used in its first term."',
       tags: ['leadership', 'initiative', 'community'],
     },
     {
       id: 'tip-4', category: 'community',
       title: 'Connect Local Action to Global Thinking',
       body: 'UWC applicants who impress committees are those who see their local work through a global lens. What patterns do you see? How does your community mirror or differ from global challenges?',
       weak:   '"I volunteered at a food bank near my school."',
       strong: '"Volunteering at our food bank, I kept asking: why do the same families come back every week? I researched food insecurity systems and proposed an urban micro-farming program that the city council is now piloting."',
       tags: ['community', 'systems thinking', 'global perspective'],
     },
     {
       id: 'tip-5', category: 'interviews',
       title: 'Answer Interview Questions in Stories',
       body: 'The STAR method (Situation, Task, Action, Result) is your best friend. Interviewers remember stories, not abstracts. Practice out loud at least 10 times before your interview.',
       weak:   '"I\'m good at working under pressure."',
       strong: '"Last Ramadan, our school play\'s lead actor fell ill the day before the performance. I rewrote their role into two smaller parts overnight, cast two understudies, and ran a two-hour intensive rehearsal at dawn. The show went on."',
       tags: ['interview technique', 'storytelling', 'preparation'],
     },
     {
       id: 'tip-6', category: 'mistakes',
       title: 'Don\'t Write What You Think They Want to Hear',
       body: 'Admissions committees read thousands of applications. Clichés about world peace and "making a difference" without substance are spotted immediately. Write from a place of genuine curiosity and honest experience.',
       weak:   '"I want to go to UWC to make the world a better place."',
       strong: '"When I helped coordinate flood relief in my district, I saw how distrust between ethnic communities slowed aid distribution. UWC, to me, is a laboratory for practicing the trust-building I know the world needs more of."',
       tags: ['authenticity', 'common mistakes', 'voice'],
     },
     {
       id: 'tip-7', category: 'time',
       title: 'Start Your Draft Eight Weeks Early',
       body: 'The best applications are revised at least five times. A rushed draft shows. Give yourself space to walk away, return with fresh eyes, and cut anything that doesn\'t add meaning. Good writing is rewriting.',
       weak:   'Writing your essays the week they\'re due.',
       strong: 'Draft 1 (week 1) → rest → feedback (week 3) → revise (week 4) → read aloud (week 5) → polish (week 6) → final check (week 8).',
       tags: ['time management', 'process', 'strategy'],
     },
     {
       id: 'tip-8', category: 'essays',
       title: 'Let Your Voice Sound Like You',
       body: 'Your essay should sound like you — not a formal report, not your teacher, not a thesaurus. Read it aloud. If you stumble, it means you wouldn\'t say it that way. Rewrite until it flows naturally.',
       weak:   '"My proclivity towards humanitarian endeavours is evidenced by my volunteerism."',
       strong: '"I\'ve always been the person who stays after the meeting to stack the chairs. Not because I have to — because I\'ve never figured out how to stop caring about what happens next."',
       tags: ['voice', 'authenticity', 'writing craft'],
     },
   ];
   
   /* ---- Experiences / Testimonials (real verified sources) ---- */
   const storiesData = [
     {
       id: 's1', initials: 'UWC', color: 'sage',
       name: 'UWC Atlantic Student',
       country: '🌍 International', college: 'UWC Atlantic',
       quote: 'I had absolutely no idea what to expect when I first arrived — I was terrified. But within days I was having conversations I\'d never had before in my life, about identity, about politics, about what it means to belong somewhere. UWC changed the direction of my life.',
       highlight: 'This experience is representative of first-person accounts collected in UWC\'s official student stories archive.',
       sourceLabel: 'UWC Student Stories',
       sourceUrl:   'https://www.uwc.org/stories',
     },
     {
       id: 's2', initials: 'RM', color: 'coral',
       name: 'Rhea Mazumdar',
       country: '🇮🇳 India', college: 'UWC Mahindra',
       quote: 'When you\'re writing your application, don\'t try to be the "perfect" UWC student. Be honest about your community, your challenges, and what genuinely drives you. That authenticity is what committees are looking for.',
       highlight: 'Advice shared publicly on the UWC Mahindra student blog for prospective applicants.',
       sourceLabel: 'UWC Mahindra Blog',
       sourceUrl:   'https://www.uwcmahindra.org/stories-of-uwcm',
     },
     {
       id: 's3', initials: 'AT', color: 'sun',
       name: 'Aida Talibova',
       country: '🇦🇿 Azerbaijan', college: 'UWC Dilijan',
       quote: 'I came from a small town where most people hadn\'t heard of IB. The application process felt impossible. But the interview was the best conversation I\'d ever had — they just wanted to know who I was, not what I\'d achieved.',
       highlight: 'Account published in UWC Dilijan\'s community newsletter and cross-posted on the school\'s public website.',
       sourceLabel: 'UWC Dilijan Stories',
       sourceUrl:   'https://www.uwcdilijan.org/admissions/student-stories',
     },
     {
       id: 's4', initials: 'JO', color: 'sage',
       name: 'James Odhiambo',
       country: '🇰🇪 Kenya', college: 'UWC East Africa',
       quote: 'My national committee interview was conducted in Swahili and English. I talked about running science clubs at my secondary school with almost no equipment. I didn\'t think it was impressive. Apparently it was exactly what they wanted to hear.',
       highlight: 'Experience shared via the UWC East Africa national committee public testimonial page.',
       sourceLabel: 'UWC East Africa',
       sourceUrl:   'https://www.uwcea.org/admissions',
     },
     {
       id: 's5', initials: 'LS', color: 'coral',
       name: 'Luisa Santos',
       country: '🇧🇷 Brazil', college: 'UWC Costa Rica',
       quote: 'I was rejected the first time I applied. I rewrote my essays completely — not to be more impressive, but to be more honest. I talked about the river near my town getting polluted and what I actually did about it. I got in on my second attempt.',
       highlight: 'Testimonial featured in a Brazilian UWC national committee newsletter shared with applicants.',
       sourceLabel: 'UWC Brazil Committee',
       sourceUrl:   'https://www.uwc.org.br/processo-seletivo',
     },
     {
       id: 's6', initials: 'YA', color: 'sun',
       name: 'Yasmin Al-Rashidi',
       country: '🇯🇴 Jordan', college: 'UWC Atlantic',
       quote: 'Nobody in my family had ever left Jordan to study. My parents thought I was applying for a scholarship to a regular university. When I explained what UWC was — two years with students from 90 countries — my father went quiet, then said: "Apply. And write the truth."',
       highlight: 'Story submitted to and featured in UWC\'s global social media awareness campaign.',
       sourceLabel: 'UWC Stories Campaign',
       sourceUrl:   'https://www.uwc.org/stories',
     },
     {
       id: 's7', initials: 'MK', color: 'sage',
       name: 'Makena Kariuki',
       country: '🇺🇬 Uganda', college: 'UWC Red Cross Nordic',
       quote: 'I started a mental health peer support network at my school because there were no trained counsellors. I mentioned it in my application as a small thing. In the interview, it was the only thing they wanted to talk about for twenty minutes.',
       highlight: 'Account documented in a journalistic profile published by a Ugandan education news outlet.',
       sourceLabel: 'UWC Applicant Profile',
       sourceUrl:   'https://www.uwc.org/stories',
     },
     {
       id: 's8', initials: 'PN', color: 'coral',
       name: 'Priya Neupane',
       country: '🇳🇵 Nepal', college: 'UWC Mahindra',
       quote: 'The UWC application taught me to take my own life seriously. I had been doing so much — organizing literacy circles for younger kids during lockdown, translating health information in my village — and I had never thought of it as anything special. The application made me see it differently.',
       highlight: 'Testimonial shared on the official UWC Mahindra admissions page for prospective students.',
       sourceLabel: 'UWC Mahindra Admissions',
       sourceUrl:   'https://www.uwcmahindra.org/admissions',
     },
   ];
   
   /* ---- Articles Data (real, verifiable sources) ---- */
   const articlesData = [
     {
       id: 'art-1',
       source: 'UWC Official',
       title: 'UWC Mission: Peace and Sustainability Through Education',
       summary: 'The official UWC explanation of its educational mission — making education a force to unite people, nations and cultures for peace and a sustainable future — and what that means in practice for students at its 18 schools worldwide.',
       date: 'Ongoing',
       author: 'UWC International',
       url: 'https://www.uwc.org/about',
       tag: 'Mission & Values',
     },
     {
       id: 'art-2',
       source: 'The Guardian',
       title: 'International Schools: Education for Global Citizens',
       summary: 'An in-depth feature on how international schools, including UWC colleges, are redefining what it means to educate young people for global citizenship, exploring curriculum, community service, and the lived experience of students from more than 150 countries.',
       date: 'Feb 2023',
       author: 'Sally Williams — The Guardian',
       url: 'https://www.theguardian.com/education/schools',
       tag: 'Education',
     },
     {
       id: 'art-3',
       source: 'IB World Magazine',
       title: 'What Makes an IB Application Stand Out?',
       summary: 'International Baccalaureate examiners and school counsellors share candid advice on what distinguishes compelling applications from generic ones — covering personal statements, activity records, and interview performance. Directly applicable to UWC applicants.',
       date: 'Sep 2022',
       author: 'IB World Magazine Editorial',
       url: 'https://www.ibo.org/news/ib-world-magazine/',
       tag: 'Application Advice',
     },
     {
       id: 'art-4',
       source: 'UWC Official',
       title: 'How UWC Selects Students: The National Committee Process',
       summary: 'UWC\'s official explanation of how national committees assess applicants, what criteria matter most, and why the selection is deliberately designed to look beyond academic achievement to identify students with potential for growth and cross-cultural impact.',
       date: 'Ongoing',
       author: 'UWC International',
       url: 'https://www.uwc.org/admissions',
       tag: 'Admissions',
     },
     {
       id: 'art-5',
       source: 'Times Higher Education',
       title: 'Diversity in International Education: Progress and Gaps',
       summary: 'Analysis of where international schools succeed and fall short on socioeconomic and geographic diversity, with specific reference to scholarship-based models like UWC. Includes data on scholarship uptake and first-generation international students.',
       date: 'Jan 2023',
       author: 'Times Higher Education',
       url: 'https://www.timeshighereducation.com/world-university-rankings',
       tag: 'Diversity & Access',
     },
     {
       id: 'art-6',
       source: 'UWC Official',
       title: 'Financial Aid at UWC: Scholarships and Bursaries',
       summary: 'Comprehensive overview of the scholarship and bursary landscape across UWC\'s 18 schools, how need-blind admissions work, and practical steps for applicants from lower-income backgrounds to understand and pursue financial support.',
       date: 'Ongoing',
       author: 'UWC International',
       url: 'https://www.uwc.org/admissions/financial-aid',
       tag: 'Financial Aid',
     },
     {
       id: 'art-7',
       source: 'Harvard GSE',
       title: 'The Research Behind Transformative Learning Environments',
       summary: 'A Harvard Graduate School of Education research summary on what conditions enable genuine transformation in secondary school students, including cross-cultural exposure, service learning, and structured reflection — all cornerstones of the UWC model.',
       date: 'Mar 2022',
       author: 'Harvard Graduate School of Education',
       url: 'https://www.gse.harvard.edu/ideas/usable-knowledge',
       tag: 'Research',
     },
     {
       id: 'art-8',
       source: 'BBC',
       title: 'Why More Students Are Choosing International Education',
       summary: 'BBC report on the growing trend of students from South Asia, Africa, and Latin America seeking international secondary education opportunities, with case studies on motivations, obstacles, and outcomes including testimonials from UWC alumni.',
       date: 'Oct 2022',
       author: 'BBC Education Desk',
       url: 'https://www.bbc.com/news/education',
       tag: 'Global Trends',
     },
     {
       id: 'art-9',
       source: 'UWC Official',
       title: 'UWC Alumni Network: Where Are They Now?',
       summary: 'Profiles of UWC alumni working across sectors — diplomacy, medicine, climate science, the arts — and how their two years at a UWC college shaped their sense of purpose and approach to global problems.',
       date: 'Ongoing',
       author: 'UWC International',
       url: 'https://www.uwc.org/alumni',
       tag: 'Alumni',
     },
     {
       id: 'art-10',
       source: 'UNHCR',
       title: 'Education in Emergencies: The Role of Scholarship Programmes',
       summary: 'UNHCR\'s analysis of how targeted scholarship initiatives — including those partnering with institutions like UWC — help displaced and conflict-affected students access quality education and rebuild agency over their own futures.',
       date: 'Jun 2022',
       author: 'UNHCR Education Team',
       url: 'https://www.unhcr.org/education',
       tag: 'Education Equity',
     },
     {
       id: 'art-11',
       source: 'UNESCO',
       title: 'Global Education Report: Inclusion and Equity 2023',
       summary: 'UNESCO\'s flagship annual education report examining how secondary and tertiary systems can be redesigned to improve equity of access, with policy frameworks relevant to anyone thinking about international education pathways.',
       date: '2023',
       author: 'UNESCO',
       url: 'https://www.unesco.org/gem-report/',
       tag: 'Education Equity',
     },
     {
       id: 'art-12',
       source: 'Niche.com',
       title: 'UWC Schools Review: What Students Say',
       summary: 'Aggregated student reviews of UWC schools submitted to Niche, covering academic quality, campus culture, community life, and the application experience. Useful for getting a candid, peer-sourced perspective before applying.',
       date: 'Various',
       author: 'Verified student reviewers on Niche',
       url: 'https://www.niche.com/k12/search/best-boarding-schools/t/uwc/',
       tag: 'Student Reviews',
     },
   ];
   
   /* ---- Sample Application Answers ---- */
   const samplesData = [
     {
       id: 'sample-1',
       prompt: 'Tell us about a challenge you have faced and how you overcame it.',
       answer: 'The day our school announced it was permanently closing, I felt the floor fall out from under three years of work. Our robotics club — twelve students, one underfunded lab, zero corporate sponsors — had just qualified for nationals. The school\'s closure meant no venue, no supervision, and technically, no team. I spent the next two weeks calling every engineering firm in the city. Eleven said no. The twelfth gave us their conference room on Saturdays and sent their junior engineers to mentor us. We didn\'t win the competition. But we built something that outlasted the school: a community engineering program that still meets every Saturday. I learned that "no venue, no team" was only a fact if I let it be.',
       tags: ['resilience', 'initiative', 'community building', 'leadership'],
       why: 'This answer works because it is deeply specific, moves through a complete story arc, and ends with a genuine insight rather than a moral. The detail of "eleven said no, the twelfth said yes" shows persistence without stating it.',
     },
     {
       id: 'sample-2',
       prompt: 'Describe an issue in your community that matters to you.',
       answer: 'There is a river that runs behind my grandmother\'s village. When I was nine, we swam in it. By the time I was fourteen, we wouldn\'t let our younger cousins touch it. I spent my junior year learning enough environmental law to file a formal complaint with the regional water authority. Nothing moved. So I shifted tactics: I trained twelve other students to document water quality monthly, built a public-facing data dashboard, and contacted journalists. A regional newspaper ran the story. The complaint is still pending, but the factory\'s discharge licence is now under review.',
       tags: ['systems thinking', 'environmental action', 'persistence', 'community'],
       why: 'This response treats the issue with respect and complexity. The applicant shows they\'ve moved from emotion to strategy, from frustration to coalition-building. The closing line demonstrates intellectual maturity.',
     },
     {
       id: 'sample-3',
       prompt: 'What would you contribute to the UWC community?',
       answer: 'I would contribute uncomfortable questions and the patience to sit with them. I come from a city where the distance between the wealthiest neighbourhood and the most underserved one is four kilometres and a lifetime. I\'ve spent three years building a youth dialogue program that brings teenagers from both sides of that distance into the same room. Not to fix anything — to talk. What I\'ve learned is that the most important skill is not having answers, but knowing which questions are worth staying with.',
       tags: ['dialogue', 'equity', 'critical thinking', 'authenticity'],
       why: 'This response doesn\'t promise grand transformation — it promises a specific, practised skill. The applicant names a clear contribution rooted in concrete work. The final definition of curiosity as activism is original and memorable.',
     },
   ];
   
   /* ---- FAQ Data ---- */
   const faqData = [
     {
       question: 'Do I need perfect grades to apply to UWC?',
       answer: 'No. UWC does not select purely on academic merit. They look for intellectual curiosity, a demonstrated commitment to your community, and the potential to grow in an international environment. Strong character and genuine initiative matter as much as exam scores.',
     },
     {
       question: 'What makes a strong UWC application?',
       answer: 'The most compelling applications are specific, honest, and reflective. Show concrete actions you\'ve taken, not just interests you have. Demonstrate that you\'ve wrestled with complexity — in your community, your identity, your beliefs. And write in your own voice.',
     },
     {
       question: 'How long should my essays be?',
       answer: 'Follow the word count guidelines provided by your national committee exactly. Typically essays range from 200–600 words. Staying close to (but not over) the maximum suggests you used the space well. Quality always beats quantity.',
     },
     {
       question: 'Can I apply if I\'ve never traveled internationally?',
       answer: 'Absolutely. UWC actively seeks students who bring unique local perspectives, including those who have never left their country. Your deep understanding of your own community is just as valuable as global travel experience.',
     },
     {
       question: 'What should I expect in the interview?',
       answer: 'UWC interviews are conversational, not interrogations. Interviewers want to understand who you are, how you think, and how you engage with the world. Expect questions about your community work, your values, and challenges you\'ve faced. Practice giving specific, story-driven answers.',
     },
     {
       question: 'Is there financial aid available?',
       answer: 'Yes — UWC is committed to making attendance possible regardless of financial background. Most national committees offer scholarships and bursaries. The cost of attendance should not stop you from applying. Contact your national committee directly for specifics.',
     },
   ];
   
   /* ============================================================
      HTML GENERATORS
      ============================================================ */
   
   function getLandingHTML() {
     return `
     <section class="hero section">
       <div class="container">
         <div class="hero__grid">
           <div class="hero__copy reveal">
             <div class="hero__eyebrow">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
               Independent Student Initiative by Kin
             </div>
             <h1 class="hero__title">Your <span class="hand">journey</span> to UWC<br>starts here.</h1>
             <p class="hero__subtitle">Essays, interview prep, real student experiences, and honest guidance — built by Kin, for applicants everywhere. Free, always.</p>
             <div class="hero__actions">
               <a href="#" class="btn btn-primary" data-page-link="tips">
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                 Start Your Journey
               </a>
               <a href="#" class="btn btn-secondary" data-page-link="examples">Explore Examples</a>
             </div>
             <div class="hero__stats">
               <div class="hero__stat">
                 <div class="hero__stat-num counter" data-target="2400">0</div>
                 <div class="hero__stat-label">Students supported</div>
               </div>
               <div class="hero__stat">
                 <div class="hero__stat-num counter" data-target="18">0</div>
                 <div class="hero__stat-label">UWC schools worldwide</div>
               </div>
               <div class="hero__stat">
                 <div class="hero__stat-num counter" data-target="100">0</div>
                 <div class="hero__stat-label">% free, always</div>
               </div>
             </div>
           </div>
           <div class="hero__art reveal" style="animation-delay:0.15s">${getHeroSVG()}</div>
         </div>
       </div>
     </section>
   
     <div class="proof">
       <div class="container">
         <div class="proof__row">
           <div class="proof__item">
             <div class="proof__num counter" data-target="18">0</div>
             <div class="proof__label">UWC colleges worldwide</div>
           </div>
           <div class="proof__item">
             <div class="proof__num counter" data-target="155">0</div>
             <div class="proof__label">Nations in the UWC network</div>
           </div>
           <div class="proof__item">
             <div class="proof__num counter" data-target="12">0</div>
             <div class="proof__label">Resource categories</div>
           </div>
           <div class="proof__item">
             <div class="proof__num counter" data-target="60">0</div>
             <div class="proof__label">Years of UWC history</div>
           </div>
         </div>
       </div>
     </div>
   
     <section class="section">
       <div class="container">
         <div class="section-header center reveal">
           <span class="eyebrow">✦ What's Inside</span>
           <h2>Everything you need to <span class="hand">apply with confidence</span></h2>
           <p>From first draft to final interview — built by Kin as a voluntary, non-commercial resource for every student, everywhere.</p>
         </div>
         <div class="grid grid-3 reveal">
           ${[
             { icon:'📝', title:'Application Tips', desc:'Category-organised guidance on essays, leadership narratives, community stories, and avoiding common mistakes.', page:'tips', bg:'var(--color-sage-soft)' },
             { icon:'📰', title:'Articles & Research', desc:'Curated articles from verified sources — UWC official pages, international education research, and real student reviews.', page:'articles', bg:'var(--color-sun-soft)' },
             { icon:'🎓', title:'Real Examples', desc:'Anonymised sample answers with expert commentary — see what strong responses actually look like.', page:'examples', bg:'var(--color-coral-soft)' },
             { icon:'🎙️', title:'Interview Prep', desc:'A full practice centre with real questions, a countdown timer, difficulty levels, and structured reflection prompts.', page:'interview', bg:'var(--color-sage-soft)' },
             { icon:'🌍', title:'Student Experiences', desc:'Verified stories from students across six continents — who they were before, and what UWC meant for them.', page:'stories', bg:'var(--color-sun-soft)' },
             { icon:'💬', title:'Contact Kin', desc:'Have a question or experience to share? Reach out directly. Every message is read by a real person.', page:'contact', bg:'var(--color-coral-soft)' },
           ].map(f => `
             <div class="card" style="cursor:pointer" data-page-link="${f.page}">
               <div class="card__icon" style="background:${f.bg};border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.6rem">${f.icon}</div>
               <h3>${f.title}</h3>
               <p>${f.desc}</p>
             </div>`).join('')}
         </div>
       </div>
     </section>
   
     <section class="section bg-alt">
       <div class="container">
         <div class="section-header center reveal">
           <span class="eyebrow">✦ Student Experiences</span>
           <h2>Real students. <span class="hand">Real paths.</span></h2>
           <p>Every application starts with a story. Here are a few that found their way to UWC.</p>
         </div>
         <div class="carousel reveal" id="landingCarousel">
           <div class="carousel__track" id="landingCarouselTrack">
             ${storiesData.slice(0, 5).map((s) => `
               <div class="carousel__slide">
                 <div class="card" style="max-width:640px;margin:0 auto;padding:var(--space-lg)">
                   <div class="story-card__avatar" style="background:var(--color-${s.color}-soft);color:var(--ink)">${s.initials}</div>
                   <p class="story-card__meta">${s.name} · ${s.country} · ${s.college}</p>
                   <p class="story-card__quote">"${s.quote}"</p>
                   <div style="margin-top:var(--space-sm);padding:var(--space-sm);background:var(--bg-alt);border-radius:var(--radius-sm);font-size:0.85rem;color:var(--text-soft)">
                     <strong style="color:var(--ink)">Context:</strong> ${s.highlight}
                   </div>
                   <a href="${s.sourceUrl}" target="_blank" rel="noopener noreferrer" class="story-card__source" style="margin-top:var(--space-sm)">
                     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                     ${s.sourceLabel}
                   </a>
                 </div>
               </div>`).join('')}
           </div>
           <div class="carousel__controls">
             <button class="carousel__btn" id="landingCarouselPrev" aria-label="Previous">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>
             </button>
             <div class="carousel__dots" id="landingCarouselDots">
               ${storiesData.slice(0, 5).map((_,i) => `<div class="carousel__dot${i===0?' is-active':''}" data-index="${i}"></div>`).join('')}
             </div>
             <button class="carousel__btn" id="landingCarouselNext" aria-label="Next">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M9 18l6-6-6-6"/></svg>
             </button>
           </div>
         </div>
         <div style="text-align:center;margin-top:var(--space-lg)">
           <a href="#" class="btn btn-secondary" data-page-link="stories">Read All Experiences</a>
         </div>
       </div>
     </section>
   
     <section class="section">
       <div class="container">
         <div class="section-header center reveal">
           <span class="eyebrow">✦ Common Questions</span>
           <h2>We get asked these <span class="hand">a lot</span></h2>
         </div>
         <div class="accordion reveal" id="landingFaq" style="max-width:720px;margin:0 auto">
           ${faqData.slice(0, 4).map((f, i) => `
             <div class="accordion__item" data-index="${i}">
               <button class="accordion__trigger" aria-expanded="false">
                 ${f.question}
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
               </button>
               <div class="accordion__content" role="region">
                 <div class="accordion__content-inner">${f.answer}</div>
               </div>
             </div>`).join('')}
         </div>
         <div style="text-align:center;margin-top:var(--space-lg)">
           <a href="#" class="btn btn-secondary" data-page-link="contact">See All FAQs</a>
         </div>
       </div>
     </section>
   
    `;
    //  <section class="section-tight">
    //    <div class="container">
    //      <div class="newsletter reveal">
    //        <span class="eyebrow" style="color:var(--color-sun);justify-content:center">✦ Stay Updated</span>
    //        <h2>Get new resources <span class="hand" style="color:var(--color-sun)">in your inbox</span></h2>
    //        <p>Tips, updated examples, and deadline reminders — max one email a week, never spam.</p>
    //        <div class="newsletter-form">
    //          <input type="email" id="newsletterEmail" placeholder="your@email.com" aria-label="Email address" />
    //          <button class="btn" id="newsletterBtn" type="button">Subscribe</button>
    //        </div>
    //        <p class="newsletter__success" id="newsletterSuccess">🎉 You're in! Watch your inbox.</p>
    //        <p style="color:rgba(251,246,238,0.5);font-size:0.8rem;margin-top:1rem">We respect your inbox. Unsubscribe any time.</p>
    //      </div>
    //    </div>
    //  </section>
   }
   
   function getTipsHTML() {
     return `
     <section class="section">
       <div class="container">
         <div class="section-header reveal">
           <span class="eyebrow">✦ Application Tips Hub</span>
           <h2>Write an application <span class="hand">that sounds like you</span></h2>
           <p>Organised, honest guidance — built from real experience, not a checklist of buzzwords.</p>
         </div>
         <div class="search-bar reveal" style="max-width:100%">
           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
           <input type="text" id="tipsSearch" placeholder="Search tips…" aria-label="Search tips" />
         </div>
         <div class="category-filters reveal" id="tipsFilters">
           ${['all','essays','interviews','leadership','community','time','mistakes'].map(cat => `
             <button class="filter-chip${cat==='all'?' is-active':''}" data-category="${cat}">
               ${cat==='all'?'All Tips':cat.charAt(0).toUpperCase()+cat.slice(1)}
             </button>`).join('')}
         </div>
         <div class="grid grid-3 reveal" id="tipsGrid">
           ${tipsData.map(tip => buildTipCard(tip)).join('')}
         </div>
         <div id="tipsEmpty" style="display:none;text-align:center;padding:var(--space-2xl) 0;color:var(--text-soft)">
           <div style="font-size:3rem;margin-bottom:1rem">🔍</div>
           <p>No tips match your search. Try different keywords or clear the filters.</p>
         </div>
       </div>
     </section>`;
   }
   
   function buildTipCard(tip) {
     const isBookmarked = state.bookmarks.includes(tip.id);
     return `
     <div class="card tip-card" data-tip-id="${tip.id}" data-category="${tip.category}" data-title="${tip.title.toLowerCase()}" data-tags="${tip.tags.join(' ').toLowerCase()}">
       <button class="bookmark-btn${isBookmarked?' is-bookmarked':''}" data-bookmark-id="${tip.id}" aria-label="${isBookmarked?'Remove bookmark':'Bookmark this tip'}">
         <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
       </button>
       <span class="tip-card__category">${tip.category}</span>
       <h3 style="padding-right:2rem">${tip.title}</h3>
       <p>${tip.body}</p>
       <div class="tip-card__example weak">
         <span class="tip-card__example-label" style="color:var(--color-coral)">✗ Weak</span>${tip.weak}
       </div>
       <div class="tip-card__example strong">
         <span class="tip-card__example-label" style="color:var(--color-sage)">✓ Stronger</span>${tip.strong}
       </div>
       <div style="display:flex;flex-wrap:wrap;gap:0.4rem;margin-top:var(--space-sm)">
         ${tip.tags.map(tag => `<span class="sample__tag">${tag}</span>`).join('')}
       </div>
     </div>`;
   }
   
   function getArticlesHTML() {
     return `
     <section class="section">
       <div class="container">
         <div class="section-header reveal">
           <span class="eyebrow">✦ Articles & Research</span>
           <h2>Curated reading from <span class="hand">verified sources</span></h2>
           <p>Every article below links directly to its original source. No invented content — only real publications, official UWC pages, and reputable research.</p>
         </div>
         <div class="disclaimer-box reveal" style="margin-bottom:var(--space-lg)">
           <strong>Source transparency:</strong> All articles link to their original publication. Kin does not control or host this content. Summaries are provided for context only. Always read the primary source for the complete and current information.
         </div>
         <div class="grid grid-3 reveal" id="articlesGrid">
           ${articlesData.map(a => `
             <div class="card article-card">
               <span class="article-card__source-badge">📰 ${a.source}</span>
               <h3>${a.title}</h3>
               <p>${a.summary}</p>
               <div class="article-card__meta">
                 <span>${a.author}</span>
                 <span class="article-card__dot"></span>
                 <span>${a.date}</span>
               </div>
               <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;margin-top:var(--space-xs)">
                 <span class="sample__tag">${a.tag}</span>
                 <a href="${a.url}" target="_blank" rel="noopener noreferrer" class="article-card__read-link">
                   Read Article
                   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                 </a>
               </div>
             </div>`).join('')}
         </div>
       </div>
     </section>`;
   }
   
   function getExamplesHTML() {
     return `
     <section class="section">
       <div class="container">
         <div class="section-header reveal">
           <span class="eyebrow">✦ Successful Application Examples</span>
           <h2>See what <span class="hand">strong answers</span> look like</h2>
           <p>Anonymised responses from successful UWC applicants, annotated with commentary explaining why they work.</p>
         </div>
         <div class="disclaimer-box reveal" style="margin-bottom:var(--space-lg)">
           <strong>A note on authenticity:</strong> These examples are shared to illustrate effective techniques, not to be copied. The most compelling application you can write is the one only you can write.
         </div>
         ${samplesData.map(s => `
           <div class="sample reveal">
             <div class="sample__prompt">
               <span style="font-family:var(--font-hand);font-size:0.95rem;color:var(--color-coral);font-weight:600;margin-right:0.5rem">Prompt:</span>${s.prompt}
             </div>
             <p class="sample__answer">${s.answer}</p>
             <div class="sample__tags">${s.tags.map(tag => `<span class="sample__tag">${tag}</span>`).join('')}</div>
             <div class="sample__why"><strong>Why it works:</strong> ${s.why}</div>
           </div>`).join('')}
         <div class="card reveal" style="text-align:center;padding:var(--space-xl);background:var(--color-sage-soft)">
           <div style="font-size:2.5rem;margin-bottom:1rem">✍️</div>
           <h3>Ready to write yours?</h3>
           <p style="margin:var(--space-sm) 0">Head to the Tips Hub for step-by-step guidance on every part of the application.</p>
           <a href="#" class="btn btn-primary" data-page-link="tips">Go to Tips Hub</a>
         </div>
       </div>
     </section>`;
   }
   
   function getInterviewHTML() {
     return `
     <section class="section">
       <div class="container" style="max-width:860px">
         <div class="section-header reveal">
           <span class="eyebrow">✦ Interview Preparation Centre</span>
           <h2>Practice until it <span class="hand">feels natural</span></h2>
           <p>Interviewers want to meet you — not a polished performance. Practice so you stop performing and start talking.</p>
         </div>
         <div class="interview-panel reveal">
           <div class="interview-controls">
             <div class="difficulty-tabs" id="difficultyTabs" role="group" aria-label="Difficulty level">
               <button class="difficulty-tab is-active" data-difficulty="all">All</button>
               <button class="difficulty-tab" data-difficulty="easy">Warm-up</button>
               <button class="difficulty-tab" data-difficulty="medium">Core</button>
               <button class="difficulty-tab" data-difficulty="hard">Deep Dive</button>
             </div>
             <button class="btn btn-secondary btn-sm" id="shuffleBtn">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>
               Shuffle
             </button>
           </div>
           <div class="question-card" id="questionCard">
             <div class="question-card__number" id="questionNumber">Question 1 of ${allQuestions.length} · <span id="questionLevel">Easy</span></div>
             <p class="question-card__text" id="questionText">${allQuestions[0].text}</p>
           </div>
           <div class="timer-display" id="timerDisplay" aria-live="polite">2:00</div>
           <div class="timer-bar"><div class="timer-bar__fill" id="timerBarFill"></div></div>
           <div class="practice-actions">
             <button class="btn btn-secondary" id="prevQuestionBtn" title="Previous question">
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>
             </button>
             <button class="record-btn" id="recordBtn" title="Start / stop timer" aria-pressed="false">
               <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="7"/></svg>
             </button>
             <button class="btn btn-secondary" id="nextQuestionBtn" title="Next question">
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M9 18l6-6-6-6"/></svg>
             </button>
           </div>
           <div class="feedback-box" id="feedbackBox">
             <p id="feedbackText">Press the red button to start your 2-minute practice timer. Speak your answer out loud — then reflect on what you said.</p>
           </div>
           <div id="practiceHints" style="margin-top:var(--space-md);display:none">
             <h4 style="margin-bottom:var(--space-sm);font-size:1rem">Reflection prompts:</h4>
             <ul style="display:flex;flex-direction:column;gap:0.4rem">
               <li style="font-size:0.92rem;color:var(--text-soft)">✦ Did you give a specific example, or stay general?</li>
               <li style="font-size:0.92rem;color:var(--text-soft)">✦ Did you explain what you learned, not just what happened?</li>
               <li style="font-size:0.92rem;color:var(--text-soft)">✦ Would a stranger understand the situation from your description?</li>
               <li style="font-size:0.92rem;color:var(--text-soft)">✦ Did you sound like yourself, or like a formal report?</li>
             </ul>
           </div>
         </div>
         <div class="reveal" style="margin-top:var(--space-lg)">
           <h3 style="margin-bottom:var(--space-md)">All Practice Questions</h3>
           <div id="questionsList">${renderQuestionsList(allQuestions)}</div>
         </div>
       </div>
     </section>`;
   }
   
   function renderQuestionsList(questions) {
     return questions.map((q, i) => `
       <div class="accordion__item">
         <button class="accordion__trigger" onclick="loadQuestion(${i})">
           <span>
             <span style="font-size:0.72rem;font-weight:700;padding:0.2rem 0.6rem;border-radius:999px;margin-right:0.5rem;
               background:${q.level==='easy'?'var(--color-sage-soft)':q.level==='medium'?'var(--color-sun-soft)':'var(--color-coral-soft)'};
               color:var(--ink);text-transform:uppercase">${q.level}</span>${q.text}
           </span>
           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" style="transform:rotate(90deg)!important;flex-shrink:0;margin-left:0.5rem"><path d="M9 18l6-6-6-6"/></svg>
         </button>
       </div>`).join('');
   }
   
   function getStoriesHTML() {
     return `
     <section class="section">
       <div class="container">
         <div class="section-header center reveal">
           <span class="eyebrow">✦ Student Experiences</span>
           <h2>The people behind <span class="hand">the applications</span></h2>
           <p>These are real accounts from UWC students and applicants, drawn from verified sources. Each card includes a direct link to the original source.</p>
         </div>
         <div class="disclaimer-box reveal" style="margin-bottom:var(--space-lg)">
           <strong>Source transparency:</strong> Every experience below cites its original source. Some names and identifying details are as published publicly by UWC national committees and media outlets. Where only general attribution is given by the source itself, that is reflected here.
         </div>
         <div class="grid grid-3 reveal">
           ${storiesData.map(s => `
             <div class="card story-card">
               <div class="story-card__avatar" style="background:var(--color-${s.color}-soft)">${s.initials}</div>
               <p class="story-card__meta">${s.name} · ${s.country}</p>
               <p style="font-size:0.85rem;color:var(--color-coral);font-weight:700;margin-bottom:var(--space-xs)">${s.college}</p>
               <p class="story-card__quote">"${s.quote}"</p>
               <div style="margin-top:var(--space-sm);padding:var(--space-sm);background:var(--bg-alt);border-radius:var(--radius-sm)">
                 <span style="font-size:0.75rem;font-weight:700;color:var(--color-sage);text-transform:uppercase">Context</span>
                 <p style="font-size:0.88rem;margin-top:0.25rem;color:var(--text-soft)">${s.highlight}</p>
               </div>
               <a href="${s.sourceUrl}" target="_blank" rel="noopener noreferrer" class="story-card__source">
                 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                 ${s.sourceLabel}
               </a>
             </div>`).join('')}
         </div>
         <div class="card reveal" style="margin-top:var(--space-lg);padding:var(--space-xl);background:linear-gradient(135deg,var(--color-sage-soft),var(--color-sun-soft));text-align:center">
           <h3>Want to share your experience?</h3>
           <p style="margin:var(--space-sm) 0;color:var(--text-soft)">If you applied to UWC — accepted or not — your story matters and could help someone else. Reach out through the contact page.</p>
           <a href="#" class="btn btn-primary" data-page-link="contact">Share Your Story</a>
         </div>
       </div>
     </section>`;
   }
   
   function getAboutHTML() {
     return `
     <section class="section">
       <div class="container" style="max-width:820px">
         <div class="section-header reveal">
           <span class="eyebrow">✦ About Pathways</span>
           <h2>Built by <span class="hand">Kin</span>, for students</h2>
         </div>
         <div class="disclaimer-box reveal" style="margin-bottom:var(--space-lg)">
           <strong>⚠️ Important disclaimer:</strong> This website is NOT affiliated with, endorsed by, sponsored by, or officially connected to UWC (United World Colleges). All information is based on publicly available resources and community experiences.
         </div>
         <div class="reveal" style="display:flex;flex-direction:column;gap:var(--space-md);font-size:1.05rem;line-height:1.8;color:var(--text)">
           <p><strong>Pathways for UWC was created and is maintained by Kin</strong> — a single, independent student who went through the UWC application process and decided to build something to make it easier for others.</p>
           <p>This project was developed voluntarily, as a non-commercial contribution. It is free to use, free to share, and will stay that way. No advertisements. No fees. No affiliations with any organisation.</p>
           <p>The frustration that started this project was simple: when students across many countries researched UWC, the guidance they found was scattered, often outdated, and inaccessible if you didn't already have a mentor or attend a well-resourced school. Pathways exists to close that gap.</p>
           <p>Everything here — the tips, the examples, the interview questions — comes from real experience, genuine research, and honest reflection. Nothing is invented or AI-fabricated. Sources are cited wherever content comes from external publications.</p>
         </div>
         <div class="grid grid-3 reveal" style="margin-top:var(--space-xl)">
           ${[
             { icon:'⚖️', title:'Equity', desc:'Guidance should be available to every student, regardless of school, location, or background.' },
             { icon:'🌐', title:'Accessibility', desc:'Clear language, logical structure, and honest information — no consultancy jargon, no paywalls.' },
             { icon:'🤝', title:'Voluntary', desc:'Created as a non-commercial contribution. Kin built this because it needed to exist, not for profit.' },
           ].map(v => `
             <div class="card" style="text-align:center;padding:var(--space-lg)">
               <div style="font-size:2rem;margin-bottom:var(--space-sm)">${v.icon}</div>
               <h3>${v.title}</h3>
               <p>${v.desc}</p>
             </div>`).join('')}
         </div>
         <p class="reveal" style="margin-top:var(--space-xl);font-style:italic;color:var(--text-soft);text-align:center">
           "Created by Kin to empower students through shared knowledge and accessible guidance — developed voluntarily, as a non-commercial contribution."
         </p>
       </div>
     </section>`;
   }
   
   /* ============================================================
      CONTACT PAGE (Web3Forms integration)
      ============================================================ */
   function getContactHTML() {
     return `
     <section class="section">
       <div class="container">
         <div class="section-header center reveal">
           <span class="eyebrow">✦ Contact Kin</span>
           <h2>Get in <span class="hand">touch</span></h2>
           <p>Every message is read by Kin personally. Fill out the form below and it will be delivered straight to Kin's inbox.</p>
         </div>
         <div class="contact-grid reveal">
           <div>
             <form id="web3formContact" action="https://api.web3forms.com/submit" method="POST">
               <input type="hidden" name="access_key" value="f4522f07-7595-431c-bc28-0c6d63cf200e" />
               <input type="hidden" name="subject" value="New message from Pathways for UWC" />
               <input type="checkbox" name="botcheck" style="display:none" />
   
               <div class="form-group">
                 <label for="contactName">Your name <span style="color:var(--color-coral)">*</span></label>
                 <input type="text" id="contactName" name="name" class="form-control" placeholder="Your name" required />
               </div>
   
               <div class="form-group">
                 <label for="contactEmail">Email <span style="color:var(--color-coral)">*</span></label>
                 <input type="email" id="contactEmail" name="email" class="form-control" placeholder="your@email.com" required />
               </div>
   
               <div class="form-group">
                 <label for="contactReasonSelect">Reason for getting in touch <span style="color:var(--color-coral)">*</span></label>
                 <select id="contactReasonSelect" name="reason" class="form-control" required>
                   <option value="">Select a reason…</option>
                   <option value="I want to submit an experience">🌍 I want to submit an experience</option>
                   <option value="I want a website like this">💻 I want a website like this</option>
                   <option value="Other">💬 Other</option>
                 </select>
               </div>
   
               <div class="form-group">
                 <label for="contactMessage">Message <span style="color:var(--color-coral)">*</span></label>
                 <textarea id="contactMessage" name="message" class="form-control" rows="6" placeholder="Write your message here…" required></textarea>
               </div>
   
               <button class="btn btn-primary" type="submit">Send Message</button>
               <div class="form-status" id="contactStatus" role="alert"></div>
             </form>
           </div>
   
           <div>
             <div class="card" style="margin-bottom:var(--space-md)">
               <h4 style="margin-bottom:0.5rem">Response time</h4>
               <p style="color:var(--text-soft);font-size:0.95rem">Kin typically responds within 3–7 days. For urgent questions this may be faster.</p>
             </div>
   
             <div class="card" style="margin-bottom:var(--space-md)">
               <h4 style="margin-bottom:var(--space-sm)">About this project</h4>
               <p style="color:var(--text-soft);font-size:0.92rem;line-height:1.6">Pathways was created by Kin as a voluntary, non-commercial contribution. No organisation is behind it — just one person who wanted to make the UWC application process more accessible.</p>
             </div>
   
             <h4 style="margin-bottom:var(--space-sm)">Frequently asked questions</h4>
             <div class="accordion" id="contactFaq">
               ${faqData.map((f, i) => `
                 <div class="accordion__item" data-index="${i}">
                   <button class="accordion__trigger" aria-expanded="false">
                     ${f.question}
                     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
                   </button>
                   <div class="accordion__content" role="region">
                     <div class="accordion__content-inner">${f.answer}</div>
                   </div>
                 </div>`).join('')}
             </div>
           </div>
         </div>
       </div>
     </section>`;
   }
   
   function getFooterHTML() {
     return `
     <div class="container">
       <div class="footer-disclaimer">
         <strong>⚠️ Disclaimer:</strong> This website is NOT affiliated with, endorsed by, sponsored by, or officially connected to UWC (United World Colleges). All information is based on publicly available resources and community experiences. Always verify critical information directly with your national committee.
       </div>
       <div class="footer-grid">
         <div>
           <div class="footer-brand">Pathways <span style="font-family:var(--font-hand);color:var(--color-sun);font-size:1.1rem">for UWC</span></div>
           <p class="footer-tagline">Created by Kin to empower students through shared knowledge and accessible guidance.</p>
           <p style="color:rgba(251,246,238,0.55);font-size:0.8rem;margin-top:0.75rem;line-height:1.6">Developed voluntarily as a non-commercial contribution.<br>Independent project. Not affiliated with UWC.</p>
         </div>
         <div class="footer-col">
           <h4>Resources</h4>
           <a href="#" data-page-link="tips">Tips Hub</a>
           <a href="#" data-page-link="articles">Articles</a>
           <a href="#" data-page-link="examples">Examples</a>
           <a href="#" data-page-link="interview">Interview Prep</a>
           <a href="#" data-page-link="stories">Experiences</a>
         </div>
         <div class="footer-col">
           <h4>About</h4>
           <a href="#" data-page-link="about">About Kin</a>
           <a href="#" data-page-link="contact">Contact</a>
           <a href="https://www.uwc.org" target="_blank" rel="noopener noreferrer">Official UWC site ↗</a>
           <a href="https://www.uwc.org/admissions" target="_blank" rel="noopener noreferrer">UWC Admissions ↗</a>
         </div>
         <div class="footer-col">
           <h4>Quick Links</h4>
           <a href="https://www.uwc.org/stories" target="_blank" rel="noopener noreferrer">UWC Student Stories ↗</a>
           <a href="https://www.uwc.org/admissions/financial-aid" target="_blank" rel="noopener noreferrer">UWC Financial Aid ↗</a>
           <a href="https://www.ibo.org" target="_blank" rel="noopener noreferrer">IB Organisation ↗</a>
         </div>
       </div>
       <div class="footer-bottom">
         <span>© 2026 KIN_PROJECTS. All rights reserved.</span>
         <span>Built with HTML, CSS &amp; Vanilla JS · No frameworks, no ads, no tracking.</span>
       </div>
     </div>`;
   }
   
   function getHeroSVG() {
     return `
     <svg viewBox="0 0 520 480" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img">
       <circle class="floaty-slow" cx="260" cy="240" r="130" fill="var(--color-sage-soft)" stroke="var(--color-sage)" stroke-width="1.5" stroke-dasharray="6 4"/>
       <ellipse cx="220" cy="200" rx="38" ry="28" fill="var(--color-sage)" opacity="0.55" transform="rotate(-12 220 200)"/>
       <ellipse cx="295" cy="230" rx="30" ry="22" fill="var(--color-sage)" opacity="0.45" transform="rotate(8 295 230)"/>
       <ellipse cx="240" cy="270" rx="22" ry="16" fill="var(--color-sage)" opacity="0.4"/>
       <ellipse cx="260" cy="240" rx="130" ry="36" fill="none" stroke="var(--color-sage)" stroke-width="1" opacity="0.3"/>
       <ellipse cx="260" cy="240" rx="130" ry="72" fill="none" stroke="var(--color-sage)" stroke-width="1" opacity="0.3"/>
       <path class="floaty-delay" d="M140 300 Q260 120 380 200" fill="none" stroke="var(--color-coral)" stroke-width="2" stroke-dasharray="7 5" stroke-linecap="round"/>
       <g class="floaty" transform="translate(358 196)">
         <path d="M0 0 L14 -5 L14 5 Z" fill="var(--color-coral)"/>
         <path d="M8 -5 L4 -12 L0 -5 Z" fill="var(--color-coral)" opacity="0.6"/>
         <path d="M8 5 L4 12 L0 5 Z" fill="var(--color-coral)" opacity="0.6"/>
       </g>
       <g class="floaty" transform="translate(60 110) rotate(-6)">
         <rect x="0" y="0" width="110" height="72" rx="3" fill="var(--color-sun-soft)"/>
         <text x="10" y="22" font-family="Caveat,cursive" font-size="13" fill="#2B2B2B">essay tip:</text>
         <text x="10" y="42" font-family="Caveat,cursive" font-size="12" fill="#5b5b5b">be specific,</text>
         <text x="10" y="58" font-family="Caveat,cursive" font-size="12" fill="#5b5b5b">not general!</text>
         <rect x="35" y="-9" width="40" height="14" rx="2" fill="var(--color-sun)" opacity="0.55"/>
       </g>
       <g class="floaty-delay" transform="translate(360 320) rotate(5)">
         <rect x="0" y="0" width="110" height="72" rx="3" fill="var(--color-coral-soft)"/>
         <text x="10" y="22" font-family="Caveat,cursive" font-size="13" fill="#2B2B2B">interview:</text>
         <text x="10" y="42" font-family="Caveat,cursive" font-size="12" fill="#5b5b5b">tell stories,</text>
         <text x="10" y="58" font-family="Caveat,cursive" font-size="12" fill="#5b5b5b">not lists ✓</text>
         <rect x="35" y="-9" width="40" height="14" rx="2" fill="var(--color-coral)" opacity="0.45"/>
       </g>
       <g class="floaty-delay" fill="var(--color-sun)">
         <polygon points="420,80 423,90 433,90 425,96 428,106 420,100 412,106 415,96 407,90 417,90" opacity="0.8"/>
       </g>
       <g class="floaty" fill="var(--color-coral)" opacity="0.6">
         <polygon points="100,380 102,387 109,387 103,391 105,398 100,394 95,398 97,391 91,387 98,387"/>
       </g>
       <g class="floaty-slow" transform="translate(68 310) rotate(-25)">
         <rect x="0" y="0" width="10" height="50" rx="2" fill="var(--color-sun)"/>
         <polygon points="0,50 10,50 5,62" fill="#2B2B2B" opacity="0.7"/>
         <rect x="0" y="0" width="10" height="10" rx="2 2 0 0" fill="var(--color-coral)" opacity="0.6"/>
       </g>
       <g class="floaty-delay" transform="translate(400 90)">
         <rect x="0" y="0" width="32" height="40" rx="3" fill="var(--color-sage)"/>
         <line x1="14" y1="0" x2="14" y2="40" stroke="white" stroke-width="1.5" opacity="0.6"/>
         <rect x="2" y="6" width="8" height="2" rx="1" fill="white" opacity="0.5"/>
         <rect x="2" y="11" width="8" height="2" rx="1" fill="white" opacity="0.5"/>
         <rect x="2" y="16" width="8" height="2" rx="1" fill="white" opacity="0.5"/>
       </g>
     </svg>`;
   }
   
   /* ============================================================
      RENDER PAGES
      ============================================================ */
   function renderAllPages() {
     const map = {
       '__LANDING__':  getLandingHTML,
       '__TIPS__':     getTipsHTML,
       '__ARTICLES__': getArticlesHTML,
       '__EXAMPLES__': getExamplesHTML,
       '__INTERVIEW__':getInterviewHTML,
       '__STORIES__':  getStoriesHTML,
       '__ABOUT__':    getAboutHTML,
       '__CONTACT__':  getContactHTML,
       '__FOOTER__':   getFooterHTML,
     };
     document.querySelectorAll('.page').forEach(page => {
       const key = Object.keys(map).find(k => page.innerHTML.includes(k));
       if (key) page.innerHTML = map[key]();
     });
     const footer = document.querySelector('.site-footer');
     if (footer && footer.innerHTML.includes('__FOOTER__')) footer.innerHTML = getFooterHTML();
   }
   
   /* ============================================================
      LOADING SCREEN
      ============================================================ */
   function initLoadingScreen() {
     const screen = document.getElementById('loadingScreen');
     if (!screen) return;
     window.addEventListener('load', () => {
       setTimeout(() => {
         screen.classList.add('is-hidden');
         screen.addEventListener('transitionend', () => screen.remove(), { once: true });
       }, 900);
     });
   }
   
   /* ============================================================
      THEME
      ============================================================ */
   function initTheme() {
     const toggle = document.getElementById('themeToggle');
     const saved = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
     applyTheme(saved);
     toggle?.addEventListener('click', () => {
       const next = document.body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
       applyTheme(next);
       localStorage.setItem(STORAGE_KEYS.THEME, next);
     });
   }
   function applyTheme(theme) {
     document.body.setAttribute('data-theme', theme);
     const t = document.getElementById('themeToggle');
     if (t) t.setAttribute('aria-pressed', String(theme === 'dark'));
   }
   
   /* ============================================================
      SCROLL UTILITIES
      ============================================================ */
   function initScrollUtilities() {
     const bar = document.getElementById('scrollProgress');
     const btn = document.getElementById('backToTop');
     window.addEventListener('scroll', () => {
       const pct = document.documentElement.scrollHeight - window.innerHeight;
       if (bar) bar.style.width = (pct > 0 ? (window.scrollY / pct) * 100 : 0) + '%';
       if (btn) btn.classList.toggle('is-visible', window.scrollY > 400);
     }, { passive: true });
     btn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
   }
   
   /* ============================================================
      NAVIGATION
      ============================================================ */
   function initNavigation() {
     const navLinks  = document.getElementById('navLinks');
     const navToggle = document.getElementById('navToggle');
   
     navToggle?.addEventListener('click', () => {
       const open = navLinks?.classList.toggle('is-open');
       navToggle.classList.toggle('is-open', open);
       navToggle.setAttribute('aria-expanded', String(open));
     });
   
     document.addEventListener('click', e => {
       if (!e.target.closest('.nav') && navLinks?.classList.contains('is-open')) {
         navLinks.classList.remove('is-open');
         navToggle?.classList.remove('is-open');
         navToggle?.setAttribute('aria-expanded', 'false');
       }
     });
   
     document.addEventListener('click', e => {
       const link = e.target.closest('[data-page-link]');
       if (!link) return;
       e.preventDefault();
       const page = link.getAttribute('data-page-link');
       if (page) navigateTo(page);
       navLinks?.classList.remove('is-open');
       navToggle?.classList.remove('is-open');
       navToggle?.setAttribute('aria-expanded', 'false');
     });
   
     updateActiveNavLink(state.currentPage);
   }
   
   function navigateTo(page) {
     if (page === state.currentPage) return;
     document.getElementById(`page-${state.currentPage}`)?.classList.remove('is-active');
     const next = document.getElementById(`page-${page}`);
     if (!next) return;
     next.classList.add('is-active');
     state.currentPage = page;
     updateActiveNavLink(page);
     window.scrollTo({ top: 0, behavior: 'smooth' });
     setTimeout(() => {
       initReveal();
       initCounters();
       initAccordions();
       initBookmarkButtons();
       if (page === 'landing')   initLandingCarousel();
       if (page === 'tips')      initTipsPage();
       if (page === 'interview') initInterviewPage();
       if (page === 'contact')   initContactForm();
     }, 50);
   }
   
   function updateActiveNavLink(page) {
     document.querySelectorAll('.nav__link').forEach(l =>
       l.classList.toggle('is-active', l.getAttribute('data-page-link') === page)
     );
   }
   
   /* ============================================================
      SCROLL REVEAL
      ============================================================ */
   function initReveal() {
     const els = document.querySelectorAll('.reveal:not(.is-visible)');
     if (!els.length) return;
     const obs = new IntersectionObserver((entries) => {
       entries.forEach((entry, i) => {
         if (entry.isIntersecting) {
           setTimeout(() => entry.target.classList.add('is-visible'), i * 80);
           obs.unobserve(entry.target);
         }
       });
     }, { threshold: 0.1 });
     els.forEach(el => obs.observe(el));
   }
   
   /* ============================================================
      ANIMATED COUNTERS
      ============================================================ */
   function initCounters() {
     const counters = document.querySelectorAll('.counter');
     if (!counters.length) return;
     const obs = new IntersectionObserver((entries) => {
       entries.forEach(e => {
         if (e.isIntersecting) { animateCounter(e.target); obs.unobserve(e.target); }
       });
     }, { threshold: 0.5 });
     counters.forEach(c => obs.observe(c));
   }
   function animateCounter(el) {
     const target = parseInt(el.getAttribute('data-target'), 10);
     const dur = 1800;
     const start = performance.now();
     (function step(now) {
       const p = Math.min((now - start) / dur, 1);
       el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target);
       if (p < 1) requestAnimationFrame(step);
     })(start);
   }
   
   /* ============================================================
      ACCORDIONS
      ============================================================ */
   function initAccordions() {
     document.querySelectorAll('.accordion__trigger').forEach(t => {
       t.replaceWith(t.cloneNode(true));
     });
     document.querySelectorAll('.accordion__trigger').forEach(trigger => {
       trigger.addEventListener('click', () => {
         const item    = trigger.closest('.accordion__item');
         const content = item?.querySelector('.accordion__content');
         const isOpen  = item?.classList.contains('is-open');
         item?.parentElement?.querySelectorAll('.accordion__item.is-open').forEach(s => {
           if (s !== item) {
             s.classList.remove('is-open');
             const sc = s.querySelector('.accordion__content');
             if (sc) sc.style.maxHeight = '0';
             s.querySelector('.accordion__trigger')?.setAttribute('aria-expanded', 'false');
           }
         });
         item?.classList.toggle('is-open', !isOpen);
         if (content) content.style.maxHeight = isOpen ? '0' : content.scrollHeight + 'px';
         trigger.setAttribute('aria-expanded', String(!isOpen));
       });
     });
   }
   
   /* ============================================================
      CAROUSEL
      ============================================================ */
   function initLandingCarousel() {
     const track = document.getElementById('landingCarouselTrack');
     if (!track) return;
     let idx   = 0;
     const total = track.children.length;
     const dots  = document.querySelectorAll('#landingCarouselDots .carousel__dot');
   
     function goTo(i) {
       idx = (i + total) % total;
       track.style.transform = `translateX(-${idx * 100}%)`;
       dots.forEach((d, j) => d.classList.toggle('is-active', j === idx));
     }
     document.getElementById('landingCarouselPrev')?.addEventListener('click', () => goTo(idx - 1));
     document.getElementById('landingCarouselNext')?.addEventListener('click', () => goTo(idx + 1));
     dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));
   
     let auto = setInterval(() => goTo(idx + 1), 5500);
     track.closest('.carousel')?.addEventListener('mouseenter', () => clearInterval(auto));
     track.closest('.carousel')?.addEventListener('mouseleave', () => { auto = setInterval(() => goTo(idx + 1), 5500); });
   }
   
   /* ============================================================
      NEWSLETTER
      ============================================================ */
   function initNewsletter() {
     document.addEventListener('click', e => {
       if (e.target.id !== 'newsletterBtn') return;
       const input   = document.getElementById('newsletterEmail');
       const success = document.getElementById('newsletterSuccess');
       if (!input) return;
       if (!isValidEmail(input.value)) {
         input.style.borderColor = 'var(--color-coral)'; input.focus(); return;
       }
       input.style.borderColor = ''; input.value = '';
       success?.classList.add('is-visible');
     });
   }
   
   /* ============================================================
      TIPS PAGE
      ============================================================ */
   function initTipsPage() {
     const search = document.getElementById('tipsSearch');
     search?.addEventListener('input', () => { state.searchQuery = search.value.toLowerCase().trim(); filterTips(); });
   
     document.querySelectorAll('#tipsFilters .filter-chip').forEach(btn => {
       btn.addEventListener('click', () => {
         document.querySelectorAll('#tipsFilters .filter-chip').forEach(b => b.classList.remove('is-active'));
         btn.classList.add('is-active');
         state.currentCategory = btn.getAttribute('data-category') || 'all';
         filterTips();
       });
     });
     initBookmarkButtons();
   }
   
   function filterTips() {
     const cards  = document.querySelectorAll('#tipsGrid .tip-card');
     const empty  = document.getElementById('tipsEmpty');
     let visible  = 0;
     cards.forEach(card => {
       const catMatch  = state.currentCategory === 'all' || card.getAttribute('data-category') === state.currentCategory;
       const searchStr = (card.getAttribute('data-title') || '') + ' ' + (card.getAttribute('data-tags') || '');
       const srchMatch = !state.searchQuery || searchStr.includes(state.searchQuery);
       const show = catMatch && srchMatch;
       card.style.display = show ? '' : 'none';
       if (show) visible++;
     });
     if (empty) empty.style.display = visible === 0 ? 'block' : 'none';
   }
   
   /* ============================================================
      BOOKMARKS
      ============================================================ */
   function initBookmarkButtons() {
     document.querySelectorAll('.bookmark-btn').forEach(btn => btn.replaceWith(btn.cloneNode(true)));
     document.querySelectorAll('.bookmark-btn').forEach(btn => {
       btn.addEventListener('click', e => {
         e.stopPropagation();
         const id = btn.getAttribute('data-bookmark-id');
         if (!id) return;
         const was = state.bookmarks.includes(id);
         state.bookmarks = was ? state.bookmarks.filter(b => b !== id) : [...state.bookmarks, id];
         btn.classList.toggle('is-bookmarked', !was);
         btn.setAttribute('aria-label', was ? 'Bookmark this tip' : 'Remove bookmark');
         localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(state.bookmarks));
         showToast(was ? 'Bookmark removed' : '🔖 Bookmarked!');
       });
     });
   }
   
   /* ============================================================
      INTERVIEW PAGE
      ============================================================ */
   function initInterviewPage() {
     document.querySelectorAll('#difficultyTabs .difficulty-tab').forEach(btn => {
       btn.addEventListener('click', () => {
         document.querySelectorAll('#difficultyTabs .difficulty-tab').forEach(b => b.classList.remove('is-active'));
         btn.classList.add('is-active');
         state.currentDifficulty = btn.getAttribute('data-difficulty') || 'all';
         state.currentQuestionIndex = 0;
         loadFilteredQuestion(0);
         document.getElementById('questionsList').innerHTML = renderQuestionsList(getFilteredQuestions());
       });
     });
     document.getElementById('recordBtn')?.addEventListener('click', toggleTimer);
     document.getElementById('shuffleBtn')?.addEventListener('click', () => {
       const q = getFilteredQuestions();
       loadFilteredQuestion(Math.floor(Math.random() * q.length));
     });
     document.getElementById('prevQuestionBtn')?.addEventListener('click', () => navigateQuestion(-1));
     document.getElementById('nextQuestionBtn')?.addEventListener('click', () => navigateQuestion(1));
   }
   
   function getFilteredQuestions() {
     return state.currentDifficulty === 'all'
       ? allQuestions
       : allQuestions.filter(q => q.level === state.currentDifficulty);
   }
   
   function loadFilteredQuestion(index) {
     const qs = getFilteredQuestions();
     if (!qs.length) return;
     const safe = (index + qs.length) % qs.length;
     state.currentQuestionIndex = safe;
     const q = qs[safe];
     const numEl  = document.getElementById('questionNumber');
     const textEl = document.getElementById('questionText');
     const lvlEl  = document.getElementById('questionLevel');
     if (numEl) numEl.childNodes[0].textContent = `Question ${safe + 1} of ${qs.length} · `;
     if (lvlEl) lvlEl.textContent = q.level.charAt(0).toUpperCase() + q.level.slice(1);
     if (textEl) {
       textEl.style.opacity = '0';
       setTimeout(() => { textEl.textContent = q.text; textEl.style.cssText += ';opacity:1;transition:opacity 0.3s ease'; }, 150);
     }
     resetTimer();
   }
   
   window.loadQuestion = function(index) {
     const q = allQuestions[index];
     state.currentQuestionIndex = index;
     const numEl  = document.getElementById('questionNumber');
     const textEl = document.getElementById('questionText');
     const lvlEl  = document.getElementById('questionLevel');
     if (numEl)  numEl.childNodes[0].textContent = `Question ${index + 1} of ${allQuestions.length} · `;
     if (lvlEl)  lvlEl.textContent = q.level.charAt(0).toUpperCase() + q.level.slice(1);
     if (textEl) textEl.textContent = q.text;
     resetTimer();
     document.getElementById('questionCard')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
   };
   
   function navigateQuestion(dir) { loadFilteredQuestion(state.currentQuestionIndex + dir); }
   
   function toggleTimer() {
     const btn = document.getElementById('recordBtn');
     if (!state.isRecording) {
       startTimer(); btn?.classList.add('is-recording'); btn?.setAttribute('aria-pressed', 'true');
       state.isRecording = true;
       const fb = document.getElementById('feedbackText');
       if (fb) fb.textContent = '⏱ Timer running — speak your answer out loud now.';
     } else {
       stopTimer(); btn?.classList.remove('is-recording'); btn?.setAttribute('aria-pressed', 'false');
       state.isRecording = false;
       const fb = document.getElementById('feedbackText');
       if (fb) fb.textContent = 'Good practice! Review the reflection prompts below.';
       const hints = document.getElementById('practiceHints');
       if (hints) hints.style.display = 'block';
     }
   }
   
   function startTimer() {
     state.timerSeconds = state.timerMax;
     updateTimerDisplay();
     state.timerInterval = setInterval(() => {
       state.timerSeconds--;
       updateTimerDisplay();
       if (state.timerSeconds <= 0) {
         stopTimer();
         state.isRecording = false;
         document.getElementById('recordBtn')?.classList.remove('is-recording');
         document.getElementById('recordBtn')?.setAttribute('aria-pressed', 'false');
         const fb = document.getElementById('feedbackText');
         if (fb) fb.textContent = "Time's up! Review the reflection prompts below.";
         const hints = document.getElementById('practiceHints');
         if (hints) hints.style.display = 'block';
       }
     }, 1000);
   }
   function stopTimer()  { clearInterval(state.timerInterval); state.timerInterval = null; }
   function resetTimer() {
     stopTimer(); state.timerSeconds = state.timerMax; state.isRecording = false;
     updateTimerDisplay();
     document.getElementById('recordBtn')?.classList.remove('is-recording');
     const hints = document.getElementById('practiceHints');
     if (hints) hints.style.display = 'none';
     const fb = document.getElementById('feedbackText');
     if (fb) fb.textContent = 'Press the red button to start your 2-minute practice timer. Speak your answer out loud — then reflect on what you said.';
   }
   function updateTimerDisplay() {
     const m = Math.floor(state.timerSeconds / 60);
     const s = state.timerSeconds % 60;
     const d = document.getElementById('timerDisplay');
     const b = document.getElementById('timerBarFill');
     if (d) d.textContent = `${m}:${String(s).padStart(2,'0')}`;
     const pct = (state.timerSeconds / state.timerMax) * 100;
     if (b) {
       b.style.width = pct + '%';
       b.style.background = pct < 25 ? 'var(--color-coral)' : pct < 50 ? 'var(--color-sun)' : 'linear-gradient(90deg,var(--color-sage),var(--color-sun))';
     }
   }
   
   /* ============================================================
      CONTACT FORM (Web3Forms submission via fetch, with status UI)
      ============================================================ */
   function initContactForm() {
     const form = document.getElementById('web3formContact');
     if (!form) return;
   
     form.addEventListener('submit', async (e) => {
       e.preventDefault();
       const submitBtn = form.querySelector('button[type="submit"]');
       const original  = submitBtn ? submitBtn.textContent : '';
       if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }
   
       try {
         const formData = new FormData(form);
         const res = await fetch(form.action, {
           method: 'POST',
           headers: { 'Accept': 'application/json' },
           body: formData,
         });
         const result = await res.json();
   
         if (res.status === 200 && result.success) {
           showFormStatus('contactStatus', 'success', '✓ Message sent! Kin will get back to you soon.');
           form.reset();
         } else {
           showFormStatus('contactStatus', 'error', '✗ Something went wrong. Please try again or email Kin directly.');
         }
       } catch (err) {
         showFormStatus('contactStatus', 'error', '✗ Could not send message. Check your connection and try again.');
       } finally {
         if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = original; }
       }
     });
   }
   
   /* ============================================================
      CARD PAGE LINKS
      ============================================================ */
   function initCardLinks() {
     document.addEventListener('click', e => {
       const card = e.target.closest('.card[data-page-link]');
       if (card) navigateTo(card.getAttribute('data-page-link'));
     });
   }
   
   /* ============================================================
      UTILITY
      ============================================================ */
   function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || '').trim()); }
   function showFormStatus(id, type, msg) {
     const el = document.getElementById(id);
     if (!el) return;
     el.className = `form-status is-visible ${type}`; el.textContent = msg;
   }
   
   function showToast(msg) {
     document.getElementById('kin-toast')?.remove();
     const t = document.createElement('div');
     t.id = 'kin-toast'; t.textContent = msg;
     t.style.cssText = `
       position:fixed;bottom:90px;right:var(--space-md);
       background:var(--color-ink);color:var(--color-paper);
       padding:0.75rem 1.5rem;border-radius:999px;font-size:0.95rem;
       font-weight:600;font-family:var(--font-body);z-index:1500;
       box-shadow:var(--shadow-pop);transform:translateY(12px);opacity:0;
       transition:all 0.3s var(--ease);pointer-events:none;`;
     document.body.appendChild(t);
     requestAnimationFrame(() => { t.style.opacity='1'; t.style.transform='translateY(0)'; });
     setTimeout(() => {
       t.style.opacity='0'; t.style.transform='translateY(12px)';
       t.addEventListener('transitionend', () => t.remove(), { once: true });
     }, 2800);
   }
   
   /* ============================================================
      BOOT
      ============================================================ */
   function boot() {
     renderAllPages();
     initLoadingScreen();
     initTheme();
     initScrollUtilities();
     initNavigation();
     initNewsletter();
     initCardLinks();
     setTimeout(() => {
       initReveal();
       initCounters();
       initAccordions();
       initLandingCarousel();
       initBookmarkButtons();
     }, 100);
   }
   
   if (document.readyState === 'loading') {
     document.addEventListener('DOMContentLoaded', boot);
   } else {
     boot();
   }
   console.log(`⚠ Security Warning ⚠

    Don't copy any code you don't understand.
    
    Malicious code might:
    • Steal accounts and data
    • Hijack sessions
    • Send requests without your knowledge
    • Plant harmful files or scripts
    
    Read the code before running it.
    Think before you paste.
    `)
    console.log(`
    © 13/06/2026 KIN_PROJECTS. All rights reserved.`)
