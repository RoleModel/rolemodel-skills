# RoleModel Skills
This contain's the set of RoleModel's agentic skills.

## Installation
You can use git submodules to automatically pull this repository into your:

```bash
git submodule add https://github.com/rolemodel/rolemodel-skills.git .github/rolemodel-skills
git submodule update --init --recursive
```

You'll need to update the VS Code settings to look at the custom skills directory.
`/.vscode/settings.json`:
```json
{
  "chat.agentSkillsLocations": {
    ".github/rolemodel-skills/skills": true
  }
}
```

## Updating
Anytime you want to pull in the latest changes just update the submodule:
```bash
git submodule update --init --recursive
```
