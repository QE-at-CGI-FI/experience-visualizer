# Career & Experience Visualizer Test Plan

## Application Overview

The Career & Experience Visualizer is a web application for tracking career progression including employment history, project assignments, trainings/certifications, and experience tags. The application uses browser localStorage for data persistence and provides JSON export/import functionality. Testing focuses on data integrity, user workflows, validation, and cross-browser compatibility.

## Test Scenarios

### 1. Core Employment Management

**Seed:** `tests/seed.spec.ts`

#### 1.1. Create New Employment Record

**File:** `tests/employment/create-employment.spec.ts`

**Steps:**
  1. Navigate to the Career & Experience Visualizer application
    - expect: The application loads successfully
    - expect: Header shows 'Career & Experience Visualizer'
    - expect: Employment History section is visible
  2. Click the 'Add Employment' button
    - expect: Modal dialog opens with 'Add Employment' title
    - expect: Form contains Job Title, Company, Start Date, and End Date fields
    - expect: Cancel and Save Employment buttons are present
  3. Fill Job Title field with 'Senior QA Engineer'
    - expect: Text is entered successfully in the Job Title field
  4. Fill Company field with 'Example Corp'
    - expect: Text is entered successfully in the Company field
  5. Fill Start Date field with '2023-01'
    - expect: Date is entered in month format successfully
  6. Leave End Date field empty (current position)
    - expect: Field remains empty as intended
  7. Click 'Save Employment' button
    - expect: Modal closes
    - expect: New employment appears in Employment History
    - expect: Employment shows 'Senior QA Engineer' at 'Example Corp'
    - expect: Date shows 'Jan 2023 - Present'
    - expect: Career Timeline is updated with new employment

#### 1.2. Edit Existing Employment Record

**File:** `tests/employment/edit-employment.spec.ts`

**Steps:**
  1. Locate an existing employment record and click 'Edit' button
    - expect: Edit Employment modal opens
    - expect: Form is pre-populated with existing data
    - expect: Title shows 'Edit Employment'
  2. Modify the Job Title to 'Lead QA Engineer'
    - expect: Job title field is updated successfully
  3. Update End Date to '2024-12'
    - expect: End date field is updated successfully
  4. Click 'Save Employment' button
    - expect: Modal closes
    - expect: Employment record shows updated information
    - expect: Career Timeline reflects the changes
    - expect: Date range is updated correctly

#### 1.3. Delete Employment Record with Confirmation

**File:** `tests/employment/delete-employment.spec.ts`

**Steps:**
  1. Locate an existing employment record and click 'Delete' button
    - expect: Confirmation dialog appears
    - expect: Dialog asks 'Are you sure you want to delete this employment?'
  2. Click 'Cancel' in the confirmation dialog
    - expect: Dialog closes
    - expect: Employment record is NOT deleted
    - expect: Record remains in the list
  3. Click 'Delete' button again
    - expect: Confirmation dialog appears again
  4. Click 'OK' to confirm deletion
    - expect: Employment record is removed from Employment History
    - expect: Career Timeline is updated
    - expect: Related assignments and tags are also removed

### 2. Assignment and Experience Tags Management

**Seed:** `tests/seed.spec.ts`

#### 2.1. Add Assignment to Employment

**File:** `tests/assignments/create-assignment.spec.ts`

**Steps:**
  1. Navigate to an existing employment record
    - expect: Employment record is visible
    - expect: Assignments section shows current count
  2. Click 'Add Assignment' button within the employment
    - expect: Add Assignment modal opens
    - expect: Form contains Assignment Title, Description, Start Date, and End Date fields
  3. Fill Assignment Title with 'Test Automation Framework Development'
    - expect: Assignment title is entered successfully
  4. Fill Description with 'Built comprehensive test automation suite using Playwright and Cypress for web application testing'
    - expect: Description text is entered successfully
  5. Set Start Date to '2023-03' and End Date to '2023-09'
    - expect: Both date fields are filled successfully
  6. Click 'Save Assignment' button
    - expect: Modal closes
    - expect: New assignment appears under the employment
    - expect: Assignment shows correct title, dates, and description
    - expect: Assignments count is incremented

