# Project Rules

- **Universal Git Rule**: Do not push anything to GitHub, and do not execute Git commits/commands, unless specifically and explicitly commanded by the user.
- **Universal Walkthrough Rule**: Do not run or update the walkthrough.md file unless specifically and explicitly commanded by the user.
- **Git Push Tracking Rule**: Every time there is a git push execution (both successful pushes and failed push attempts), immediately update both the markdown and CSV formats of the "Production Push Info" log files located under the `DoNotPush_InfoOnly` directory. Include the push date, push time (up to seconds), commit hash, components updated, files affected, and the push execution result.
