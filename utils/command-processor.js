import { CV_DATA } from "./cv-data"

export async function commandProcessor(command) {
  // Split the command into parts
  const parts = command.toLowerCase().trim().split(/\s+/)
  const mainCommand = parts[0]
  const args = parts.slice(1)

  switch (mainCommand) {
    case "ls":
    case "help":
      return `
Available commands:

ls                  - Show this commands list
help                - Same as ls
about               - Display basic information about me
clear, cls          - Clear the terminal
education           - Show my educational background
skills              - List my technical skills
projects            - List all my projects
project [name]      - Show details about a specific project
contact             - Display contact information
cv                  - Show my CV (opens Google Drive)
social              - Show social media links
github              - Open my GitHub profile
linkedin            - Open my LinkedIn profile
leetcode            - Open my LeetCode profile
instagram           - Open my Instagram profile

[TIP] Use Tab for command completion and Up/Down arrows to navigate command history.
`

    case "clear":
    case "cls":
      return "CLEAR_TERMINAL"

    case "about":
      return `
${CV_DATA.name}
${CV_DATA.objective}

I'm a ${CV_DATA.title} focused on building secure, scalable systems.
${CV_DATA.summary}

Type 'skills', 'education', or 'projects' to learn more about me.
`

    case "education":
      return CV_DATA.education
        .map(
          (edu) => `${edu.degree}
${edu.institution} | ${edu.score}
${edu.year}
`,
        )
        .join("\n")

    case "skills":
      return `
Technical Skills:

Backend & Development:
${CV_DATA.skills.backend.join(", ")}

Frontend Technologies:
${CV_DATA.skills.frontend.join(", ")}

Programming Languages:
${CV_DATA.skills.languages.join(", ")}

Coursework:
${CV_DATA.skills.coursework.join(", ")}

Languages Spoken:
${CV_DATA.skills.spoken.join(", ")}
`

    case "projects":
      return `
My Projects:
${CV_DATA.projects
  .map(
    (project, index) => `
${index + 1}. ${project.name} - ${project.shortDescription}
 Tech: ${project.technologies}
 Link: <a href="${project.link}" target="_blank" class="text-green-500 hover:underline">${project.link}</a>
`,
  )
  .join("")}

For more details on a specific project, type 'project [name]'
Example: project ciphertalk
`

    case "project":
      if (args.length === 0) {
        return "Please specify a project name. Example: 'project ciphertalk'"
      }

      const projectName = args.join(" ")
      const project = CV_DATA.projects.find(
        (p) => p.name.toLowerCase().includes(projectName) || p.id.toLowerCase() === projectName,
      )

      if (!project) {
        return `Project '${projectName}' not found. Type 'projects' to see all projects.`
      }

      return `
Project: ${project.name}

${project.description}

Technologies: ${project.technologies}

GitHub: <a href="${project.link}" target="_blank" class="text-green-500 hover:underline">${project.link}</a>
`

    case "contact":
      return `
Contact Information:

Email: ${CV_DATA.email}
Phone: ${CV_DATA.phone}

Social:
- GitHub: ${CV_DATA.social.github}
- LinkedIn: ${CV_DATA.social.linkedin}
- LeetCode: ${CV_DATA.social.leetcode}
- Instagram: ${CV_DATA.social.instagram}
`

    case "cv":
      window.open(CV_DATA.cvUrl, "_blank")
      return "Opening CV in Google Drive..."

    case "social":
      return `
Social Media Profiles:

GitHub: <a href="${CV_DATA.social.githubUrl}" target="_blank" class="text-green-500 hover:underline">${CV_DATA.social.github}</a>
LinkedIn: <a href="${CV_DATA.social.linkedinUrl}" target="_blank" class="text-green-500 hover:underline">${CV_DATA.social.linkedin}</a>
LeetCode: <a href="${CV_DATA.social.leetcodeUrl}" target="_blank" class="text-green-500 hover:underline">${CV_DATA.social.leetcode}</a>
Instagram: <a href="${CV_DATA.social.instagramUrl}" target="_blank" class="text-green-500 hover:underline">${CV_DATA.social.instagram}</a>

Type 'github', 'linkedin', 'leetcode', or 'instagram' to open the respective profile.
`

    case "github":
      window.open(CV_DATA.social.githubUrl, "_blank")
      return "Opening GitHub profile..."

    case "linkedin":
      window.open(CV_DATA.social.linkedinUrl, "_blank")
      return "Opening LinkedIn profile..."

    case "leetcode":
      window.open(CV_DATA.social.leetcodeUrl, "_blank")
      return "Opening LeetCode profile..."

    case "instagram":
      window.open(CV_DATA.social.instagramUrl, "_blank")
      return "Opening Instagram profile..."

    case "sudo":
      if (args[0] === "getName") {
        return `${CV_DATA.name}`
      } else if (args[0] === "getEmail") {
        return `${CV_DATA.email}`
      } else if (args[0] === "getPhone") {
        return `${CV_DATA.phone}`
      } else if (args[0] === "getLocation") {
        return `${CV_DATA.location}`
      } else if (args[0] === "getSkills") {
        return `Programming Languages: ${CV_DATA.skills.languages.join(", ")}`
      } else if (args[0] === "getProjects") {
        return CV_DATA.projects.map((p) => p.name).join(", ")
      } else if (args[0] === "getEducation") {
        return CV_DATA.education[0].institution
      } else {
        return `sudo: command not found: ${args[0]}`
      }

    default:
      return `Command not found: ${command}. Type 'ls' to see available commands.`
  }
}

