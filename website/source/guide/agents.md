# Target Agents

Rabto is designed to inject system prompt skills into various Agentic Coding Assistants. Because each assistant has a completely different configuration file hierarchy and capability matrix, Rabto uses **Target Adapters**.

---

## Antigravity
**Status: BETA / VERIFIED SCOPE**

Antigravity is the primary, officially verified target for Rabto. It perfectly supports reading the `SKILL.md` markdown format, parses triggers reliably, and respects the visual browser QA checklists natively.

**Global Scope Path:**
`~/.gemini/config/skills`

**Workspace Scope Path:**
`.agents/skills/` (Inside the active project directory)

---

## Claude Code
**Status: EXPERIMENTAL**

Claude Code utilizes a different system prompt injection strategy (often requiring `.clauderc` or `.anthropic` configurations depending on the environment context). 

> [!WARNING]
> While the installer successfully moves the skills into the Claude directory scope, the agent's ability to consistently trigger and execute the complex WebGL/GSAP requirements natively is not yet verified.

**Scope Path:**
`~/.claude/config/skills`

---

## Gemini CLI
**Status: EXPERIMENTAL**

Similar to Claude Code, the Gemini CLI adapter is marked as experimental. The installer uses strict path containment to safely inject the instructions, but real-world complex rendering tasks may have variable success rates depending on the backend model configuration.

> [!WARNING]
> Integration is strictly experimental. Proceed with caution.

**Scope Path:**
`~/.gemini-cli/skills`
