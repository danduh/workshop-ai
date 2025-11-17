# Frontend Development Tasks
## System Prompt Management Application

Based on PRD Version 1.0 | Last Updated: November 17, 2025

---

## Task Overview

This document breaks down the frontend development into discrete, deliverable tasks. Each task includes:
- Clear objective
- Specific deliverables
- Definition of Done (DoD)
- Dependencies (if any)

---

## Phase 1: Project Setup & Infrastructure

### Task 1.1: Initialize React Project with TypeScript
**Objective**: Set up the base React application with TypeScript, Vite, and essential configurations.

**Deliverables**:
- Vite-based React 18+ project with TypeScript
- ESLint and Prettier configuration
- Git repository initialized
- Package.json with core dependencies

**Definition of Done**:
- [ ] Project runs successfully with `npm run dev`
- [ ] TypeScript strict mode enabled in `tsconfig.json`
- [ ] ESLint and Prettier configured and working
- [ ] `.gitignore` file includes node_modules, dist, .env
- [ ] README.md with basic setup instructions
- [ ] Environment variables setup (`.env.example` file)

**Dependencies**: None

---

### Task 1.2: Install and Configure Dependencies
**Objective**: Install all required npm packages and configure build tools.

**Deliverables**:
- All dependencies from PRD Section 23 installed
- UI component library configured (Material-UI or Ant Design)
- React Router v6 configured
- Axios configured with base URL

**Definition of Done**:
- [ ] All dependencies in package.json
- [ ] UI component library theme provider added to App.tsx
- [ ] Router configured with placeholder routes
- [ ] Axios instance created with base URL from environment variable
- [ ] No console errors when running dev server
- [ ] Build command (`nx build <app name>`) executes successfully

**Dependencies**: Task 1.1

---

### Task 1.3: Create Folder Structure and Base Files
**Objective**: Implement the folder structure from PRD Section 2.1.

**Deliverables**:
- All folders created as per specification
- Index.ts barrel exports for major folders
- Base layout components skeleton

**Definition of Done**:
- [ ] Folders created: components/common, components/layout, components/prompts, contexts, hooks, pages, services, types, utils
- [ ] Each folder has an index.ts file
- [ ] MainLayout.tsx created in components/layout with basic structure
- [ ] App.tsx updated to use folder structure
- [ ] All files compile without errors

**Dependencies**: Task 1.2

---

## Phase 2: Core Types & Services

### Task 2.1: Define TypeScript Interfaces
**Objective**: Create all TypeScript type definitions from PRD Section 3.1.

**Deliverables**:
- `types/index.ts` with all interfaces
- Exported types for Prompt, PaginatedResponse, DTOs, FilterOptions

**Definition of Done**:
- [ ] File `types/index.ts` created
- [ ] All interfaces from PRD Section 3.1 implemented:
  - Prompt
  - PaginatedResponse
  - CreatePromptDto
  - CreateVersionDto
  - FilterOptions
- [ ] All types properly exported
- [ ] No TypeScript compilation errors

**Dependencies**: Task 1.3

---

### Task 2.2: Implement API Service Layer
**Objective**: Create the PromptService class with all API methods from PRD Section 3.2.

**Deliverables**:
- `services/promptService.ts` with complete API integration
- Error handling for all HTTP methods
- Axios configuration with interceptors

**Definition of Done**:
- [ ] File `services/promptService.ts` created
- [ ] All methods implemented:
  - getPrompts(filters?: FilterOptions): Promise<PaginatedResponse>
  - getPromptByKey(promptKey: string): Promise<Prompt>
  - getPromptVersions(promptKey: string): Promise<Prompt[]>
  - createPrompt(data: CreatePromptDto): Promise<Prompt>
  - createVersion(promptKey: string, data: CreateVersionDto): Promise<Prompt>
  - activateVersion(promptKey: string, version: string): Promise<Prompt>
  - deletePrompt(id: string): Promise<void>
- [ ] Error handling for 400, 404, 409, 500 status codes
- [ ] Request/response interceptors configured
- [ ] Service exported and importable

**Dependencies**: Task 2.1

---

## Phase 3: Global State & Context

### Task 3.1: Create PromptsContext
**Objective**: Implement global state management for prompts using React Context API.

**Deliverables**:
- `contexts/PromptsContext.tsx` with provider and hook
- State management for prompts list and filters

**Definition of Done**:
- [ ] File `contexts/PromptsContext.tsx` created
- [ ] PromptsContextProvider component implemented
- [ ] usePromptsContext custom hook created
- [ ] State includes: prompts, filters, loading, error
- [ ] Actions include: setFilters, refreshPrompts, clearFilters
- [ ] Provider wraps App in main.tsx or App.tsx
- [ ] Context interface matches PRD Section 10.1

**Dependencies**: Task 2.2

---

### Task 3.2: Create NotificationContext
**Objective**: Implement global toast/notification system.

**Deliverables**:
- `contexts/NotificationContext.tsx` with provider and hook
- Toast/snackbar component for displaying notifications

**Definition of Done**:
- [ ] File `contexts/NotificationContext.tsx` created
- [ ] NotificationProvider component implemented
- [ ] useNotification custom hook created
- [ ] Methods implemented: showSuccess, showError, showInfo, showWarning
- [ ] Toast component displays notifications with auto-dismiss (5 seconds)
- [ ] Multiple notifications stack properly
- [ ] Provider wraps App in main.tsx or App.tsx
- [ ] Context interface matches PRD Section 10.2

**Dependencies**: Task 1.3

---

## Phase 4: Custom Hooks

### Task 4.1: Create useDebounce Hook
**Objective**: Implement debounce utility hook for search functionality.

