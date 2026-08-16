export const personalInfo = {
  name: "Fatima de la Iglesia",
  title: "Junior Web Developer",
  location: "Rugby, UK — open to remote positions",
  email: "fatimaiglesiav@gmail.com",
  phone: "+44 7837 275235",
  github: "https://github.com/FatimadelaIglesia",
  resumeUrl: "/Fatima-de-la-Iglesia-Resume.pdf",
  bio: "I'm a Junior Web Developer with a strong passion for creating engaging, user-friendly, and functional digital experiences. Through my training and personal projects, I've developed skills in HTML, CSS, JavaScript, and modern technologies such as React, Node.js, and databases. I enjoy solving problems through code and enhancing user experiences by focusing on performance, usability, and accessibility.",
  goal: "My goal is to keep growing within a dynamic team where I can apply my knowledge and contribute to innovative projects. While I'm particularly drawn to front-end development, I'm also eager to expand my expertise in back-end and full-stack development.",
};

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export const skills = {
  "Front-End Development": ["HTML", "CSS", "JavaScript", "React.js", "Responsive Design"],
  "Languages & Tools": ["Python", "Git & GitHub", "VS Code", "Accessibility (a11y)"],
};

export const spokenLanguages = ["English", "Spanish", "French", "Italian"];

export const education = {
  school: "She Codes",
  program: "Junior Front-End Developer",
  period: "2024 – 2026",
};

export type Project = {
  title: string;
  description: string;
  tech: string[];
  repoUrl: string;
  liveUrl?: string;
};

export const projects: Project[] = [
  {
    title: "Weather App",
    description:
      "A React weather application that fetches live forecast data from a public weather API, letting users search any city and view current conditions at a glance.",
    tech: ["React", "JavaScript", "REST API"],
    repoUrl: "https://github.com/FatimadelaIglesia/fatimareact-weather-app",
  },
  {
    title: "Seville Travel Guide",
    description:
      "A fully responsive, multi-page travel guide showcasing Seville, Spain, hand-built with semantic HTML and Flexbox/Grid layouts that adapt smoothly from mobile to desktop.",
    tech: ["HTML", "CSS", "Responsive Design"],
    repoUrl: "https://github.com/FatimadelaIglesia/Fatimasevillaresponsive",
  },
  {
    title: "Spanish Poem Generator",
    description:
      "An interactive JavaScript app that generates random Spanish poetry by combining word banks and sentence templates, built around DOM manipulation and array methods.",
    tech: ["JavaScript", "HTML", "CSS"],
    repoUrl: "https://github.com/FatimadelaIglesia/spanish-poem-generator",
  },
  {
    title: "World Clock",
    description:
      "A JavaScript world clock that displays live local time across multiple international time zones, updating in real time for at-a-glance comparisons.",
    tech: ["JavaScript", "HTML", "CSS"],
    repoUrl: "https://github.com/FatimadelaIglesia/World-clock",
  },
  {
    title: "React Component Playground",
    description:
      "A hands-on React sandbox used to explore component composition, props, and state while building reusable UI pieces.",
    tech: ["React", "JavaScript"],
    repoUrl: "https://github.com/FatimadelaIglesia/reactengine",
    liveUrl: "https://codesandbox.io/p/github/FatimadelaIglesia/reactengine",
  },
];