#### 2.2. Add Experience Tags to Assignment

**File:** `tests/assignments/add-experience-tags.spec.ts`

**Steps:**
  1. Locate an existing assignment and click 'Add Tag' button
    - expect: Add Experience Tag modal opens
    - expect: Form contains Tag Name field and Category dropdown
  2. Enter 'Playwright' in Tag Name field
    - expect: Tag name is entered successfully
  3. Select 'Test Tech' from Category dropdown
    - expect: Category is selected
    - expect: Dropdown shows 'Test Tech' as selected
  4. Click 'Save Tag' button
    - expect: Modal closes
    - expect: Tag appears in Experience Tags section
    - expect: Tag is styled with appropriate category color
    - expect: Experience Tags count is incremented
  5. Add another tag with name 'JavaScript' and category 'Test Target Tech'
    - expect: Second tag is added successfully
    - expect: Both tags are visible
    - expect: Tags Overview section is updated
  6. Add a third tag with name 'Team Leadership' and category 'Skill'
    - expect: Third tag is added successfully
    - expect: All three categories are represented
    - expect: Tags are displayed with different styling per category

#### 2.3. Delete Experience Tag with Confirmation

**File:** `tests/assignments/delete-experience-tag.spec.ts`

**Steps:**
  1. Locate an experience tag and click the '×' delete button
    - expect: Confirmation dialog appears asking 'Are you sure you want to delete this tag?'
  2. Click 'Cancel' in the confirmation dialog
    - expect: Dialog closes
    - expect: Tag is NOT deleted
    - expect: Tag remains visible
  3. Click the '×' delete button again and confirm deletion
    - expect: Tag is removed from the assignment
    - expect: Experience Tags count is decremented
    - expect: Tags Overview section is updated
    - expect: Career Timeline reflects the change

### 3. Training and Certification Management

**Seed:** `tests/seed.spec.ts`

#### 3.1. Add Training or Certification

**File:** `tests/training/add-training.spec.ts`

**Steps:**
  1. Navigate to an employment record and click 'Add Training' button
    - expect: Add Training/Certification modal opens
    - expect: Form contains Training/Certification Title field
    - expect: Cancel and Save Training buttons are present
  2. Enter 'AWS Certified Cloud Practitioner' in the title field
    - expect: Training title is entered successfully
  3. Click 'Save Training' button
    - expect: Modal closes
    - expect: Training appears in Trainings & Certifications section
    - expect: Training count is incremented
    - expect: Training title is displayed correctly
  4. Add a second training 'Scrum Master Certification (PSM I)'
    - expect: Second training is added successfully
    - expect: Both trainings are visible in the list
    - expect: Count shows correct number

#### 3.2. Edit Training Record

**File:** `tests/training/edit-training.spec.ts`

**Steps:**
  1. Locate an existing training and click 'Edit' button
    - expect: Edit Training modal opens
    - expect: Form is pre-populated with existing title
    - expect: Title shows 'Edit Training/Certification'
  2. Modify title to 'AWS Certified Solutions Architect'
    - expect: Title field is updated successfully
  3. Click 'Save Training' button
    - expect: Modal closes
    - expect: Training record shows updated title
    - expect: Changes are reflected in the display

#### 3.3. Delete Training Record

**File:** `tests/training/delete-training.spec.ts`

**Steps:**
  1. Locate a training record and click 'Delete' button
    - expect: Confirmation dialog appears asking for deletion confirmation
  2. Confirm the deletion
    - expect: Training is removed from the list
    - expect: Training count is decremented
    - expect: No trace of the deleted training remains

### 4. Data Export and Import

**Seed:** `tests/seed.spec.ts`

#### 4.1. Export Career Data

**File:** `tests/data/export-data.spec.ts`

**Steps:**
  1. Create a complete career profile with employment, assignments, tags, and training
    - expect: Career profile is fully populated with test data
  2. Click 'Export Data' button in the header
    - expect: Export success dialog appears with message 'Data exported successfully!'
  3. Accept the dialog
    - expect: JSON file is downloaded
    - expect: Filename follows pattern 'career-visualizer-export-YYYY-MM-DD.json'
    - expect: File contains all career data in JSON format
  4. Open and verify the exported JSON file
    - expect: File contains employments, assignments, tags, and trainings data
    - expect: Data structure matches expected format
    - expect: All entered information is preserved