**Deliverables**:
- `hooks/useDebounce.ts` with generic implementation

**Definition of Done**:
- [ ] File `hooks/useDebounce.ts` created
- [ ] Hook accepts value and delay parameters
- [ ] Returns debounced value
- [ ] Cleanup on unmount implemented
- [ ] TypeScript generics used for type safety
- [ ] Default delay is 300ms

**Dependencies**: Task 1.3

---

### Task 4.2: Create usePrompts Hook
**Objective**: Create hook for fetching and managing prompts list.

**Deliverables**:
- `hooks/usePrompts.ts` with data fetching logic

**Definition of Done**:
- [ ] File `hooks/usePrompts.ts` created
- [ ] Hook accepts optional FilterOptions parameter
- [ ] Returns: data, loading, error, refetch
- [ ] Uses PromptsContext for state management
- [ ] Calls promptService.getPrompts()
- [ ] Handles loading and error states
- [ ] Triggers fetch on mount and filter changes

**Dependencies**: Task 2.2, Task 3.1

---

### Task 4.3: Create usePromptDetail Hook
**Objective**: Create hook for fetching single prompt details and versions.

**Deliverables**:
- `hooks/usePromptDetail.ts` with detail fetching logic

**Definition of Done**:
- [ ] File `hooks/usePromptDetail.ts` created
- [ ] Hook accepts promptKey parameter
- [ ] Returns: prompt, versions, loading, error, refetch
- [ ] Calls promptService.getPromptByKey() and getPromptVersions()
- [ ] Handles loading and error states
- [ ] Triggers fetch on mount and promptKey change

**Dependencies**: Task 2.2

---

### Task 4.4: Create useForm Hook
**Objective**: Implement form state management hook.

**Deliverables**:
- `hooks/useForm.ts` with form handling logic

**Definition of Done**:
- [ ] File `hooks/useForm.ts` created
- [ ] Hook accepts initialValues and validationSchema
- [ ] Returns: values, errors, touched, handleChange, handleSubmit, setFieldValue, resetForm
- [ ] Validation triggered on blur
- [ ] isDirty flag tracked
- [ ] TypeScript generics for type safety

**Dependencies**: Task 1.3

---

### Task 4.5: Create useConfirmation Hook
**Objective**: Implement confirmation dialog management hook.

**Deliverables**:
- `hooks/useConfirmation.ts` with dialog control logic

**Definition of Done**:
- [ ] File `hooks/useConfirmation.ts` created
- [ ] Hook returns: confirm function and ConfirmDialog component
- [ ] confirm() accepts title, message, and callback
- [ ] Returns promise that resolves on confirm/cancel
- [ ] Dialog state managed internally

**Dependencies**: Task 1.3

---

## Phase 5: Common UI Components

### Task 5.1: Create StatusBadge Component
**Objective**: Build reusable status indicator for active/inactive prompts.

**Deliverables**:
- `components/common/StatusBadge.tsx`

**Definition of Done**:
- [ ] File created with TypeScript
- [ ] Props: isActive (boolean), size (optional)
- [ ] Displays "ACTIVE" badge in green for active prompts
- [ ] Displays inactive indicator (gray) for inactive prompts
- [ ] Supports small, medium, large sizes
- [ ] Responsive styling

**Dependencies**: Task 1.3

---

### Task 5.2: Create LoadingState Component
**Objective**: Build loading indicators (spinner and skeleton screens).

**Deliverables**:
- `components/common/LoadingState.tsx`
- Skeleton variants for cards and text

**Definition of Done**:
- [ ] File created with TypeScript
- [ ] Spinner variant implemented
- [ ] Skeleton card variant implemented
- [ ] Skeleton text variant implemented
- [ ] Props: variant, count (for multiple skeletons)
- [ ] Smooth animations applied
- [ ] Matches design system

**Dependencies**: Task 1.3

---

### Task 5.3: Create ErrorBanner Component
**Objective**: Build error display component with retry functionality.

**Deliverables**:
- `components/common/ErrorBanner.tsx`

**Definition of Done**:
- [ ] File created with TypeScript
- [ ] Props: message, onRetry, onDismiss
- [ ] Displays error message prominently
- [ ] Retry button functional (if onRetry provided)
- [ ] Dismiss button functional (if onDismiss provided)
- [ ] Accessible (ARIA labels, keyboard navigation)
- [ ] Styled with error colors (red/orange)

**Dependencies**: Task 1.3

---

### Task 5.4: Create ConfirmModal Component
**Objective**: Build reusable confirmation dialog.

**Deliverables**:
- `components/common/ConfirmModal.tsx`

**Definition of Done**:
- [ ] File created with TypeScript
- [ ] Props: open, title, message, onConfirm, onCancel, confirmText, cancelText, danger
- [ ] Modal overlay with focus trap
- [ ] Confirm and cancel buttons
- [ ] Danger variant (red confirm button)
- [ ] Accessible (Escape to close, focus management)
- [ ] Backdrop click closes modal

**Dependencies**: Task 1.3

---

### Task 5.5: Create MarkdownViewer Component
**Objective**: Build markdown content renderer with syntax highlighting.

**Deliverables**:
- `components/common/MarkdownViewer.tsx`

**Definition of Done**:
- [ ] File created with TypeScript
- [ ] Props: content, showCopyButton
- [ ] Uses react-markdown for rendering
- [ ] Syntax highlighting for code blocks
- [ ] Copy button copies content to clipboard
- [ ] Success toast on copy
- [ ] Proper styling (max-width, line height, spacing)
- [ ] Handles empty content gracefully

**Dependencies**: Task 1.3, Task 3.2

---

### Task 5.6: Create MarkdownEditor Component
**Objective**: Build markdown editor with split preview.

