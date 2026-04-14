# Todo ideas & possible features

List of todo ideas and possible new features for Career & Experience Visualizer

## Employment History

### AI matching on UI

- Add in-browser AI matching

### General

- **Tests? No tests? You are living on the edge. The vibe edge, waiting to fall off...**
- Add a "Show only CGI experience" filter option.
- Provide an option to calculate experience only from a specific time window (e.g., the last five years).
- Enable adding relevant hobby projects or thesis‑based skills, especially useful for juniors but applicable to seniors as well.
- Figure out how to show experience ("someone let me be in position to do something called this") and skill ("I can confidently say I can do this and have a way of showcasing excellence").
- Allow adding education or training in a way that contributes to skill experience (e.g., a Kotlin thesis should count as Kotlin experience).
- Provide a dedicated section for industry expertise and long‑term skills, moving toward an "electronic CV" structure.
- Show list of “most experience with these tools” as a kind of starred summary list, with an option to hide it if desired, as in:

```
*****  Playwright
****   Robot Framework
***    Cypress
```

- Consider adding a separate section for volunteering work?
- Make tag colours customizable for the user under General Settings etc.
- What if a person has been on a same project for 6 years and a new technology X or software Y is born and taken into use after 3 years, how should the experience for tags X and Y counted? One can't yet have 10 years of experience on Microsoft 365 Copilot...
- Add Export to PDF (some sort of a summary).

### Assignments

- Add assignment: Support line breaks in job descriptions when the role includes distinctly different responsibilities grouped under one assignment.
- [x] Support for drag‑and‑drop to move an assignment under a different employer (useful for mistakes or comebackers).

### Experience Tags

- Add a new color indicator to show whether a project was a multi‑vendor project or not.
- Set JIRA and Confluence as default Test Tech tags, which the user could uncheck when adding an assignment.
- Provide a tooltip or info icon explaining the difference between Test Target Tech and Test Tech (in simple terms).
- Make the most commonly used testing tools available in a dropdown when adding tags.
- Improve the tool so it can automatically handle cases where the user adds duplicate tags written with different capitalization (e.g., python vs Python).
- Introduce a new color indicator for skills the person does not yet have, cannot develop in their current assignment, but wants to learn (a "to‑learn" list).
- Enable editing a tag by clicking it, instead of requiring deletion and re‑adding.
- Set Git and GitHub as default tags for assignments when the person's role is Test Automation.
- When Robot Framework is added as a tag, consider automatically adding related tags such as Python, Robocop, and a relevant library.
- Separate skills related to Law to different skill category (Other?) with different colour.
- Add new tag for Language as in (Finnish, English, Swedish...)

### Trainings & Certifications

- Enable adding a skill tag to an education (maybe without adding experience as one day certification/workshop is only a start?)
- Consider having Certifications as a separate section. Now if there are many trainings, the certifications are not easily spotted from the list. The button is also currently names "Add training" and not "Add training or certification".
- Consider modifying the Add training screen so that training provided and date are asked in separate input fields.
- Make "Trainings & Certifications" section collapsible and collapse it by default if there are no trainings added to an assignment.

## Career Timeline

- Display total career length (years + months) next to the Career Timeline heading.
- Consider showing certificates directly in the Career Timeline so they don’t get buried under employment history.
- There is no way to organize by drag-and-drop Trainings & Certifications Item as they are shown in alphabetical order when they are added. Maybe give possiblity for user to customise their ordering?
- Maybe highlight the current position(s) or the word "Present" in the timeline?

## Experience Tags Overview

- Allow sorting of tags alphabetically within each color category.
- Add possibility to order tags so that the tag with most experience is at the top-left.
- Add a way to star 5 tags in experience overview.

# Known bugs

- Add assignment: "Empty" employment can be added which results in an employment without a title and Invalid Date - Present (NaN year)
- Career timeline: unique experience tags sum is counted only after refreshing browser (when tag is added or removed to an assignment)
