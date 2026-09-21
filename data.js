const SAIT_DATA = {
  socials: {
    linkedin: "https://in.linkedin.com/company/students-association-of-information-technology-sait-cusat",
    official: "https://soe.cusat.ac.in/soe_association.php?c=it",
    currentSite: "https://sait-opal.vercel.app/",
    github: "https://github.com/YOUR-USERNAME/sait-website-redesign",
    instagram: "https://www.instagram.com/"
  },

  stats: [
    { value: 1995, suffix: "", label: "IT Department established" },
    { value: 24, suffix: "+", label: "student-led initiatives / sample" },
    { value: 18, suffix: "+", label: "events & workshops / sample" },
    { value: 7, suffix: "", label: "active creative teams / sample" }
  ],

  people: [
    {
      id: "p01", type: "official", role: "PRESIDENT · SAMPLE",
      name: "Aarav Menon", team: "Executive Committee",
      bio: "Coordinates the student community and turns ideas into programmes.",
      photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=85",
      link: "#"
    },
    {
      id: "p02", type: "official", role: "VICE PRESIDENT · SAMPLE",
      name: "Ishita Nair", team: "Executive Committee",
      bio: "Connects teams, partners and students across SAIT initiatives.",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=85",
      link: "#"
    },
    {
      id: "p03", type: "faculty", role: "FACULTY · SAMPLE",
      name: "Dr. Meera Krishnan", team: "Faculty & Administration",
      bio: "Mentorship, academic direction and support for student initiatives.",
      photo: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=85",
      link: "#"
    },
    {
      id: "p04", type: "faculty", role: "FACULTY · SAMPLE",
      name: "Dr. Rahul Varma", team: "Faculty & Administration",
      bio: "Guidance for technical learning, research and project work.",
      photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=85",
      link: "#"
    },
    {
      id: "p05", type: "student", role: "TECH LEAD · SAMPLE",
      name: "Nihal Joseph", team: "Tech Team",
      bio: "Builds web, automation and experimental prototypes.",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=85",
      link: "#"
    },
    {
      id: "p06", type: "student", role: "MEDIA LEAD · SAMPLE",
      name: "Ananya Paul", team: "Media Team",
      bio: "Shapes the visual identity of events, stories and campaigns.",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=85",
      link: "#"
    }
  ],

  teams: [
    { name: "TECH", code: "01", detail: "Web · AI · Systems · Labs", tone: "lime" },
    { name: "MEDIA", code: "02", detail: "Design · Video · Visuals", tone: "violet" },
    { name: "EVENTS", code: "03", detail: "Planning · Logistics · Experience", tone: "orange" },
    { name: "PR", code: "04", detail: "Outreach · Partnerships · Community", tone: "cyan" },
    { name: "CONTENT", code: "05", detail: "Editorial · Magazine · Stories", tone: "pink" }
  ],

  events: [
    {
      id: "e01", category: "TECH",
      date: "18 OCT 2026", time: "10:00 AM", venue: "IT Seminar Hall",
      title: "Code / Build / Ship",
      desc: "A practical front-end sprint where teams prototype, test and publish a small product in one day.",
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=85",
      status: "REGISTRATION OPEN",
      featured: true
    },
    {
      id: "e02", category: "DESIGN",
      date: "26 OCT 2026", time: "2:00 PM", venue: "CAD Lab",
      title: "Interface After Dark",
      desc: "An evening UI/UX studio exploring layouts, motion, type and design systems.",
      image: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1000&q=85",
      status: "COMING SOON"
    },
    {
      id: "e03", category: "COMMUNITY",
      date: "02 NOV 2026", time: "4:00 PM", venue: "Main Auditorium",
      title: "Alumni Frequency",
      desc: "A conversational alumni meet about first jobs, career pivots, projects and the realities of the tech world.",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=85",
      status: "SAVE THE DATE"
    },
    {
      id: "e04", category: "AI",
      date: "14 NOV 2026", time: "11:30 AM", venue: "AI Lab",
      title: "Model to Market",
      desc: "An introduction to taking an ML prototype from notebook to a useful student-facing product.",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1000&q=85",
      status: "COMING SOON"
    },
    {
      id: "e05", category: "MEDIA",
      date: "21 NOV 2026", time: "3:00 PM", venue: "Media Room",
      title: "SAIT Open Studio",
      desc: "A creative session for posters, motion graphics, event photography and social storytelling.",
      image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=85",
      status: "COMING SOON"
    },
    {
      id: "e06", category: "COMMUNITY",
      date: "05 DEC 2026", time: "5:30 PM", venue: "SOE Courtyard",
      title: "Night of Ideas",
      desc: "Lightning talks, demos and a show-and-tell evening built around student projects.",
      image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1000&q=85",
      status: "COMING SOON"
    }
  ],

  alumni: [
    {
      batch: "2020", name: "Rhea Thomas", role: "Product Designer · Sample",
      quote: "SAIT taught me how to explain an idea before I tried to perfect it.",
      photo: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=900&q=85",
      highlight: "Design · Product"
    },
    {
      batch: "2021", name: "Adil Rahman", role: "Software Engineer · Sample",
      quote: "The most useful projects were the ones we built because we were curious.",
      photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&q=85",
      highlight: "Engineering · Cloud"
    },
    {
      batch: "2022", name: "Keerthi S.", role: "Data Analyst · Sample",
      quote: "The people I met through events stayed useful long after the semester ended.",
      photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=85",
      highlight: "Data · Analytics"
    }
  ],

  hall: [
    { year: "2026", tag: "HACKATHON", title: "Campus product prototype — sample", meta: "Student team · 1st place / sample" },
    { year: "2025", tag: "PAPER", title: "Human-centred interface study — sample", meta: "Student publication / sample" },
    { year: "2025", tag: "TECH", title: "Open-source utility for students — sample", meta: "Community project / sample" },
    { year: "2024", tag: "ACADEMIC", title: "Department-level innovation showcase — sample", meta: "Exhibition / sample" },
    { year: "2024", tag: "DESIGN", title: "Student magazine visual system — sample", meta: "Editorial / sample" }
  ],

  notifications: [
    { date: "08 SEP 2026", tag: "EVENT", title: "Code / Build / Ship registrations open", body: "Reserve a spot for the one-day front-end sprint.", new: true },
    { date: "05 SEP 2026", tag: "CAREERS", title: "Placement resource hub refreshed", body: "Interview checklists, CV resources and preparation links are now organised in one place.", new: true },
    { date: "31 AUG 2026", tag: "ACADEMIC", title: "Notes vault updated", body: "New sample resources have been added to the academic resources page.", new: false },
    { date: "22 AUG 2026", tag: "SAIT", title: "Student activity logger is live", body: "Log your events and project participation from the new activity dashboard.", new: false },
    { date: "18 AUG 2026", tag: "COMMUNITY", title: "Alumni Frequency announced", body: "Save the date for an informal alumni conversation and open Q&A.", new: false }
  ]
};