**Deliverables**:
- `components/common/MarkdownEditor.tsx`

**Definition of Done**:
- [ ] File created with TypeScript
- [ ] Props: value, onChange, placeholder, readOnly
- [ ] Split view: Editor | Preview
- [ ] Toolbar with formatting buttons (bold, italic, headers, lists, code)
- [ ] Tab support in editor
- [ ] Character/word count display
- [ ] Preview uses MarkdownViewer component
- [ ] Responsive: stacked view on mobile

**Dependencies**: Task 5.5

---

### Task 5.7: Create TagInput Component
**Objective**: Build multi-tag input with autocomplete.

**Deliverables**:
- `components/common/TagInput.tsx`

**Definition of Done**:
- [ ] File created with TypeScript
- [ ] Props: tags, onChange, suggestions, placeholder
- [ ] Add tag on Enter key
- [ ] Remove tag by clicking X on chip
- [ ] Autocomplete dropdown from suggestions
- [ ] Prevents duplicate tags
- [ ] Displays tags as chips
- [ ] Accessible (ARIA labels, keyboard navigation)

**Dependencies**: Task 1.3

---

### Task 5.8: Create PromptCard Component
**Objective**: Build reusable card for displaying prompt summary.

**Deliverables**:
- `components/prompts/PromptCard.tsx`

**Definition of Done**:
- [ ] File created with TypeScript
- [ ] Props: prompt, onView, onCreateVersion, showActions
- [ ] Layout matches PRD Section 4.3.3 design
- [ ] Active badge displayed for active prompts
- [ ] Model chip with color coding
- [ ] Truncated description (2 lines max, ellipsis)
- [ ] Tags displayed (first 3 + count)
- [ ] Metadata line (version, date, creator)
- [ ] View Details button navigates to detail page
- [ ] Quick Actions dropdown menu
- [ ] Hover effects and transitions
- [ ] Responsive layout

**Dependencies**: Task 2.1, Task 5.1

---

## Phase 6: Layout Components

### Task 6.1: Create MainLayout Component
**Objective**: Build the main application layout wrapper.

**Deliverables**:
- `components/layout/MainLayout.tsx`

**Definition of Done**:
- [ ] File created with TypeScript
- [ ] Header with app title: "System Prompt Management"
- [ ] Content area with proper spacing
- [ ] Footer (optional)
- [ ] Responsive layout
- [ ] Renders children prop

**Dependencies**: Task 1.3

---

### Task 6.2: Create PageHeader Component
**Objective**: Build reusable page header component.

**Deliverables**:
- `components/layout/PageHeader.tsx`

**Definition of Done**:
- [ ] File created with TypeScript
- [ ] Props: title, subtitle, actions, backLink
- [ ] Back navigation link (if backLink provided)
- [ ] Title and subtitle display
- [ ] Actions slot for buttons (right-aligned)
- [ ] Responsive layout
- [ ] Proper spacing and typography

**Dependencies**: Task 1.3

---

## Phase 7: Prompt Library Page

### Task 7.1: Create Prompt Library Page Structure
**Objective**: Build the main page component for the prompt library.

**Deliverables**:
- `pages/PromptLibraryPage.tsx`
- Route configured in App.tsx

**Definition of Done**:
- [ ] File created with TypeScript
- [ ] Route "/" configured in React Router
- [ ] Page uses MainLayout component
- [ ] PageHeader with "Create New Prompt" button
- [ ] Placeholder sections for filters, cards, pagination
- [ ] Navigation to create page functional

**Dependencies**: Task 1.2, Task 6.1, Task 6.2

---

### Task 7.2: Create Filter Bar Component
**Objective**: Build the filter controls for the prompt library.

**Deliverables**:
- `components/prompts/FilterBar.tsx`

**Definition of Done**:
- [ ] File created with TypeScript
- [ ] Search input with debounce (300ms)
- [ ] Model filter dropdown (multi-select)
- [ ] Tags filter dropdown (multi-select)
- [ ] Clear filters button (shown when filters active)
- [ ] Filters update URL query parameters
- [ ] Layout matches PRD Section 4.3.2
- [ ] Responsive: collapsible on mobile

**Dependencies**: Task 4.1, Task 7.1

---

### Task 7.3: Implement Prompt Cards Grid
**Objective**: Display prompts in responsive grid layout.

**Deliverables**:
- Grid layout in PromptLibraryPage.tsx
- Integration with PromptCard component

**Definition of Done**:
- [ ] Grid layout: 3 columns desktop, 2 tablet, 1 mobile
- [ ] PromptCard component used for each prompt
- [ ] Grid gap and spacing properly styled
- [ ] Handles empty state (no prompts)
- [ ] Displays loading skeleton during fetch
- [ ] Cards clickable to navigate to detail page

**Dependencies**: Task 5.8, Task 7.1

---

### Task 7.4: Implement Pagination Controls
**Objective**: Add pagination to the prompt library.

**Deliverables**:
- `components/prompts/PaginationControls.tsx`

**Definition of Done**:
- [ ] File created with TypeScript
- [ ] Props: page, totalPages, limit, total, onPageChange, onLimitChange
- [ ] Page number display: "Page X of Y"
- [ ] Previous/Next buttons with disabled states
- [ ] Page size selector: 10, 25, 50, 100
- [ ] Jump to page input (optional)
- [ ] Updates URL query parameters
- [ ] Centered at bottom of page

**Dependencies**: Task 7.1

---

### Task 7.5: Integrate API and State Management
**Objective**: Connect library page to backend API via PromptsContext.

**Deliverables**:
- Full integration of PromptLibraryPage with data fetching

