# Career & Experience Visualizer

A comprehensive web application for tracking and visualizing your career journey, including employment history, project assignments, and experience tags.

## Features

### 📊 Career Tracking

- **Employment History**: Track job positions with companies, titles, and date ranges
- **Project Assignments**: Document specific projects and assignments within each employment
- **Experience Tags**: Tag your experiences with categorized skills and technologies

### 🏷️ Tag Categories

- **Test Target Tech**: Technologies you've tested or worked with
- **Test Tech**: Testing tools and frameworks you've used
- **Skills**: Professional skills and competencies you've developed

### 💾 Data Management

- **Local Storage**: All data is automatically saved to your browser's local storage
- **JSON Export**: Export your complete career data as a JSON file
- **JSON Import**: Import previously exported data or migrate from other systems

### 📱 User Interface

- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Interactive Timeline**: Visual timeline of your career progression
- **Tag Cloud**: Overview of all your experience tags with usage counts
- **Filtering**: Filter tags by category for focused analysis

## Getting Started

1. Open `index.html` in your web browser
2. Start by adding your employment history using the "Add Employment" button
3. For each employment, add specific assignments or projects
4. Tag each assignment with relevant technologies, tools, and skills
5. View your career progression in the timeline section
6. Explore your experience tags in the overview section

## Usage Instructions

### Adding Employment

1. Click "Add Employment"
2. Fill in job title, company name, start date, and end date (leave empty for current positions)
3. Save to create the employment record

### Adding Assignments

1. Navigate to an employment card
2. Click "Add Assignment" within that employment
3. Enter assignment title, description, start/end dates
4. Save to create the assignment

### Adding Experience Tags

1. Navigate to an assignment card
2. Click "Add Tag" within that assignment
3. Enter tag name, select category, and add optional description
4. Save to create the experience tag

### Data Management

#### Exporting Data

- Click "Export Data" in the header
- A JSON file will be downloaded with all your career data
- Use this for backups or sharing your career information

#### Importing Data

- Click "Import Data" in the header
- Select a previously exported JSON file
- Your data will be restored (this will replace existing data)

## Technical Details

### Architecture

- **Frontend**: Pure HTML, CSS, and JavaScript (no frameworks required)
- **Storage**: Browser localStorage for data persistence
- **Data Model**: Hierarchical structure (Employment → Assignments → Tags)

### File Structure

```
/
├── index.html          # Main application interface
├── styles.css          # Application styling
├── models.js           # Data models and storage management
├── app.js              # Application logic and UI handling
└── README.md           # This documentation
```

### Data Structure

```javascript
{
  employments: [
    {
      id: 1,
      title: "Job Title",
      company: "Company Name",
      startDate: "2023-01-01",
      endDate: "2024-01-01" // or null for current
    }
  ],
  assignments: [
    {
      id: 1,
      employmentId: 1,
      title: "Project Name",
      description: "Project description",
      startDate: "2023-01-01",
      endDate: "2023-06-01"
    }
  ],
  tags: [
    {
      id: 1,
      assignmentId: 1,
      name: "React",
      category: "test target tech",
      description: "Frontend framework"
    }
  ]
}
```

## Browser Compatibility

This application works in all modern browsers that support:

- ES6 JavaScript features
- localStorage API
- CSS Grid and Flexbox
- File API for import/export

Tested browsers:

- Chrome/Chromium 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Customization

### Adding New Tag Categories

To add new tag categories, modify the `TagCategories` object in `models.js`:

```javascript
const TagCategories = {
  "your-category": {
    label: "Your Category",
    className: "your-category",
    color: "#your-color",
    backgroundColor: "#your-bg-color",
  },
};
```

Then add corresponding CSS styles in `styles.css`:

```css
.tag.your-category {
  background-color: #your-bg-color;
  color: #your-color;
}
```

### Styling Customization

The application uses CSS custom properties for easy theming. Modify the color scheme by updating the CSS variables in `styles.css`.

## Data Privacy

- All data is stored locally in your browser
- No data is sent to external servers
- Export/import functionality allows you to maintain your own backups
- Clearing browser data will remove all stored information

## Contributing

This is a standalone application with no external dependencies. To contribute:

1. Clone or download the repository
2. Make your modifications
3. Test in multiple browsers
4. Submit your improvements

## License

This project is open source and available under the MIT License.

## Support

For issues or feature requests, please review the code structure and modify according to your needs. The application is designed to be self-contained and easily customizable.
