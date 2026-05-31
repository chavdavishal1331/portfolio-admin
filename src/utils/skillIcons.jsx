import {
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaNodeJs,
  FaGitAlt,
  FaPython,
  FaJava,
} from "react-icons/fa";
import {
  SiMongodb,
  SiExpress,
  SiBootstrap,
  SiTailwindcss,
  SiNextdotjs,
  SiTypescript,
  SiFirebase,
  SiMysql,
} from "react-icons/si";

export const ICON_OPTIONS = [
  { value: "FaHtml5", label: "HTML" },
  { value: "FaCss3Alt", label: "CSS" },
  { value: "FaJs", label: "JavaScript" },
  { value: "FaReact", label: "React" },
  { value: "FaNodeJs", label: "Node.js" },
  { value: "FaGitAlt", label: "Git" },
  { value: "FaPython", label: "Python" },
  { value: "FaJava", label: "Java" },
  { value: "SiMongodb", label: "MongoDB" },
  { value: "SiExpress", label: "Express" },
  { value: "SiBootstrap", label: "Bootstrap" },
  { value: "SiTailwindcss", label: "Tailwind" },
  { value: "SiNextdotjs", label: "Next.js" },
  { value: "SiTypescript", label: "TypeScript" },
  { value: "SiFirebase", label: "Firebase" },
  { value: "SiMysql", label: "MySQL" },
];

const iconMap = {
  FaHtml5: <FaHtml5 />,
  FaCss3Alt: <FaCss3Alt />,
  FaJs: <FaJs />,
  FaReact: <FaReact />,
  FaNodeJs: <FaNodeJs />,
  FaGitAlt: <FaGitAlt />,
  FaPython: <FaPython />,
  FaJava: <FaJava />,
  SiMongodb: <SiMongodb />,
  SiExpress: <SiExpress />,
  SiBootstrap: <SiBootstrap />,
  SiTailwindcss: <SiTailwindcss />,
  SiNextdotjs: <SiNextdotjs />,
  SiTypescript: <SiTypescript />,
  SiFirebase: <SiFirebase />,
  SiMysql: <SiMysql />,
};

export function getSkillIcon(name) {
  return iconMap[name] || <FaJs />;
}