**Definition of Done**:
- [ ] usePrompts hook integrated in PromptLibraryPage
- [ ] Filters from FilterBar update context state
- [ ] API called on component mount
- [ ] API called when filters/pagination change
- [ ] Loading state displays skeleton cards
- [ ] Error state displays ErrorBanner
- [ ] Empty state displays "No prompts found" message
- [ ] Data populates cards grid
- [ ] Pagination controls update on data change

**Dependencies**: Task 4.2, Task 7.2, Task 7.3, Task 7.4

---

## Phase 8: Prompt Detail Page

### Task 8.1: Create Prompt Detail Page Structure
**Objective**: Build the page component for viewing prompt details.

**Deliverables**:
- `pages/PromptDetailPage.tsx`
- Route configured in App.tsx

**Definition of Done**:
- [ ] File created with TypeScript
- [ ] Route "/prompts/:promptKey" configured
- [ ] Page uses MainLayout component
- [ ] PageHeader with back navigation and actions dropdown
- [ ] Placeholder sections for metadata, description, content, versions
- [ ] promptKey extracted from URL params

**Dependencies**: Task 6.1, Task 6.2

---

### Task 8.2: Implement Metadata and Description Sections
**Objective**: Display prompt metadata and description.

**Deliverables**:
- Metadata and description rendering in PromptDetailPage

**Definition of Done**:
- [ ] Status badge displayed (active/inactive)
- [ ] Model chip displayed
- [ ] Version number displayed (large, bold)
- [ ] Creation timestamp formatted: "MMM DD, YYYY HH:MM AM/PM"
- [ ] Created by username displayed
- [ ] Description section with label
- [ ] Empty state for description: "No description provided"
- [ ] Proper spacing and typography

**Dependencies**: Task 8.1, Task 5.1

---

### Task 8.3: Implement Content Viewer Section
**Objective**: Display prompt content with markdown rendering.

**Deliverables**:
- Content section in PromptDetailPage using MarkdownViewer

**Definition of Done**:
- [ ] Section labeled "Prompt Content"
- [ ] MarkdownViewer component integrated
- [ ] Copy button displays and functions
- [ ] Word/character count displayed
- [ ] Proper styling (border, spacing, max-width)
- [ ] Empty state handled gracefully

**Dependencies**: Task 5.5, Task 8.1

---

### Task 8.4: Implement Tags Section
**Objective**: Display prompt tags with interaction.

**Deliverables**:
- Tags section in PromptDetailPage

**Definition of Done**:
- [ ] Section labeled "Tags"
- [ ] Tags displayed as chips/badges
- [ ] Clicking tag navigates to library with tag filter
- [ ] Empty state: "No tags"
- [ ] Proper spacing and styling

**Dependencies**: Task 8.1

---

### Task 8.5: Implement Version History Preview
**Objective**: Show recent versions with quick actions.

**Deliverables**:
- Version history preview table in PromptDetailPage

**Definition of Done**:
- [ ] Section labeled "Recent Versions"
- [ ] Table/list displays last 5 versions
- [ ] Columns: Version, Status, Created Date, Created By, Actions
- [ ] Actions: View (modal), Activate (button)
- [ ] "View All Versions" button navigates to version history page
- [ ] Proper styling and responsive layout

**Dependencies**: Task 8.1

---

### Task 8.6: Implement Actions Dropdown
**Objective**: Add action menu to page header.

**Deliverables**:
- Actions dropdown in PromptDetailPage header

**Definition of Done**:
- [ ] Dropdown menu button in PageHeader
- [ ] Menu items:
  - Create New Version (navigate to create version page)
  - View All Versions (navigate to version history page)
  - Copy Prompt Key (clipboard + toast)
  - Copy Content (clipboard + toast)
  - Delete Prompt (modal confirmation, disabled if active)
- [ ] All actions functional
- [ ] Proper permissions/disabled states

**Dependencies**: Task 8.1, Task 3.2

---

### Task 8.7: Integrate API and State Management
**Objective**: Connect detail page to backend API.

**Deliverables**:
- Full integration of PromptDetailPage with data fetching

**Definition of Done**:
- [ ] usePromptDetail hook integrated
- [ ] API called on component mount and promptKey change
- [ ] Loading state displays skeleton screens
- [ ] Error state displays ErrorBanner
- [ ] 404 error shows "Prompt not found" message
- [ ] Data populates all sections
- [ ] Deleted prompt shows banner: "This prompt has been deleted"
- [ ] Recent versions populated

**Dependencies**: Task 4.3, Task 8.2, Task 8.3, Task 8.4, Task 8.5

---

## Phase 9: Create Prompt Form

### Task 9.1: Create Form Page Structure
**Objective**: Build the page component for creating new prompts.

**Deliverables**:
- `pages/CreatePromptPage.tsx`
- Route configured in App.tsx

**Definition of Done**:
- [ ] File created with TypeScript
- [ ] Route "/prompts/create" configured
- [ ] Page uses MainLayout component
- [ ] PageHeader with "Create New Prompt" title and cancel link
- [ ] Form container with max-width 800px, centered
- [ ] Placeholder for form fields

**Dependencies**: Task 6.1, Task 6.2

---

### Task 9.2: Implement Form Fields
**Objective**: Build all form input fields per PRD Section 6.3.2.

**Deliverables**:
- All form fields in CreatePromptPage

**Definition of Done**:
- [ ] Prompt Key input (text, required, validation)
- [ ] Model Name dropdown (required, with options)
- [ ] Description textarea (optional, character counter)
- [ ] Tags input using TagInput component
- [ ] Content field using MarkdownEditor component
- [ ] Created By input (text, required, pre-filled if available)
- [ ] All fields have labels, placeholders, help text
- [ ] Validation rules implemented per PRD
- [ ] Error messages display below fields

