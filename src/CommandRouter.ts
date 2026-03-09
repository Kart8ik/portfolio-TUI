import { projects } from "../data/ProjectsData.jsx";
import { skills } from "../data/SkillsData.jsx";
import { experience } from "../data/ExperienceData.jsx";

export type CommandResult = {
  title?: string;
  lines: string[];
};

export type CommandResponse =
  | { kind: "clear" }
  | { kind: "output"; result: CommandResult };

type Handler = () => CommandResponse;

const aboutLines = [
  "Shrikarthik",
  "Full-stack developer",
  "CSE student",
  "Bengaluru, India",
  "",
  "I build practical products with clean interfaces and solid backend foundations.",
];

const educationLines = [
  "PES University",
  "B.Tech in Computer Science and Engineering",
  "Bengaluru, India",
  "Status: Ongoing",
];

const galleryLines = [
  "Artwork gallery is being prepared.",
  "For now, project visual snapshots are listed in the projects section.",
];

const contactLines = [
  "GitHub: https://github.com/Kart8ik",
  "Portfolio: https://calpal-app.vercel.app/",
  "Location: Bengaluru, India",
  "Email: add-your-email-here",
];

const titleCase = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

const helpResult = (): CommandResult => ({
  title: "## Available commands",
  lines: [
    "about       learn about me",
    "projects    view my projects",
    "skills      tech stack",
    "experience  work history",
    "education   studies",
    "gallery     artwork",
    "contact     links",
    "clear       clear terminal",
  ],
});

const projectsResult = (): CommandResult => {
  const lines = projects.flatMap(project => {
    const row = [
      `${project.name} | ${project.description}`,
      `  Duration: ${project.duration}`,
      `  Stack: ${project.stack.map(titleCase).join(", ")}`,
      `  GitHub: ${project.github}`,
      project.link ? `  Live: ${project.link}` : "  Live: n/a",
      `  ${project.explanation}`,
      "",
    ];
    return row;
  });

  return {
    title: "Projects",
    lines,
  };
};

const skillsResult = (): CommandResult => {
  const lines = Object.entries(skills).flatMap(([category, values]) => [
    `${category}:`,
    `  ${values.map(titleCase).join(", ")}`,
    "",
  ]);

  return {
    title: "Skills",
    lines,
  };
};

const experienceResult = (): CommandResult => {
  const lines = experience.flatMap(item => {
    const row = [
      `${item.position} @ ${item.company}`,
      `  ${item.duration} | ${item.location}`,
      `  Skills: ${item.skills.map(titleCase).join(", ")}`,
      `  ${item.description}`,
      item.link ? `  Link: ${item.link}` : "  Link: n/a",
      "",
    ];
    return row;
  });

  return {
    title: "Experience",
    lines,
  };
};

const handlers: Record<string, Handler> = {
  help: () => ({ kind: "output", result: helpResult() }),
  about: () => ({ kind: "output", result: { title: "About", lines: aboutLines } }),
  projects: () => ({ kind: "output", result: projectsResult() }),
  skills: () => ({ kind: "output", result: skillsResult() }),
  experience: () => ({ kind: "output", result: experienceResult() }),
  education: () => ({ kind: "output", result: { title: "Education", lines: educationLines } }),
  gallery: () => ({ kind: "output", result: { title: "Gallery", lines: galleryLines } }),
  contact: () => ({ kind: "output", result: { title: "Contact", lines: contactLines } }),
  clear: () => ({ kind: "clear" }),
};

export const routeCommand = (rawCommand: string): CommandResponse => {
  const command = rawCommand.trim().toLowerCase();

  if (!command) {
    return {
      kind: "output",
      result: { lines: [] },
    };
  }

  const handler = handlers[command];

  if (!handler) {
    return {
      kind: "output",
      result: {
        lines: [`Command not found: ${command}`, "Type 'help' to list available commands."],
      },
    };
  }

  return handler();
};