#### 4.2. Import Career Data

**File:** `tests/data/import-data.spec.ts`

**Steps:**
  1. Start with a blank application state
    - expect: No employment records are visible
    - expect: All sections show empty state messages
  2. Click 'Import Data' button in the header
    - expect: File selection dialog opens
  3. Select a valid exported JSON file
    - expect: Data is imported successfully
    - expect: All employment records are restored
    - expect: Assignments, tags, and trainings are loaded
    - expect: Career Timeline and Tags Overview are populated
  4. Verify all imported data is displayed correctly
    - expect: Employment history matches the imported data
    - expect: Assignment details are accurate
    - expect: Experience tags show correct categories and names
    - expect: Training records are complete

#### 4.3. Import Invalid Data File

**File:** `tests/data/import-invalid-data.spec.ts`

**Steps:**
  1. Attempt to import a non-JSON file (e.g., .txt file)
    - expect: Error message is displayed
    - expect: Application remains stable
    - expect: Existing data is not corrupted
  2. Attempt to import a JSON file with invalid structure
    - expect: Error handling occurs gracefully
    - expect: User is informed of the issue
    - expect: Application continues to function
  3. Verify application state after failed import
    - expect: Original data is preserved if any existed
    - expect: No partial imports occurred
    - expect: All features remain functional

### 5. Filtering and Navigation

**Seed:** `tests/seed.spec.ts`

#### 5.1. Filter Experience Tags by Category

**File:** `tests/filtering/filter-tags.spec.ts`

**Steps:**
  1. Create experience tags in all categories (Test Target Tech, Test Tech, Skills)
    - expect: Mix of tags is visible in Experience Tags Overview
    - expect: 'All' filter is active by default
  2. Click 'Test Tech' filter button
    - expect: Only Test Tech tags are displayed
    - expect: 'Test Tech' button appears active/selected
    - expect: Other category tags are hidden
  3. Click 'Test Target Tech' filter button
    - expect: Only Test Target Tech tags are displayed
    - expect: Filter button styling updates
    - expect: Correct tags are shown
  4. Click 'Skills' filter button
    - expect: Only Skills tags are displayed
    - expect: Filter is applied correctly
  5. Click 'All' filter button
    - expect: All tags are displayed again
    - expect: No filtering is applied
    - expect: 'All' button appears active

#### 5.2. Career Timeline Navigation

**File:** `tests/navigation/career-timeline.spec.ts`

**Steps:**
  1. Create multiple employment records with different date ranges
    - expect: Multiple employments are created successfully
  2. Navigate to Career Timeline section
    - expect: Timeline displays all employments
    - expect: Employments are ordered chronologically
    - expect: Each entry shows company, title, dates, and summary statistics
  3. Verify timeline shows accurate assignment and tag counts
    - expect: 'X assignments, Y unique experience tags' summary is accurate for each employment
    - expect: Counts match the actual data
  4. Add new assignment and verify timeline updates
    - expect: Timeline counts are updated in real-time
    - expect: Statistics remain accurate

#### 5.3. Person Name Field Functionality

**File:** `tests/navigation/person-name.spec.ts`

**Steps:**
  1. Enter a name in the 'Enter person's name...' field
    - expect: Name is entered successfully
    - expect: Text persists in the field
  2. Export data and verify name is included
    - expect: Exported JSON contains the person's name
    - expect: Name data is preserved
  3. Clear the name field and enter a different name
    - expect: Field can be updated
    - expect: New name replaces the old one

### 6. Form Validation and Error Handling

**Seed:** `tests/seed.spec.ts`

#### 6.1. Employment Form Validation

**File:** `tests/validation/employment-validation.spec.ts`