**Dependencies**: Task 5.6, Task 5.7, Task 9.1

---

### Task 9.3: Implement Form Validation
**Objective**: Add real-time validation and error handling.

**Deliverables**:
- Form validation logic using useForm hook

**Definition of Done**:
- [ ] useForm hook integrated
- [ ] Validation triggers on blur
- [ ] Required field validation
- [ ] Prompt key pattern validation: /^[a-z0-9_-]+$/
- [ ] Max length validation for all fields
- [ ] Real-time validation feedback
- [ ] isDirty flag tracked for unsaved changes warning

**Dependencies**: Task 4.4, Task 9.2

---

### Task 9.4: Implement Form Actions
**Objective**: Add cancel and submit functionality.

**Deliverables**:
- Form action buttons and submission logic

**Definition of Done**:
- [ ] Cancel button navigates back with unsaved changes warning
- [ ] Create Prompt button submits form
- [ ] Button disabled when form invalid or submitting
- [ ] Loading spinner on button during submission
- [ ] Success: show toast, navigate to detail page
- [ ] Error: display error messages (400, 409, 500)
- [ ] Form reset on successful submission

**Dependencies**: Task 9.3, Task 2.2, Task 3.2

---

## Phase 10: Create Version Form

### Task 10.1: Create Version Form Page Structure
**Objective**: Build the page component for creating new prompt versions.

**Deliverables**:
- `pages/CreateVersionPage.tsx`
- Route configured in App.tsx

**Definition of Done**:
- [ ] File created with TypeScript
- [ ] Route "/prompts/:promptKey/edit" configured
- [ ] Page uses MainLayout component
- [ ] PageHeader with "Create New Version: {promptKey}" title
- [ ] Info banner showing current active version
- [ ] Form container with max-width 800px, centered
- [ ] Placeholder for form fields
- [ ] promptKey extracted from URL params

**Dependencies**: Task 6.1, Task 6.2

---

### Task 10.2: Implement Form Pre-fill Logic
**Objective**: Load and pre-fill form with current active version data.

**Deliverables**:
- Data fetching and form initialization

**Definition of Done**:
- [ ] usePromptDetail hook integrated
- [ ] API fetches current prompt on mount
- [ ] Form fields pre-filled with active version data:
  - Model Name
  - Description
  - Tags
  - Content
- [ ] Prompt Key displayed as read-only
- [ ] Loading state during data fetch
- [ ] Error handling for non-existent promptKey (404)

**Dependencies**: Task 4.3, Task 10.1

---

### Task 10.3: Implement Form Fields and Validation
**Objective**: Build all form fields with validation.

**Deliverables**:
- Form fields in CreateVersionPage (reuse from CreatePromptPage)

**Definition of Done**:
- [ ] Prompt Key displayed as read-only text
- [ ] Model Name dropdown (required, pre-filled)
- [ ] Description textarea (optional, pre-filled)
- [ ] Tags input (optional, pre-filled)
- [ ] Content editor (required, pre-filled)
- [ ] Created By input (required)
- [ ] All validation rules applied
- [ ] Error messages display properly

**Dependencies**: Task 10.2, Task 5.6, Task 5.7

---

### Task 10.4: Implement Form Actions with Activation Option
**Objective**: Add submit options for inactive or active version creation.

**Deliverables**:
- Form action buttons with dual submission modes

**Definition of Done**:
- [ ] Cancel button navigates back with unsaved changes warning
- [ ] "Create as Inactive" button submits without activation
- [ ] "Create and Activate" button shows confirmation modal
- [ ] Confirmation modal warns: "This will deactivate the current active version"
- [ ] Both buttons disabled when form invalid or submitting
- [ ] Success: show toast, navigate to detail page
- [ ] Error handling: display error messages
- [ ] If "Create and Activate": call activateVersion API after creation

**Dependencies**: Task 10.3, Task 2.2, Task 3.2

---

## Phase 11: Version History Page

### Task 11.1: Create Version History Page Structure
**Objective**: Build the page component for viewing all versions.

**Deliverables**:
- `pages/VersionHistoryPage.tsx`
- Route configured in App.tsx

**Definition of Done**:
- [ ] File created with TypeScript
- [ ] Route "/prompts/:promptKey/versions" configured
- [ ] Page uses MainLayout component
- [ ] PageHeader with "Version History: {promptKey}" title
- [ ] Total versions count displayed
- [ ] "Create New Version" button
- [ ] Placeholder for version table
- [ ] promptKey extracted from URL params

**Dependencies**: Task 6.1, Task 6.2

---

### Task 11.2: Implement Version Table
**Objective**: Display all versions in table format.

**Deliverables**:
- Version table component in VersionHistoryPage

**Definition of Done**:
- [ ] Table/card layout responsive (table desktop, cards mobile)
- [ ] Columns: Status, Version, Created Date, Created By, Model, Description, Tags, Actions
- [ ] Status shows active badge or inactive indicator
- [ ] Active version row highlighted
- [ ] Created date formatted: "MMM DD, YYYY HH:MM AM/PM"
- [ ] Description truncated to 50 chars with tooltip
- [ ] Tags display first 2 + count
- [ ] Actions column with buttons:
  - View (modal)
  - Activate (disabled if already active)
  - Delete (disabled for active version)
- [ ] Proper spacing and styling

**Dependencies**: Task 11.1, Task 5.1

---

### Task 11.3: Implement Version Detail Modal
**Objective**: Create modal for viewing full version details.

**Deliverables**:
- Modal component for version details

**Definition of Done**:
- [ ] Modal opens on "View" action click
- [ ] Displays all version metadata
- [ ] Shows full description
- [ ] Displays all tags
- [ ] Shows content using MarkdownViewer
- [ ] Actions in modal:
  - Activate this version
  - Create new version based on this
  - Copy content
  - Close modal
