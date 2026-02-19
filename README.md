# RoleModel Skills
This contains the set of RoleModel's agentic skills.

## Installation
You can use https://skills.sh/ to automatically pull these skills into your repository:

```bash
npx skills add RoleModel/rolemodel-skills
```

You'll need to update the VS Code settings to look at the skills directory.
`/.vscode/settings.json`:
```json
{
  "chat.agentSkillsLocations": {
    ".github/skills": true
  }
}
```

## Updating
Anytime you want to pull in the latest changes just run the skills update command:
```bash
npx skills update
```
