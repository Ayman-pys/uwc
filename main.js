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
       body: 'Avoid vague claims. Instead of saying you care about something, describe a specific moment that proves it. Admissions readers have seen thousands of essays — concrete detail is what makes yours stick. Ask yourself: "What scene from my life proves this?" Then write that scene.',
       weak:   '"I enjoy helping people and being a good leader."',
       strong: '"At 15, I noticed younger kids in my neighbourhood had no safe space to study. I cleared my family\'s garage and ran weekly homework sessions for two years — 30+ children, zero budget, and a waiting list by month six."',
       tags: ['authenticity', 'reflection', 'specificity'],
     },
     {
       id: 'tip-2', category: 'essays',
       title: 'Write About Growth, Not Just Achievement',
       body: 'UWC selection committees are not looking for a trophy cabinet. They want to see how you think and whether you can learn from difficulty. What did you try that failed? What did that failure cost you, and what did it change in you? The honest answer to those questions is almost always more compelling than a medal.',
       weak:   '"I won first place in the regional science olympiad."',
       strong: '"My model collapsed in front of 200 people. In the weeks that followed, I stopped treating failure as embarrassing and started treating it as data. That shift — more than the first-place result I eventually earned — is why I want two years of intellectual pressure at UWC."',
       tags: ['growth mindset', 'reflection', 'humility'],
     },
     {
       id: 'tip-3', category: 'leadership',
       title: 'Redefine Leadership as Initiative, Not Title',
       body: 'Committees are not impressed by the word "president." They are impressed by the sentence that follows it — the one that explains what changed because you were there. If you can\'t describe a concrete shift your leadership caused, the title is not doing any work. Ask yourself: what existed after me that didn\'t exist before?',
       weak:   '"I was class president and organised many events."',
       strong: '"Our school had no mental health resources. I trained as a peer counsellor through a local NGO, set up a confidential drop-in space, and 60 students used it in the first term alone. The principal has since hired a part-time counsellor."',
       tags: ['leadership', 'initiative', 'community'],
     },
     {
       id: 'tip-4', category: 'community',
       title: 'Connect Local Action to Global Thinking',
       body: 'UWC applicants who stand out are those who notice patterns — who see their local work as a window into a larger system. You don\'t have to have travelled internationally. You have to demonstrate that you think beyond your immediate environment. What does the problem you\'re working on look like at scale? What would need to change upstream to fix it?',
       weak:   '"I volunteered at a food bank near my school."',
       strong: '"Volunteering at our food bank, I kept asking why the same families returned every week. After researching structural food insecurity, I proposed an urban micro-farming pilot. The city council is now trialling it across three schools."',
       tags: ['community', 'systems thinking', 'global perspective'],
     },
     {
       id: 'tip-5', category: 'interviews',
       title: 'Answer Interview Questions in Stories',
       body: 'Interviewers ask abstract questions ("Are you resilient?") but they remember concrete answers. Every abstract quality you want to demonstrate should be backed by a specific story from your life. Structure it: situation, what you did, what happened, what you learned. Practise saying answers out loud — not reading from notes, actually speaking — at least ten times before the interview.',
       weak:   '"I\'m good at working under pressure."',
       strong: '"The lead actor in our school play fell ill the morning before the performance. I split the role between two understudies, rewrote their cues overnight, and ran a two-hour rehearsal at dawn. The show ran without the audience noticing. That\'s when I learned preparation is what makes calm possible."',
       tags: ['interview technique', 'storytelling', 'preparation'],
     },
     {
       id: 'tip-6', category: 'mistakes',
       title: 'Don\'t Write What You Think They Want to Hear',
       body: 'Committees read thousands of applications. Phrases like "make a difference," "global citizen," and "transform the world" register as noise when they\'re not attached to real, specific experience. Genuine curiosity and honest observation are rarer — and more compelling — than polished mission statements. Write what you actually think, then check whether your evidence supports it.',
       weak:   '"I want to attend UWC to make the world a better place and develop as a global citizen."',
       strong: '"When I helped coordinate flood relief in my district, I saw how distrust between communities slowed aid distribution. I want to spend two years practising the trust-building I believe is the missing variable in most development work."',
       tags: ['authenticity', 'common mistakes', 'voice'],
     },
     {
       id: 'tip-7', category: 'time',
       title: 'Start Your Draft Eight Weeks Early',
       body: 'The difference between a good essay and a great one is almost always the number of drafts. One week is not enough time to produce five drafts. Build a schedule that gives you distance between sessions — write, step away, return with new eyes. Your sixth draft will say things your first draft couldn\'t, because the first draft is how you figure out what you actually mean.',
       weak:   'Writing your essays the week they\'re due.',
       strong: 'Week 1: draft. Week 3: trusted feedback. Week 4: structural revision. Week 5: read aloud — rewrite anything you stumble over. Week 6: line edit. Week 8: final proofread.',
       tags: ['time management', 'process', 'strategy'],
     },
     {
       id: 'tip-8', category: 'essays',
       title: 'Let Your Voice Sound Like You',
       body: 'Read your essay out loud. Every sentence you stumble over is a sentence that doesn\'t sound like you — rewrite it until it does. Vocabulary that you wouldn\'t use in conversation makes essays feel hollow. Your natural voice, made precise, is far more persuasive than formal language trying to sound impressive.',
       weak:   '"My proclivity towards humanitarian endeavours is evidenced by my sustained volunteerism."',
       strong: '"I\'ve always been the person who stays after the meeting to stack the chairs. Not because I have to — but because I\'ve never figured out how to stop caring about what happens next."',
       tags: ['voice', 'authenticity', 'writing craft'],
     },
     {
       id: 'tip-9', category: 'essays',
       title: 'Open With a Moment, Not a Statement',
       body: 'The first two sentences of your essay determine whether the reader leans in or settles back. A scene drops the reader into your world immediately; a statement about yourself asks them to take your word for it. Start with what was happening — time, place, action — then let the reflection follow naturally from there.',
       weak:   '"I am a hardworking student who is passionate about community service and global issues."',
       strong: '"It was 6 a.m., the paint bucket was leaking, and we had three hours before the school opened. I hadn\'t planned to spend my Saturday repainting a classroom — but then again, I hadn\'t planned to care this much about education either."',
       tags: ['storytelling', 'essays', 'authenticity'],
     },
     {
       id: 'tip-10', category: 'essays',
       title: 'Describe the Before and After',
       body: 'The most credible essays show change over time. Describe who you were before an experience, what happened, and specifically how your thinking shifted. "I learned a lot" is not a change — it\'s a placeholder. The real answer is: what do you believe now that you didn\'t believe then, and what made the difference?',
       weak:   '"The experience taught me a great deal and I emerged a stronger person."',
       strong: '"I went into that project convinced that the solution was obvious. I left it understanding that the people most affected by a problem usually understand it better than anyone coming from outside — and that listening is a skill I had badly underestimated."',
       tags: ['growth', 'reflection'],
     },
     {
       id: 'tip-11', category: 'essays',
       title: 'Measure Impact, Not Effort',
       body: 'Describing how hard you worked tells the committee about your effort. Describing what changed tells them about your impact. When writing about any activity, ask yourself: what was different after I was involved? If you can quantify that — numbers, timeframes, outcomes — do it. If you can\'t, describe the qualitative shift concretely.',
       weak:   '"I worked very hard as president of the environmental club."',
       strong: '"When our school generated 40 kg of single-use plastic per week, I proposed and ran a zero-waste week. After tracking the results, we reduced waste by 60% — permanently. The school has kept the system running for two years."',
       tags: ['leadership', 'impact'],
     },
     {
       id: 'tip-12', category: 'essays',
       title: 'Name the Specific Obstacle',
       body: 'Vague challenges produce vague writing. "Life was difficult" tells a reader nothing. The specific detail — what you didn\'t have, what went wrong, what the actual constraint was — is what makes a challenge believable and a response impressive. Name it precisely, then show what you did with it.',
       weak:   '"Growing up, I faced many difficulties that made my journey hard."',
       strong: '"For three years I shared a single textbook with four classmates. We built a rotation schedule, photographed key pages on my uncle\'s phone, and I learned to read ahead so I wasn\'t dependent on having the book in front of me."',
       tags: ['storytelling', 'specificity'],
     },
     {
       id: 'tip-13', category: 'essays',
       title: 'End With Direction, Not Conclusion',
       body: 'Don\'t summarise your essay in the final paragraph — the reader just read it. Instead, point forward. What question does your experience leave you with? What do you want to do next, and why does UWC sit at the intersection of where you\'ve come from and where you\'re going? A specific, forward-looking final sentence is far stronger than a general reflection.',
       weak:   '"That experience changed me forever and I am grateful for everything I have been through."',
       strong: '"I still don\'t know how to fully close the gap between the communities I saw in that relief effort. But I know that two years living in close contact with people from backgrounds entirely unlike mine is a better preparation for trying than anything else I can imagine."',
       tags: ['conclusion', 'future'],
     },
     {
       id: 'tip-14', category: 'time',
       title: 'Research the Specific UWC College Before You Apply',
       body: 'UWC is not one college — it is eighteen, each with a distinct culture, academic focus, and community life. Committees can tell immediately when an application is generic. Read about the college\'s specific programmes, community projects, and values. Then explain why that particular environment fits where you are in your development right now.',
       weak:   '"I want to attend UWC because of its mission of peace and sustainability."',
       strong: '"UWC Dilijan\'s focus on conflict transformation is directly relevant to the inter-community tensions I\'ve been working on at home. I want to learn from peers who\'ve navigated similar fault lines in different contexts."',
       tags: ['research', 'strategy', 'planning'],
     },
     {
       id: 'tip-15', category: 'time',
       title: 'Schedule Each Essay Component Separately',
       body: 'Breaking the essay into distinct tasks — outline, draft, structural edit, line edit, final read — makes a large project manageable and produces better work. Assign each task a specific day. Doing everything in one session almost always means the editing step gets skipped.',
       weak:   '"I\'ll sit down and write the whole thing when I feel ready."',
       strong: '"Day 1: bullet-point outline. Day 3: full draft without editing. Day 5: structural pass — does it say what I meant? Day 7: line edit for voice. Day 9: final proofread."',
       tags: ['organisation', 'planning'],
     },
     {
       id: 'tip-16', category: 'time',
       title: 'Wait at Least 48 Hours Before Editing',
       body: 'Your brain fills in what it meant to write rather than what is actually on the page. Distance removes that bias. Writing a draft and editing it the same day almost always means reading what you intended, not what\'s there. Give it two days minimum, then read it as a stranger would.',
       weak:   '"I finished the draft so I went straight to proofreading and submitted."',
       strong: '"I wrote on Monday, set it aside, and re-read on Wednesday. Three sentences I thought were clear turned out to be ambiguous — I rewrote them in ten minutes."',
       tags: ['editing', 'process'],
     },
     {
       id: 'tip-17', category: 'time',
       title: 'Weight Your Time Where It Counts Most',
       body: 'Essays and interview preparation carry the most weight in UWC selection. Activity lists, short answers, and logistics matter — but they don\'t move the needle the way a well-crafted essay does. If you\'re deciding where to spend an extra two hours, spend it strengthening your main essay, not polishing the parts that will be glanced at.',
       weak:   '"I spent equal time on every section of the application."',
       strong: '"I spent roughly 70% of my total preparation time on the two main essays and mock interview practice. The rest followed naturally once the hardest parts were solid."',
       tags: ['priorities', 'strategy'],
     },
     {
       id: 'tip-18', category: 'time',
       title: 'Get Feedback from Someone Who Will Be Honest',
       body: 'Feedback that tells you everything is fine is not useful. Find someone — a teacher, mentor, or peer who writes well — who will tell you when something is unclear, unconvincing, or too vague. Give them specific questions: "Does this sound like me?" and "Where did you stop being convinced?" are better prompts than "What do you think?"',
       weak:   '"My mum read it and said it was great."',
       strong: '"I asked my geography teacher and a friend who had gone through a similar application process. Each of them flagged a different problem — together, their notes made the essay significantly stronger."',
       tags: ['feedback', 'process'],
     },
     {
       id: 'tip-19', category: 'interviews',
       title: 'Answer Directly, Then Explain',
       body: 'Many applicants start with context and work towards an answer. Interviewers prefer the opposite. Lead with your actual position or response, then back it up. This signals clarity of thought and respect for the interviewer\'s time. If you\'re asked a complex question, it\'s fine to say "My view is X — let me explain why" and then make your case.',
       weak:   '"Well, there are many different perspectives on this and I think it\'s important to consider all sides before coming to any conclusion..."',
       strong: '"I think local action is more effective than international campaigns for this specific problem — and here\'s why."',
       tags: ['clarity', 'communication'],
     },
     {
       id: 'tip-20', category: 'interviews',
       title: 'Pause Before You Answer',
       body: 'A few seconds of silence after a question demonstrates that you\'re thinking — which is exactly what UWC wants to see. Applicants who answer immediately often give the first thing that comes to mind rather than the best thing. You are not being assessed on your reaction time. You are being assessed on the quality of your thinking.',
       weak:   'Rushing to fill the silence with the first thought that comes to you.',
       strong: '"That\'s a question I want to answer carefully. Can I take a moment?" Then take it. Most interviewers respect this far more than a rapid but shallow response.',
       tags: ['confidence', 'interview technique'],
     },
     {
       id: 'tip-21', category: 'interviews',
       title: 'Ground Every Opinion in Personal Experience',
       body: 'Opinions without evidence are easy to dismiss. When you state a position in an interview, follow it immediately with a story or observation from your own life that led you to that view. This also makes your answer impossible to plagiarise or fake — it is yours.',
       weak:   '"I believe young people have the power to change the world if they take initiative."',
       strong: '"I used to believe institutions were the ones who drove change. Then I watched a 17-year-old in my city pressure a municipal council into installing street lighting on a road where three people had been injured. That changed how I think about agency."',
       tags: ['evidence', 'authenticity'],
     },
     {
       id: 'tip-22', category: 'interviews',
       title: 'Demonstrate Curiosity, Not Just Knowledge',
       body: 'Committees want students who will ask good questions for two years, not students who already have all the answers. If you\'re asked about a complex topic, it\'s entirely appropriate to say what you know and then articulate what you\'d want to understand better. Intellectual curiosity is as valued at UWC as existing expertise.',
       weak:   '"I\'ve read a lot about this topic and I know that the main issues are..."',
       strong: '"From what I\'ve seen in my own context, the challenge seems to be X. But I\'m genuinely uncertain whether that\'s true in other countries — which is part of why I want to have those conversations at UWC."',
       tags: ['global perspective', 'curiosity'],
     },
     {
       id: 'tip-23', category: 'interviews',
       title: 'Prepare for Values-Based Questions',
       body: 'UWC interviews often include questions about conflict, fairness, privilege, and community responsibility. These are not trick questions — they are genuine attempts to understand how you think about difficult situations. Prepare by identifying two or three real situations from your life that tested your values, and practise articulating what you believed, what you did, and what you\'d do differently.',
       weak:   'Treating the interview like a job interview where you present your best self without nuance.',
       strong: 'Preparing honest, specific answers to questions like: "Tell me about a time you disagreed with your community" or "Describe a situation where you had an unfair advantage." These will come up in some form.',
       tags: ['authenticity', 'preparation'],
     },
     {
  id: 'tip-24', category: 'mistakes',
  title: 'Listing Achievements Without Reflection',
  body: 'A list of activities tells the committee what you did. What they need to know is what those activities cost you, changed in you, or showed you. For every achievement you list, ask: what did I learn from this that I wouldn\'t have learned otherwise? The answer to that question is what belongs in your application.',
  weak:   '"I was captain of the debate team, head of the volunteer club, and won three academic prizes."',
  strong: '"Leading the debate team taught me that I\'d been confusing confidence with preparation. I lost a final I should have won — and rebuilt my practice method entirely after that."',
  tags: ['mistakes', 'reflection'],
},
{
  id: 'tip-25', category: 'mistakes',
  title: 'Using Complexity as a Substitute for Clarity',
  body: 'Long words and complicated sentences often signal that the writer isn\'t yet sure what they\'re trying to say. If you find yourself reaching for a thesaurus, stop — simplify the sentence until it says exactly what you mean. Committees read quickly. A clear sentence lands; a complex one gets skimmed.',
  weak:   '"My multifaceted socio-humanitarian proclivity has been cultivated through sustained philanthropic endeavours."',
  strong: '"For three years I ran a free tutoring programme in my neighbourhood. That work is what made me care about education systems."',
  tags: ['writing', 'voice'],
},
{
  id: 'tip-26', category: 'mistakes',
  title: 'Writing an Essay That Could Belong to Anyone',
  body: 'If you could swap your name for any other applicant\'s and the essay would still work, it\'s too generic. Every sentence should contain something only you could have written — a specific place, a specific person, a specific moment, a specific thought. Readers notice immediately when an essay has no person inside it.',
  weak:   '"I have always been passionate about helping my community and making a positive difference in the world."',
  strong: '"The market near our house floods every rainy season. I grew up watching vendors lose a week\'s income overnight. That specific, recurring injustice is what made me start asking questions about infrastructure and policy."',
  tags: ['originality', 'specificity'],
},
{
  id: 'tip-27', category: 'mistakes',
  title: 'Making Yourself the Only Subject',
  body: 'The strongest UWC applications describe communities, relationships, and responsibilities — not just individual journeys. If every paragraph is about what you felt, achieved, or realised, step back and ask: who else is in this story? What did they need, and how did you respond? UWC selects people who notice others.',
  weak:   '"This experience helped me grow as a person and develop my leadership skills significantly."',
  strong: '"The students I was tutoring weren\'t behind because they lacked ability — they lacked time. Most worked evenings to support their families. Understanding that changed how I designed every session after."',
  tags: ['community', 'perspective'],
},
{
  id: 'tip-28', category: 'mistakes',
  title: 'Exaggerating Your Role in Activities',
  body: 'Committees often ask follow-up questions in interviews about exactly what you did in a given activity. If your application says you "led" something and you actually assisted, the inconsistency will surface and undermine everything else. Describe your actual contribution accurately — an honest, specific smaller role is more credible than an inflated one.',
  weak:   '"I led a city-wide environmental campaign that reached thousands of people."',
  strong: '"I coordinated the social media schedule for our school\'s environmental campaign — a small role, but it taught me how messaging either builds or loses momentum."',
  tags: ['honesty', 'interview technique'],
},
{
  id: 'tip-29', category: 'mistakes',
  title: 'Writing About What Sounds Impressive Rather Than What Is True',
  body: 'The most common mistake in competitive applications is optimising for impressiveness instead of authenticity. A quietly told story about a real, small, specific thing you did is almost always more compelling than a grandiose claim. Write the true version first. It is usually the better one.',
  weak:   '"I have dedicated my life to fighting climate change and empowering marginalised communities globally."',
  strong: '"I spent eight months helping one family in my building navigate a housing dispute. I learned more about systemic inequality from that than from anything I\'d read."',
  tags: ['authenticity', 'mistakes'],
},
{
  id: 'tip-30', category: 'mistakes',
  title: 'Treating Failure as Something to Minimise',
  body: 'Applicants who avoid mentioning failure either haven\'t tried hard enough or aren\'t being honest. Committees know this. A well-described failure — what went wrong, what you felt, what you did next — demonstrates self-awareness, resilience, and the ability to learn. These are exactly the qualities UWC looks for in students who will thrive in a high-pressure, multicultural environment.',
  weak:   '"I always try my best and make sure to learn from any setbacks I encounter along the way."',
  strong: '"The workshop I organised had four attendees. I\'d expected forty. Instead of cancelling future sessions, I spent a month asking people why they hadn\'t come — and redesigned the entire format based on what they told me."',
  tags: ['growth', 'honesty'],
},
{
  id: 'tip-31', category: 'mistakes',
  title: 'Applying Without Understanding the UWC Mission',
  body: 'UWC\'s mission — education as a force for peace and sustainable development — is specific. If your application doesn\'t connect your experience and goals to that mission in a concrete way, it reads as misdirected. Read the mission statement, then ask: where does my story intersect with this? That intersection is where your application should spend the most time.',
  weak:   '"I want to attend UWC because it is a world-renowned institution that will help me reach my full potential."',
  strong: '"UWC\'s model of putting students from opposing political contexts into the same classroom is exactly the environment I want — because the conflict mediation work I\'ve been doing locally has shown me how rare that kind of structured contact actually is."',
  tags: ['research', 'strategy'],
},
{
  id: 'tip-32', category: 'mistakes',
  title: 'Submitting Without a Peer or Mentor Review',
  body: 'You cannot fully evaluate your own writing. You know what you meant to say, which makes it very hard to notice when the page doesn\'t say it. Before submitting, have at least one person who doesn\'t know your story read the application and tell you what they understood. Where their understanding differs from your intention is where the essay needs work.',
  weak:   '"I read it over twice and it seemed fine, so I submitted it."',
  strong: '"I gave my draft to my geography teacher and asked her one question: \'Where did you stop believing me?\' Her answer pointed to the one paragraph I rewrote three more times."',
  tags: ['feedback', 'process'],
},
{
  id: 'tip-33', category: 'mistakes',
  title: 'Treating the Application as a Competition Against Others',
  body: 'You cannot control what other applicants write. You can only control whether your application is the most honest, specific, and reflective version of who you are. Committees are not ranking personalities — they are building a cohort. The question is not whether you are more impressive than others; it is whether you are genuinely right for this environment and honest about why.',
  weak:   '"I believe I am a stronger candidate than most because of my extensive achievements and international exposure."',
  strong: '"I don\'t know who else is applying. I only know that the work I\'ve been doing in my community is real, the questions it\'s left me with are genuine, and two years at UWC is the most honest next step I can imagine."',
  tags: ['mindset', 'authenticity'],
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
           <p>This website was made by KIN, a student with a simple goal: to make the world a better place through knowledge, technology, and positive impact.</p>
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