- [ ] Accessible (focus trap, Escape to close)

**Dependencies**: Task 11.2, Task 5.5

---

### Task 11.4: Implement Activate Version Functionality
**Objective**: Add ability to activate any version.

**Deliverables**:
- Activation logic with confirmation

**Definition of Done**:
- [ ] Activate button triggers confirmation modal
- [ ] Confirmation shows: "Activate version {version}? This will deactivate the current active version."
- [ ] On confirm: call activateVersion API
- [ ] Success: show toast, refresh version list
- [ ] Error: display error banner
- [ ] UI updates to reflect new active version

**Dependencies**: Task 11.2, Task 2.2, Task 3.2

---

### Task 11.5: Implement Delete Version Functionality
**Objective**: Add ability to delete inactive versions.

**Deliverables**:
- Delete logic with confirmation

**Definition of Done**:
- [ ] Delete button only enabled for inactive versions
- [ ] Delete triggers confirmation modal
- [ ] Confirmation shows: "Delete version {version}? This action cannot be undone."
- [ ] On confirm: call deletePrompt API
- [ ] Success: show toast, refresh version list
- [ ] Error: display error banner

**Dependencies**: Task 11.2, Task 2.2, Task 3.2

---

### Task 11.6: Integrate API and State Management
**Objective**: Connect version history page to backend API.

**Deliverables**:
- Full integration with data fetching

**Definition of Done**:
- [ ] getPromptVersions API called on mount
- [ ] Loading state displays skeleton/spinner
- [ ] Error state displays ErrorBanner
- [ ] Data populates version table
- [ ] Table updates after activate/delete actions
- [ ] Optional: auto-refresh every 30 seconds

**Dependencies**: Task 11.2, Task 4.3

---

## Phase 12: Routing & Navigation

### Task 12.1: Configure All Routes
**Objective**: Set up complete routing structure in App.tsx.

**Deliverables**:
- Full React Router configuration

**Definition of Done**:
- [ ] All routes configured in App.tsx or router file:
  - / → PromptLibraryPage
  - /prompts/:promptKey → PromptDetailPage
  - /prompts/create → CreatePromptPage
  - /prompts/:promptKey/edit → CreateVersionPage
  - /prompts/:promptKey/versions → VersionHistoryPage
- [ ] 404 Not Found route configured
- [ ] MainLayout wraps all routes
- [ ] Navigation between pages works correctly
- [ ] URL parameters properly extracted

**Dependencies**: All page components (Tasks 7.1, 8.1, 9.1, 10.1, 11.1)

---

### Task 12.2: Implement URL Query Parameter Management
**Objective**: Sync filters and pagination with URL query params.

**Deliverables**:
- Query parameter utilities and integration

**Definition of Done**:
- [ ] Utility functions for reading/writing URL params
- [ ] Filter state synced with URL on library page
- [ ] Pagination state synced with URL
- [ ] Browser back/forward buttons work correctly
- [ ] Page state restored from URL on refresh
- [ ] Deep linking to filtered views works

**Dependencies**: Task 12.1, Task 7.2, Task 7.4

---

## Phase 13: Error Handling & Edge Cases

### Task 13.1: Implement Global Error Boundary
**Objective**: Catch and handle React errors gracefully.

**Deliverables**:
- `components/common/ErrorBoundary.tsx`

**Definition of Done**:
- [ ] ErrorBoundary component created
- [ ] Wraps App component in main.tsx
- [ ] Displays friendly error page on crash
- [ ] Logs errors to console
- [ ] "Reload page" button provided
- [ ] Accessible and styled

**Dependencies**: Task 1.3

---

### Task 13.2: Handle Loading States Across App
**Objective**: Ensure consistent loading indicators everywhere.

**Deliverables**:
- Loading states in all pages and components

**Definition of Done**:
- [ ] Skeleton screens on library page during fetch
- [ ] Skeleton screens on detail page during fetch
- [ ] Spinner on form submission buttons
- [ ] Loading state in version table
- [ ] Loading state in pagination controls
- [ ] No flashing/jumping during load

**Dependencies**: Task 5.2, all page tasks

---

### Task 13.3: Handle API Errors Consistently
**Objective**: Implement unified error handling strategy.

**Deliverables**:
- Error handling in all API calls

**Definition of Done**:
- [ ] 400 errors show field-specific messages in forms
- [ ] 404 errors show "Not found" message or redirect
- [ ] 409 errors show conflict message (e.g., "Prompt key already exists")
- [ ] 500 errors show generic error with retry button
- [ ] Network errors show "Connection error" with retry
- [ ] All errors use ErrorBanner or toast from NotificationContext
- [ ] Error messages are user-friendly

**Dependencies**: Task 2.2, Task 3.2, Task 5.3

---

### Task 13.4: Implement Empty States
**Objective**: Handle scenarios with no data.

**Deliverables**:
- Empty state components/messages

**Definition of Done**:
- [ ] Library page empty state: "No prompts found" with create button
- [ ] Filtered library empty state: "No results" with clear filters button
- [ ] Version history empty state (edge case)
- [ ] No description: "No description provided"
- [ ] No tags: "No tags"
- [ ] Empty states include helpful icons/illustrations
- [ ] Consistent styling across all empty states

**Dependencies**: All page tasks

---

### Task 13.5: Handle Deleted Prompts
**Objective**: Display appropriate message for soft-deleted prompts.

**Deliverables**:
- Deleted prompt detection and display