**Steps:**
  1. Open Add Employment modal and attempt to save without filling any fields
    - expect: Form validation prevents submission
    - expect: Required field indicators appear
    - expect: Job Title field is highlighted or focused
  2. Fill only Job Title and attempt to save
    - expect: Validation still prevents submission
    - expect: Company field is indicated as required
  3. Fill Job Title and Company, leave dates empty, and attempt to save
    - expect: Start Date field validation triggers
    - expect: Start Date is required
  4. Enter invalid date format in Start Date field
    - expect: Date format validation occurs
    - expect: Month input accepts correct format (YYYY-MM)
  5. Enter End Date that is before Start Date
    - expect: Date logic validation prevents invalid date ranges
    - expect: Error message indicates the issue

#### 6.2. Assignment Form Validation

**File:** `tests/validation/assignment-validation.spec.ts`

**Steps:**
  1. Open Add Assignment modal and attempt to save without filling required fields
    - expect: Form validation prevents submission
    - expect: Assignment Title field is marked as required
  2. Fill title but leave description empty
    - expect: Validation handles optional description field appropriately
  3. Enter assignment dates outside the employment date range
    - expect: Date validation ensures assignment dates fall within employment period
    - expect: Appropriate error messaging appears

#### 6.3. Experience Tag Form Validation

**File:** `tests/validation/tag-validation.spec.ts`

**Steps:**
  1. Open Add Experience Tag modal and attempt to save without filling fields
    - expect: Tag Name field is required
    - expect: Category dropdown is required
  2. Enter tag name but leave category as 'Select category...'
    - expect: Category validation prevents submission
    - expect: User must select a valid category
  3. Attempt to add duplicate tag name within the same assignment
    - expect: Duplicate tag validation prevents identical tag names
    - expect: Error message informs user of duplication

### 7. Data Persistence and Browser Storage

**Seed:** `tests/seed.spec.ts`

#### 7.1. Local Storage Persistence

**File:** `tests/persistence/local-storage.spec.ts`

**Steps:**
  1. Create a complete career profile with multiple entries
    - expect: All data is entered and displayed correctly
  2. Refresh the browser page
    - expect: All data persists after page refresh
    - expect: No data loss occurs
    - expect: Application state is fully restored
  3. Close and reopen the browser tab
    - expect: Data remains intact
    - expect: Local storage successfully preserves all information
  4. Clear browser local storage and refresh page
    - expect: Application returns to empty state
    - expect: All sections show 'no data' messages
    - expect: No errors occur

#### 7.2. Data Integrity After Multiple Operations

**File:** `tests/persistence/data-integrity.spec.ts`

**Steps:**
  1. Perform a series of create, edit, and delete operations on various data types
    - expect: All operations complete successfully
    - expect: Data remains consistent
  2. Export data and verify all recent changes are included
    - expect: Exported data reflects all modifications
    - expect: No data corruption has occurred
  3. Import the exported data into a fresh application instance
    - expect: Imported data matches the exported data exactly
    - expect: All relationships between employments, assignments, tags, and trainings are maintained

### 8. Cross-Browser and Responsive Design

**Seed:** `tests/seed.spec.ts`

#### 8.1. Mobile Responsive Design

**File:** `tests/responsive/mobile-view.spec.ts`

**Steps:**
  1. Resize browser to mobile viewport (375x667)
    - expect: Application layout adapts to mobile screen
    - expect: All buttons remain accessible
    - expect: Modal dialogs fit within mobile viewport
  2. Test form interactions on mobile
    - expect: Forms are useable on mobile devices
    - expect: Input fields are accessible
    - expect: Touch interactions work correctly
  3. Verify scrolling and navigation on mobile
    - expect: All content is accessible through scrolling
    - expect: No horizontal scrolling required
    - expect: Mobile navigation is intuitive

#### 8.2. Cross-Browser Compatibility

**File:** `tests/browsers/compatibility.spec.ts`

**Steps:**
  1. Test application functionality in Chrome
    - expect: All features work correctly
    - expect: No console errors
    - expect: UI renders properly
  2. Test application functionality in Firefox
    - expect: Full feature compatibility
    - expect: Date inputs work correctly
    - expect: Local storage functions properly
  3. Test application functionality in Safari (if available)
    - expect: Safari-specific features are supported
    - expect: No browser-specific issues occur
  4. Test application functionality in Edge
    - expect: Microsoft Edge compatibility is maintained
    - expect: All modern browser features are supported