**Definition of Done**:
- [ ] Detail page checks deleted_at field
- [ ] If deleted: show banner "This prompt has been deleted"
- [ ] Actions disabled for deleted prompts
- [ ] Deleted prompts not shown in library (API filter)
- [ ] Graceful handling if deleted version accessed directly

**Dependencies**: Task 8.1

---

## Phase 14: Responsive Design & Mobile

### Task 14.1: Implement Responsive Library Page
**Objective**: Ensure library page works on all screen sizes.

**Deliverables**:
- Responsive styles for PromptLibraryPage

**Definition of Done**:
- [ ] Grid changes to 1 column on mobile (< 768px)
- [ ] Filter bar becomes collapsible drawer on mobile
- [ ] Cards stack properly on small screens
- [ ] Pagination controls stack vertically on mobile
- [ ] Touch targets at least 44px
- [ ] No horizontal scrolling

**Dependencies**: Task 7.1

---

### Task 14.2: Implement Responsive Detail Page
**Objective**: Ensure detail page works on mobile.

**Deliverables**:
- Responsive styles for PromptDetailPage

**Definition of Done**:
- [ ] Metadata grid stacks vertically on mobile
- [ ] Content viewer scrolls properly
- [ ] Actions dropdown accessible on mobile
- [ ] Version history table becomes cards on mobile
- [ ] All buttons and links easily tappable
- [ ] No horizontal scrolling

**Dependencies**: Task 8.1

---

### Task 14.3: Implement Responsive Forms
**Objective**: Ensure forms work on mobile devices.

**Deliverables**:
- Responsive styles for all forms

**Definition of Done**:
- [ ] Form fields full-width on mobile
- [ ] Markdown editor stacks (not side-by-side) on mobile
- [ ] Toggle between edit/preview modes on mobile
- [ ] Form buttons stack vertically on mobile
- [ ] Virtual keyboard doesn't break layout
- [ ] Form scrolls properly on mobile

**Dependencies**: Task 9.1, Task 10.1

---

### Task 14.4: Implement Touch Interactions
**Objective**: Optimize for touch devices.

**Deliverables**:
- Touch-friendly interactions

**Definition of Done**:
- [ ] Swipe gestures for card actions (optional)
- [ ] Pull-to-refresh on list views (optional)
- [ ] Touch feedback on all interactive elements
- [ ] No hover-only interactions
- [ ] Dropdowns work on touch devices
- [ ] Modals closeable on mobile

**Dependencies**: All component tasks

---

## Phase 15: Accessibility (a11y)

### Task 15.1: Implement Keyboard Navigation
**Objective**: Ensure full keyboard accessibility.

**Deliverables**:
- Keyboard support across all components

**Definition of Done**:
- [ ] All interactive elements focusable via Tab
- [ ] Logical tab order throughout app
- [ ] Escape closes modals and dropdowns
- [ ] Enter submits forms
- [ ] Arrow keys navigate lists/dropdowns
- [ ] Focus visible (outline/ring) on all elements
- [ ] No keyboard traps

**Dependencies**: All component tasks

---

### Task 15.2: Add ARIA Labels and Roles
**Objective**: Ensure screen reader compatibility.

**Deliverables**:
- ARIA attributes on all components

**Definition of Done**:
- [ ] All form inputs have associated labels (aria-label or label element)
- [ ] Buttons have descriptive aria-labels
- [ ] Error messages linked via aria-describedby
- [ ] Modals have role="dialog" and aria-modal="true"
- [ ] Loading states announced via aria-live
- [ ] Navigation landmarks (nav, main, header)
- [ ] Screen reader tested (VoiceOver/NVDA)

**Dependencies**: All component tasks

---

### Task 15.3: Ensure Color Contrast
**Objective**: Meet WCAG 2.1 AA contrast requirements.

**Deliverables**:
- Color audit and fixes

**Definition of Done**:
- [ ] All text has 4.5:1 contrast ratio minimum
- [ ] Interactive elements distinguishable without color alone
- [ ] Status indicators use icons + color
- [ ] Error messages use icons + color
- [ ] Link text underlined or otherwise indicated
- [ ] Focus indicators have sufficient contrast
- [ ] Tested with color contrast tools

**Dependencies**: All component tasks

---

### Task 15.4: Implement Focus Management
**Objective**: Proper focus handling in dynamic UIs.

**Deliverables**:
- Focus management logic

**Definition of Done**:
- [ ] Focus moves to modal when opened
- [ ] Focus returns to trigger when modal closed
- [ ] Focus trap within modals
- [ ] Focus moves to error message on validation failure
- [ ] Focus moves to first field on page load
- [ ] Focus doesn't jump unexpectedly during interactions

**Dependencies**: Task 5.4, all modal components

---

## Phase 16: Performance Optimization

### Task 16.1: Implement Code Splitting
**Objective**: Reduce initial bundle size.

**Deliverables**:
- Route-based and component-based code splitting

**Definition of Done**:
- [ ] All pages lazy-loaded via React.lazy()
- [ ] Markdown editor lazy-loaded
- [ ] Modal components lazy-loaded
- [ ] Suspense boundaries with loading fallbacks
- [ ] Bundle size < 500KB (initial)
- [ ] Verified with build analysis (webpack-bundle-analyzer or similar)

**Dependencies**: All page and heavy component tasks

---

### Task 16.2: Implement Caching Strategy
**Objective**: Reduce redundant API calls.

**Deliverables**:
- Cache logic in PromptsContext

**Definition of Done**:
- [ ] API responses cached in context (5 minutes TTL)
- [ ] Cache invalidated on create/update/delete operations
- [ ] User preferences saved to localStorage
- [ ] Filter state persisted across sessions
- [ ] Cache keys properly scoped
- [ ] Stale data handled gracefully

**Dependencies**: Task 3.1

---

### Task 16.3: Optimize Re-renders
**Objective**: Minimize unnecessary component re-renders.

**Deliverables**:
- Performance optimizations using React.memo, useMemo, useCallback

**Definition of Done**:
- [ ] React.memo applied to PromptCard, FilterBar, PaginationControls
- [ ] useMemo for derived state (filtered lists, calculations)
- [ ] useCallback for event handlers passed to children
- [ ] Context split if necessary (avoid full app re-renders)
- [ ] React DevTools Profiler shows improved performance
- [ ] No unnecessary re-renders on list scroll

**Dependencies**: All component tasks

---

### Task 16.4: Implement Virtual Scrolling (Optional)
**Objective**: Handle large lists (100+ items) efficiently.

**Deliverables**:
- Virtual scrolling for prompt list (if needed)

**Definition of Done**:
- [ ] Virtual scrolling library integrated (react-window or react-virtualized)
- [ ] Library page uses virtual list for 100+ prompts
- [ ] Scrolling remains smooth
- [ ] Item height calculated properly
- [ ] No layout shift during scroll

**Dependencies**: Task 7.3

---

## Phase 17: Build & Deployment Preparation

### Task 17.1: Configure Environment Variables
**Objective**: Set up environment-specific configurations.

**Deliverables**:
- Environment variable files

**Definition of Done**:
- [ ] `.env.example` file with all required variables
- [ ] `.env.development` for local development
- [ ] `.env.production` template for production
- [ ] Variables: VITE_API_BASE_URL, VITE_APP_VERSION
- [ ] Variables properly loaded in Vite config
- [ ] README updated with environment setup instructions

**Dependencies**: Task 1.1

---

### Task 17.2: Configure Build for Production
**Objective**: Optimize build configuration.

**Deliverables**:
- Production-ready build config

**Definition of Done**:
- [ ] Vite build configuration optimized
- [ ] Minification enabled
- [ ] Tree shaking enabled
- [ ] Source maps generated for production
- [ ] Compression configured (gzip/brotli)
- [ ] Build output < 500KB (initial bundle)
- [ ] `npm run build` executes successfully
- [ ] Preview command works (`npm run preview`)

**Dependencies**: Task 1.2

---

### Task 17.3: Create Deployment Documentation
**Objective**: Document deployment process.

**Deliverables**:
- Deployment guide in README or separate doc

**Definition of Done**:
- [ ] Build instructions documented
- [ ] Environment variable setup documented
- [ ] Deployment checklist provided
- [ ] Integration with backend documented (API base URL)
- [ ] Browser compatibility listed
- [ ] Common issues and troubleshooting section

**Dependencies**: Task 17.2

---

## Phase 18: Documentation & Polish

### Task 18.1: Write Developer Documentation
**Objective**: Document code structure and architecture.

**Deliverables**:
- Developer documentation files

**Definition of Done**:
- [ ] README.md updated with:
  - Project overview
  - Setup instructions
  - Available scripts
  - Folder structure explanation
  - Technology stack
- [ ] CONTRIBUTING.md with development guidelines
- [ ] JSDoc comments on complex functions
- [ ] Inline comments for non-obvious logic

**Dependencies**: All tasks

---

### Task 18.2: Create Component Storybook (Optional)
**Objective**: Document and showcase UI components.

**Deliverables**:
- Storybook setup with component stories

**Definition of Done**:
- [ ] Storybook configured
- [ ] Stories for all common components
- [ ] Interactive controls for props
- [ ] Documentation for each component
- [ ] Accessible via `npm run storybook`

**Dependencies**: All common component tasks (Phase 5)

---

### Task 18.3: Final UI Polish
**Objective**: Refine visual design and animations.

**Deliverables**:
- Visual improvements and animations

**Definition of Done**:
- [ ] Consistent spacing and padding throughout
- [ ] Smooth transitions on all interactive elements
- [ ] Hover effects on buttons and cards
- [ ] Loading animations smooth and branded
- [ ] Empty states include illustrations/icons
- [ ] Success/error feedback clear and timely
- [ ] Overall design cohesive and polished

**Dependencies**: All UI component tasks

---

### Task 18.4: Cross-browser Testing
**Objective**: Ensure compatibility across browsers.

**Deliverables**:
- Testing report and fixes

**Definition of Done**:
- [ ] App tested in Chrome (latest)
- [ ] App tested in Firefox (latest)
- [ ] App tested in Safari (latest)
- [ ] App tested in Edge (latest)
- [ ] Mobile tested in iOS Safari
- [ ] Mobile tested in Chrome Android
- [ ] All critical bugs fixed
- [ ] Known issues documented

**Dependencies**: All tasks

---

## Summary

**Total Tasks**: 73 tasks across 18 phases

**Estimated Timeline**: 
- Phase 1-3 (Setup & Core): 1 week
- Phase 4-6 (Hooks & Components): 1 week
- Phase 7-11 (Pages): 3 weeks
- Phase 12-15 (Routing, Errors, Responsive, a11y): 1 week
- Phase 16-18 (Optimization, Build, Polish): 1 week

**Total Estimate**: 7 weeks for single developer

**Key Dependencies**:
- Phase 1 must complete before all others
- Phase 2-3 must complete before page development
- Phase 5 (common components) needed for most pages
- Phase 12 (routing) depends on all pages
- Phase 16-18 are final polish phases

---

## Task Tracking Template

For each task, track progress using:

```
Task ID: X.Y
Status: ☐ Not Started | ⏳ In Progress | ✅ Complete
Assignee: 
Start Date:
Completion Date:
Blockers:
Notes:
```

---

**Document Status**: Ready for Implementation
**Last Updated**: November 17, 2025
