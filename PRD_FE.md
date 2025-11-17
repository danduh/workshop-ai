# Product Requirements Document (PRD)
## System Prompt Management Frontend Application

---

## 1. Overview

### 1.1 Purpose
This document defines the requirements for a React-based frontend application that provides a user interface for managing versioned system prompts used by AI tools. The application will consume the REST API endpoints defined in the backend service.

### 1.2 Scope
Phase 1 implementation focusing on core prompt management functionality without authentication/authorization features.

### 1.3 Tech Stack
- **Framework**: React 18+ with TypeScript
- **State Management**: React Context API + Hooks
- **Routing**: React Router v6
- **HTTP Client**: Axios or Fetch API
- **UI Components**: Modern component library (Material-UI, Ant Design, or similar)
- **Markdown Editor**: React-based markdown editor with preview
- **Styling**: CSS Modules or Styled Components
- **Build Tool**: Vite or Webpack
- **Testing**: Jest + React Testing Library

### 1.4 API Base URL
```
Base URL: /api
```

---

## 2. Application Architecture

### 2.1 Folder Structure
```
src/
├── components/
│   ├── common/          # Reusable UI components
│   ├── layout/          # Layout components
│   └── prompts/         # Prompt-specific components
├── contexts/            # React Context providers
├── hooks/               # Custom React hooks
├── pages/               # Page components
├── services/            # API service layer
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── App.tsx              # Main application component
```

### 2.2 State Management Strategy
- **Global State**: Prompt list, filters, user preferences (via Context)
- **Local State**: Form inputs, UI toggles, modals
- **Server State**: API data caching and synchronization

### 2.3 Routing Structure
```
/                          → Prompt Library (Home)
/prompts/:promptKey        → Prompt Detail View
/prompts/create            → Create New Prompt
/prompts/:promptKey/edit   → Edit/Create Version
```

---

## 3. Core Components & Types

### 3.1 TypeScript Interfaces

```typescript
interface Prompt {
  id: string;
  prompt_key: string;
  version: string;
  is_active: boolean;
  date_creation: string;
  model_name: string;
  content: string;
  description?: string;
  tags?: string[];
  created_by: string;
  deleted_at?: string | null;
}

interface PaginatedResponse {
  data: Prompt[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface CreatePromptDto {
  prompt_key: string;
  model_name: string;
  content: string;
  description?: string;
  tags?: string[];
  created_by: string;
}

interface CreateVersionDto {
  model_name: string;
  content: string;
  description?: string;
  tags?: string[];
  created_by: string;
}

interface FilterOptions {
  model_name?: string;
  tags?: string[];
  page?: number;
  limit?: number;
}
```

### 3.2 API Service Layer

```typescript
class PromptService {
  // GET /api/prompts
  getPrompts(filters?: FilterOptions): Promise<PaginatedResponse>
  
  // GET /api/prompts/{promptKey}
  getPromptByKey(promptKey: string): Promise<Prompt>
  
  // GET /api/prompts/{promptKey}/versions
  getPromptVersions(promptKey: string): Promise<Prompt[]>
  
  // POST /api/prompts
  createPrompt(data: CreatePromptDto): Promise<Prompt>
  
  // POST /api/prompts/{promptKey}/versions
  createVersion(promptKey: string, data: CreateVersionDto): Promise<Prompt>
  
  // PATCH /api/prompts/{promptKey}/activate/{version}
  activateVersion(promptKey: string, version: string): Promise<Prompt>
  
  // DELETE /api/prompts/{id}
  deletePrompt(id: string): Promise<void>
}
```

---

## 4. View: Prompt Library (Home Page)

### 4.1 Route
```
Path: /
Component: PromptLibraryPage
```

### 4.2 Purpose
Main landing page displaying all prompt families with search, filter, and pagination capabilities.

### 4.3 Layout Components

#### 4.3.1 Page Header
- **Application Title**: "System Prompt Management"
- **Create Button**: Primary action button to create new prompt
  - Label: "Create New Prompt"
  - Action: Navigate to `/prompts/create`
  - Style: Prominent primary button

#### 4.3.2 Filter Bar
**Position**: Below header, full-width
**Components**:
1. **Search Input**
   - Placeholder: "Search by prompt key or description..."
   - Real-time search (debounced, 300ms)
   - Clear button when text present

2. **Model Filter Dropdown**
   - Label: "Model"
   - Options: Dynamic list from available models
   - Multi-select capability
   - Default: "All Models"

3. **Tags Filter**
   - Label: "Tags"
   - Type: Multi-select dropdown
   - Options: Aggregate all unique tags from prompts
   - Display selected tags as chips

4. **Clear Filters Button**
   - Label: "Clear All"
   - Action: Reset all filters to default
   - Visibility: Only shown when filters active

#### 4.3.3 Prompt Cards Grid
**Layout**: Responsive grid (3 columns desktop, 2 tablet, 1 mobile)

**Card Structure**:
```
┌─────────────────────────────────────┐
│ [Active Badge]          [Model Chip]│
│                                      │
│ Prompt Key (Title)                   │
│ Description (2 lines max)            │
│                                      │
│ [Tag1] [Tag2] [Tag3]                │
│                                      │
│ Version: v1.0.0 | Created: Nov 17   │
│ By: user@example.com                 │
│                                      │
│ [View Details] [Quick Actions ▼]    │
└─────────────────────────────────────┘
```

**Card Elements**:
1. **Active Badge**
   - Visibility: Only on active prompts
   - Text: "ACTIVE"
   - Style: Green badge, top-left

2. **Model Chip**
   - Text: Model name (e.g., "GPT-4")
   - Style: Small chip, top-right
   - Color: Unique per model type

3. **Prompt Key**
   - Text: prompt_key value
   - Style: Bold, large font (H3)
   - Clickable: Navigate to detail view

4. **Description**
   - Text: description field (truncated)
   - Max lines: 2
   - Tooltip: Full description on hover

5. **Tags**
   - Display: First 3 tags as chips
   - "+N more" indicator if more tags exist
   - Click: Add tag to filter

6. **Metadata Line**
   - Version number
   - Creation date (relative: "2 days ago")
   - Created by username

7. **Action Buttons**
   - Primary: "View Details" → Navigate to detail
   - Secondary: Dropdown menu
     - Create New Version
     - Copy Prompt Key
     - View All Versions

#### 4.3.4 Empty State
**Condition**: No prompts match filters or database empty
**Display**:
- Icon: Large prompt/document icon
- Message: "No prompts found"
- Suggestion: "Create your first prompt to get started"
- Action: "Create Prompt" button

#### 4.3.5 Pagination Controls
**Position**: Bottom of page, centered
**Components**:
- Page number display: "Page X of Y"
- Previous/Next buttons
- Page size selector: 10, 25, 50, 100 items
- Jump to page input

### 4.4 State Management

```typescript
interface LibraryState {
  prompts: PaginatedResponse | null;
  filters: FilterOptions;
  loading: boolean;
  error: string | null;
}
```

### 4.5 API Integration
- **Endpoint**: `GET /api/prompts`
- **Query Parameters**: model_name, tags, page, limit
- **Trigger**: Component mount, filter changes, pagination changes
- **Debounce**: Search input (300ms)
- **Loading State**: Show skeleton cards during fetch
- **Error Handling**: Display error banner with retry option

### 4.6 User Interactions
1. **Filter Change**: Update URL params, fetch new data
2. **Pagination**: Update page/limit, fetch new data
3. **Search**: Debounced filter update
4. **Card Click**: Navigate to detail view
5. **Create Button**: Navigate to create form
6. **Tag Click**: Add tag to active filters

### 4.7 Performance Considerations
- Implement virtual scrolling for large lists (100+ items)
- Cache fetched data in context
- Prefetch next page on pagination hover
- Optimize re-renders with React.memo

---

## 5. View: Prompt Detail Page

### 5.1 Route
```
Path: /prompts/:promptKey
Component: PromptDetailPage
```

### 5.2 Purpose
Display comprehensive information about a specific prompt family, including the active version and access to version history.

### 5.3 Layout Components

#### 5.3.1 Page Header
**Structure**:
```
← Back to Library                    [Actions Dropdown ▼]

Prompt Key: my-prompt-key
[ACTIVE BADGE] [Model: GPT-4]
```

**Elements**:
1. **Back Navigation**
   - Icon: Left arrow
   - Text: "Back to Library"
   - Action: Navigate to `/`

2. **Actions Dropdown** (Top-right)
   - Create New Version
   - View All Versions
   - Copy Prompt Key
   - Copy Content
   - Delete Prompt (if not active)

3. **Prompt Key Title**
   - Text: prompt_key value
   - Style: H1, prominent

4. **Status Indicators**
   - Active badge (green, if is_active = true)
   - Model chip (colored)

#### 5.3.2 Metadata Section
**Layout**: Horizontal grid

```
Version: v1.0.0          Created: Nov 17, 2025 10:00 AM
Created By: user@example.com    Last Modified: Nov 17, 2025 2:30 PM
```

**Fields**:
- Version number (large, bold)
- Creation timestamp (formatted: "MMM DD, YYYY HH:MM AM/PM")
- Creator username/email
- Last modified date (if different from creation)

#### 5.3.3 Description Section
**Label**: "Description"
**Content**: description field value
**Style**: Regular text, paragraph format
**Empty State**: "No description provided"

#### 5.3.4 Tags Section
**Label**: "Tags"
**Display**: Chips/badges with consistent styling
**Empty State**: "No tags"
**Interaction**: Click to filter library by tag (navigate to home with filter)

#### 5.3.5 Content Viewer
**Label**: "Prompt Content"
**Component**: Markdown viewer/renderer
**Features**:
- Syntax highlighting for code blocks
- Proper markdown formatting (headers, lists, links)
- Copy button (top-right of content box)
- Word/character count display
- Collapsible sections for long content

**Styling**:
- Border/box to separate from rest of page
- Monospace font for code
- Readable line height and spacing
- Max-width for readability

#### 5.3.6 Version History Preview
**Label**: "Recent Versions"
**Display**: Table or list of last 5 versions

**Columns**:
- Version number
- Status (Active/Inactive)
- Created date
- Created by
- Actions (View, Activate)

**Footer**: "View All Versions" button → Navigate to version history view

### 5.4 State Management

```typescript
interface DetailState {
  prompt: Prompt | null;
  recentVersions: Prompt[];
  loading: boolean;
  error: string | null;
}
```

### 5.5 API Integration
- **Primary Endpoint**: `GET /api/prompts/{promptKey}`
- **Secondary Endpoint**: `GET /api/prompts/{promptKey}/versions` (limit 5)
- **Trigger**: Component mount, promptKey change
- **Loading State**: Show skeleton screens
- **Error Handling**: 404 → "Prompt not found" page

### 5.6 User Interactions
1. **Create New Version**: Navigate to create version form
2. **View All Versions**: Navigate to version history page
3. **Copy Actions**: Copy to clipboard with success toast
4. **Delete Prompt**: 
   - Show confirmation modal
   - Only enabled if is_active = false
   - Success: Navigate back to library
5. **Activate Version**: Open confirmation modal
6. **Tag Click**: Navigate to library with tag filter

### 5.7 Edge Cases
- **Deleted Prompt**: Show "This prompt has been deleted" banner
- **No Active Version**: Highlight that no version is active
- **Loading States**: Skeleton screens for content areas
- **Network Errors**: Retry mechanism with error display

---

## 6. View: Create Prompt Form

### 6.1 Route
```
Path: /prompts/create
Component: CreatePromptPage
```

### 6.2 Purpose
Form for creating a new prompt family with its initial version.

### 6.3 Layout Components

#### 6.3.1 Page Header
```
← Cancel                System Prompt Management

Create New Prompt
```

**Elements**:
- Cancel link (top-left) → Navigate back
- Page title: "Create New Prompt"

#### 6.3.2 Form Layout
**Style**: Centered form, max-width 800px, card/panel style

**Form Fields**:

1. **Prompt Key** (Required)
   - Label: "Prompt Key"
   - Type: Text input
   - Placeholder: "my-prompt-key"
   - Help text: "Unique identifier using lowercase letters, numbers, hyphens, and underscores"
   - Validation:
     - Required
     - Max length: 255
     - Pattern: /^[a-z0-9_-]+$/
     - Real-time validation feedback
   - Error messages:
     - "Prompt key is required"
     - "Only lowercase letters, numbers, hyphens, and underscores allowed"
     - "Prompt key already exists" (API error)

2. **Model Name** (Required)
   - Label: "Target Model"
   - Type: Dropdown/Select
   - Options: 
     - GPT-4
     - GPT-4o
     - Claude-3.5-Sonnet
     - Claude-3-Opus
     - Gemini-Pro
     - Custom (text input)
   - Help text: "AI model this prompt is designed for"
   - Validation: Required, max 100 characters

3. **Description** (Optional)
   - Label: "Description"
   - Type: Textarea
   - Rows: 3
   - Placeholder: "Describe the purpose of this prompt..."
   - Character counter: Show remaining characters
   - Help text: "Human-readable description of the prompt's purpose"

4. **Tags** (Optional)
   - Label: "Tags"
   - Type: Multi-input chip component
   - Placeholder: "Add tag and press Enter"
   - Features:
     - Add tag on Enter key
     - Remove tag by clicking X on chip
     - Autocomplete from existing tags
     - Prevent duplicates
   - Help text: "Add tags for categorization and filtering"

5. **Content** (Required)
   - Label: "Prompt Content"
   - Type: Markdown editor
   - Features:
     - Rich text toolbar (bold, italic, headers, lists, code)
     - Split view: Editor | Preview
     - Tab support
     - Line numbers
     - Character/word count
   - Placeholder: "Enter your prompt content here. Markdown is supported..."
   - Validation: Required
   - Help text: "The actual prompt text. Supports Markdown formatting."

6. **Created By** (Required)
   - Label: "Created By"
   - Type: Text input
   - Placeholder: "user@example.com"
   - Help text: "Your email or username"
   - Validation: Required, max 255 characters
   - Default: Pre-filled from user context if available

#### 6.3.3 Form Actions
**Position**: Bottom of form, right-aligned

**Buttons**:
1. **Cancel** (Secondary)
   - Action: Show unsaved changes warning if form dirty
   - Navigate back to library

2. **Create Prompt** (Primary)
   - Action: Submit form
   - Disabled: If form invalid or submitting
   - Loading state: Show spinner when submitting

#### 6.3.4 Validation Feedback
- Real-time validation on blur
- Inline error messages below fields
- Error summary at top if submission fails
- Success indicators (green checkmark) for valid fields

### 6.4 State Management

```typescript
interface CreateFormState {
  formData: CreatePromptDto;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  submitting: boolean;
  isDirty: boolean;
}
```

### 6.5 API Integration
- **Endpoint**: `POST /api/prompts`
- **Request Body**: CreatePromptDto
- **Success**: 
  - Show success toast: "Prompt created successfully"
  - Navigate to prompt detail page: `/prompts/{promptKey}`
- **Error Handling**:
  - 400: Display validation errors
  - 409: "Prompt key already exists"
  - 500: "Server error. Please try again."

### 6.6 User Interactions
1. **Form Input**: Update form state, validate on blur
2. **Tag Management**: Add/remove tags dynamically
3. **Markdown Preview**: Toggle between edit/preview modes
4. **Cancel**: Show confirmation if form has unsaved changes
5. **Submit**: Validate all fields, show errors or submit

### 6.7 Validation Rules
- **Client-side**: Immediate feedback for format/length
- **Server-side**: Handle uniqueness constraints and business logic
- **Required Fields**: prompt_key, model_name, content, created_by

### 6.8 Accessibility
- Proper label associations
- ARIA attributes for error messages
- Keyboard navigation support
- Focus management on validation errors

---

## 7. View: Create Version Form

### 7.1 Route
```
Path: /prompts/:promptKey/edit
Component: CreateVersionPage
```

### 7.2 Purpose
Form for creating a new version of an existing prompt family.

### 7.3 Layout Components

#### 7.3.1 Page Header
```
← Back to Prompt                System Prompt Management

Create New Version: my-prompt-key
Current Active Version: v1.0.0
```

**Elements**:
- Back navigation → Return to prompt detail
- Title: "Create New Version: {promptKey}"
- Info banner: Display current active version

#### 7.3.2 Version Information Banner
**Style**: Info box, light blue background

**Content**:
- "Creating version v2.0.0 (auto-generated based on timestamp)"
- "The new version will be inactive by default"
- Link to view all versions

#### 7.3.3 Form Layout
**Style**: Same as Create Prompt form

**Form Fields**:

1. **Prompt Key** (Read-only)
   - Label: "Prompt Key"
   - Value: {promptKey} from URL
   - Style: Disabled input or plain text display
   - Help text: "Cannot be changed for new versions"

2. **Model Name** (Required)
   - Same as Create Prompt form
   - Pre-filled: Copy from current active version

3. **Description** (Optional)
   - Same as Create Prompt form
   - Pre-filled: Copy from current active version

4. **Tags** (Optional)
   - Same as Create Prompt form
   - Pre-filled: Copy from current active version

5. **Content** (Required)
   - Same as Create Prompt form
   - Pre-filled: Copy from current active version
   - Help text: "Modify the prompt content for the new version"

6. **Created By** (Required)
   - Same as Create Prompt form

#### 7.3.4 Side-by-Side Comparison (Optional Enhancement)
**Toggle**: "Show comparison with active version"
**Layout**: Split screen showing:
- Left: Current active version content
- Right: New version content (editable)
- Highlight differences in real-time

#### 7.3.5 Form Actions
**Buttons**:
1. **Cancel** (Secondary)
   - Action: Confirm unsaved changes, navigate back

2. **Create as Inactive** (Secondary)
   - Action: Submit form, keep is_active = false
   - Success: Navigate to detail page

3. **Create and Activate** (Primary)
   - Action: Submit form + call activate endpoint
   - Warning modal: "This will deactivate the current active version"
   - Success: Navigate to detail page

### 7.4 State Management

```typescript
interface VersionFormState {
  promptKey: string;
  currentVersion: Prompt | null;
  formData: CreateVersionDto;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  submitting: boolean;
  activateOnCreate: boolean;
}
```

### 7.5 API Integration
- **Load Current Version**: `GET /api/prompts/{promptKey}`
- **Create Version**: `POST /api/prompts/{promptKey}/versions`
- **Activate (Optional)**: `PATCH /api/prompts/{promptKey}/activate/{version}`
- **Success**: Navigate to `/prompts/{promptKey}`
- **Error Handling**: Same as Create Prompt form

### 7.6 User Interactions
1. **Form Pre-fill**: Load current active version data
2. **Content Editing**: Modify markdown content
3. **Comparison Toggle**: Show/hide side-by-side view
4. **Submit Options**: Choose between inactive/active creation
5. **Activation Warning**: Confirm before activating new version

### 7.7 Validation Rules
- Same as Create Prompt form
- Additional: Validate that promptKey exists (404 handling)

---

## 8. View: Version History Page

### 8.1 Route
```
Path: /prompts/:promptKey/versions
Component: VersionHistoryPage
```

### 8.2 Purpose
Display all versions of a prompt family with comparison and activation capabilities.

### 8.3 Layout Components

#### 8.3.1 Page Header
```
← Back to Prompt

Version History: my-prompt-key
Total Versions: 5                    [Create New Version]
```

**Elements**:
- Back navigation
- Title with prompt key
- Version count
- Create version button

#### 8.3.2 Version List/Table
**Layout**: Table or card-based timeline

**Table Columns**:
1. **Status** (Icon)
   - Active: Green checkmark badge
   - Inactive: Gray circle

2. **Version**
   - Text: Version string
   - Style: Bold if active

3. **Created Date**
   - Format: "MMM DD, YYYY HH:MM AM/PM"
   - Relative time on hover: "2 days ago"

4. **Created By**
   - Username/email

5. **Model**
   - Model name chip

6. **Description**
   - Truncated to 50 chars
   - Tooltip with full text

7. **Tags**
   - First 2 tags + count

8. **Actions**
   - View: Open version detail modal
   - Activate: Enable this version (disabled if already active)
   - Compare: Select for comparison
   - Delete: Only for inactive versions

#### 8.3.3 Version Comparison Panel
**Trigger**: Click "Compare" on two versions

**Layout**: Split view at bottom or modal

**Features**:
- Side-by-side content comparison
- Highlighting of differences (diff view)
- Metadata comparison table
- Close/dismiss button

#### 8.3.4 Version Detail Modal
**Trigger**: Click "View" on a version

**Content**: Same as Prompt Detail page but for specific version

**Actions**:
- Activate this version
- Create new version based on this
- Copy content
- Close modal

### 8.4 State Management

```typescript
interface VersionHistoryState {
  promptKey: string;
  versions: Prompt[];
  selectedForComparison: string[];
  comparisonView: boolean;
  loading: boolean;
  error: string | null;
}
```

### 8.5 API Integration
- **Endpoint**: `GET /api/prompts/{promptKey}/versions`
- **Activate**: `PATCH /api/prompts/{promptKey}/activate/{version}`
- **Delete**: `DELETE /api/prompts/{id}`
- **Trigger**: Component mount
- **Polling**: Optional auto-refresh every 30s

### 8.6 User Interactions
1. **Sort/Filter**: By date, status, creator
2. **Select for Comparison**: Multi-select up to 2 versions
3. **Activate Version**: Confirm modal, update active status
4. **Delete Version**: Confirm modal, remove from list
5. **View Details**: Open modal with full version info
6. **Create from Version**: Navigate to create form with pre-fill

### 8.7 Version Comparison Algorithm
- Use diff library (e.g., diff-match-patch, react-diff-viewer)
- Highlight additions (green), deletions (red), changes (yellow)
- Line-by-line comparison for content

---

## 9. Common Components Library

### 9.1 PromptCard
**Purpose**: Reusable card for displaying prompt summary
**Props**: 
```typescript
interface PromptCardProps {
  prompt: Prompt;
  onView: (promptKey: string) => void;
  onCreateVersion?: (promptKey: string) => void;
  showActions?: boolean;
}
```

### 9.2 MarkdownEditor
**Purpose**: Unified markdown editor component
**Props**:
```typescript
interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}
```
**Features**: Split view, toolbar, preview

### 9.3 MarkdownViewer
**Purpose**: Render markdown content with syntax highlighting
**Props**:
```typescript
interface MarkdownViewerProps {
  content: string;
  showCopyButton?: boolean;
}
```

### 9.4 TagInput
**Purpose**: Multi-tag input component
**Props**:
```typescript
interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
}
```

### 9.5 ConfirmModal
**Purpose**: Reusable confirmation dialog
**Props**:
```typescript
interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
}
```

### 9.6 LoadingState
**Purpose**: Consistent loading indicators
**Variants**: Spinner, skeleton cards, skeleton text

### 9.7 ErrorBanner
**Purpose**: Display error messages
**Props**:
```typescript
interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}
```

### 9.8 StatusBadge
**Purpose**: Display active/inactive status
**Props**:
```typescript
interface StatusBadgeProps {
  isActive: boolean;
  size?: 'small' | 'medium' | 'large';
}
```

---

## 10. Context & State Management

### 10.1 PromptsContext
**Purpose**: Global state for prompts and filters

```typescript
interface PromptsContextValue {
  // State
  prompts: PaginatedResponse | null;
  filters: FilterOptions;
  loading: boolean;
  error: string | null;
  
  // Actions
  setFilters: (filters: FilterOptions) => void;
  refreshPrompts: () => Promise<void>;
  clearFilters: () => void;
}
```

### 10.2 NotificationContext
**Purpose**: Global toast/notification system

```typescript
interface NotificationContextValue {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
  showWarning: (message: string) => void;
}
```

### 10.3 UserContext (Future Phase)
**Purpose**: User authentication and preferences

```typescript
interface UserContextValue {
  user: {
    email: string;
    name: string;
  } | null;
  isAuthenticated: boolean;
}
```

---

## 11. Custom Hooks

### 11.1 usePrompts
**Purpose**: Fetch and manage prompts list
```typescript
function usePrompts(filters?: FilterOptions) {
  // Returns: { data, loading, error, refetch }
}
```

### 11.2 usePromptDetail
**Purpose**: Fetch single prompt details
```typescript
function usePromptDetail(promptKey: string) {
  // Returns: { prompt, versions, loading, error, refetch }
}
```

### 11.3 useDebounce
**Purpose**: Debounce values (for search)
```typescript
function useDebounce<T>(value: T, delay: number): T
```

### 11.4 useForm
**Purpose**: Form state management
```typescript
function useForm<T>(initialValues: T, validationSchema) {
  // Returns: { values, errors, touched, handleChange, handleSubmit, ... }
}
```

### 11.5 useConfirmation
**Purpose**: Confirmation dialog management
```typescript
function useConfirmation() {
  // Returns: { confirm, ConfirmDialog }
}
```

---

## 12. Error Handling Strategy

### 12.1 API Error Types
- **400 Bad Request**: Show field-specific errors
- **404 Not Found**: Redirect to error page or show "not found" state
- **409 Conflict**: Show specific conflict message
- **500 Server Error**: Show generic error with retry

### 12.2 Error Display
- **Form Errors**: Inline below fields
- **Page Errors**: Banner at top with retry option
- **Network Errors**: Toast notification
- **Validation Errors**: Real-time feedback

### 12.3 Retry Mechanism
- Automatic retry for network failures (3 attempts)
- Manual retry button for user-triggered actions
- Exponential backoff for automatic retries

---

## 13. Loading States

### 13.1 Page Load
- Skeleton screens matching content structure
- Spinner for smaller components
- Progressive loading: Show available data immediately

### 13.2 Action Feedback
- Button loading spinners
- Disabled state during submission
- Optimistic UI updates where appropriate

### 13.3 Pagination Loading
- Show loading indicator in pagination controls
- Preserve current data while fetching next page
- Smooth transitions between pages

---

## 14. Responsive Design

### 14.1 Breakpoints
```css
Mobile: < 768px
Tablet: 768px - 1024px
Desktop: > 1024px
```

### 14.2 Mobile Adaptations
- **Library**: Single column card layout
- **Filters**: Collapsible filter drawer
- **Forms**: Full-width inputs, stacked layout
- **Tables**: Card view instead of table
- **Markdown Editor**: Single view (toggle edit/preview)

### 14.3 Touch Interactions
- Larger tap targets (44px minimum)
- Swipe gestures for card actions
- Pull-to-refresh on list views

---

## 15. Performance Optimization

### 15.1 Code Splitting
- Route-based code splitting
- Lazy load heavy components (markdown editor)
- Dynamic imports for modals and dialogs

### 15.2 Caching Strategy
- Cache API responses in context (5 minutes)
- Local storage for user preferences
- Memoize expensive computations

### 15.3 Optimization Techniques
- React.memo for pure components
- useMemo for derived state
- useCallback for event handlers
- Virtual scrolling for long lists (100+ items)
- Debounce search inputs (300ms)
- Throttle scroll events

---

## 16. Accessibility (a11y)

### 16.1 WCAG 2.1 Level AA Compliance
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- ARIA labels and roles
- Color contrast ratios (4.5:1 minimum)

### 16.2 Keyboard Shortcuts
- `Ctrl/Cmd + N`: Create new prompt
- `Escape`: Close modals/dialogs
- `Tab`: Navigate between form fields
- `Enter`: Submit forms

### 16.3 Focus Management
- Focus trap in modals
- Focus restoration after modal close
- Clear focus indicators (outline/ring)
- Logical tab order

---

## 17. Testing Requirements

### 17.1 Unit Tests
- Component rendering tests
- Hook logic tests
- Utility function tests
- Form validation tests
- Target: 80% code coverage

### 17.2 Integration Tests
- API service layer tests
- Context provider tests
- Form submission flows
- Navigation flows

### 17.3 E2E Tests (Phase 2)
- Critical user paths:
  - Create prompt → View detail
  - Create version → Activate
  - Filter prompts → View results
  - Delete inactive prompt

### 17.4 Testing Tools
- Jest for unit tests
- React Testing Library for component tests
- MSW (Mock Service Worker) for API mocking
- Cypress for E2E (Phase 2)

---

## 18. Build & Deployment

### 18.1 Build Configuration
- Development: Source maps, hot reload
- Production: Minification, tree shaking, compression
- Environment variables: API base URL, feature flags

### 18.2 Environment Variables
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_VERSION=1.0.0
```

### 18.3 Deployment Checklist
- [ ] Run build with production config
- [ ] Verify environment variables
- [ ] Run production build locally
- [ ] Check bundle size (< 500KB initial)
- [ ] Verify all routes work
- [ ] Test error boundaries
- [ ] Validate API integration

---

## 19. Documentation Requirements

### 19.1 Code Documentation
- JSDoc comments for complex functions
- README for setup instructions
- Component prop documentation
- API service documentation

### 19.2 User Documentation (Phase 2)
- User guide for prompt management
- Video tutorials for key workflows
- FAQ section
- Troubleshooting guide

---

## 20. Success Metrics

### 20.1 Performance Metrics
- **Initial Load Time**: < 2 seconds
- **Time to Interactive**: < 3 seconds
- **API Response Rendering**: < 100ms
- **Bundle Size**: < 500KB (initial)
- **Lighthouse Score**: > 90

### 20.2 User Experience Metrics
- **Task Completion Rate**: > 95%
- **Error Rate**: < 2%
- **User Satisfaction**: > 4.5/5
- **Adoption Rate**: Track weekly active users

### 20.3 Technical Metrics
- **Test Coverage**: > 80%
- **Build Time**: < 2 minutes
- **Zero Critical Bugs**: At launch
- **Accessibility Score**: 100 (Lighthouse)

---

## 21. Future Enhancements (Phase 2)

### 21.1 Authentication & Authorization
- User login/logout
- Role-based permissions
- API key management

### 21.2 Advanced Features
- Prompt templates library
- Bulk operations (import/export)
- Prompt analytics dashboard
- Collaboration features (comments, reviews)
- Prompt testing/playground
- Integration with external tools

### 21.3 UI Enhancements
- Dark mode support
- Customizable themes
- Advanced filtering (date ranges, complex queries)
- Prompt favorites/bookmarks
- Recent prompts history

---

## 22. Development Workflow

### 22.1 Development Phases

**Phase 1: Core Infrastructure (Week 1)**
- Setup project structure
- Configure build tools
- Implement routing
- Create API service layer
- Setup state management

**Phase 2: Prompt Library (Week 2)**
- Implement library page
- Add filtering/pagination
- Create prompt cards
- Implement search

**Phase 3: Prompt Detail (Week 3)**
- Build detail page
- Add version history preview
- Implement copy/share features

**Phase 4: Create/Edit Forms (Week 4)**
- Create prompt form
- Create version form
- Markdown editor integration
- Form validation

**Phase 5: Version Management (Week 5)**
- Version history page
- Version comparison
- Activation workflow
- Delete functionality

**Phase 6: Polish & Testing (Week 6)**
- Error handling
- Loading states
- Responsive design
- Testing
- Bug fixes

### 22.2 Git Workflow
- Feature branches: `feature/prompt-library`
- Pull request reviews
- Automated CI/CD
- Semantic versioning

### 22.3 Code Standards
- ESLint + Prettier configuration
- TypeScript strict mode
- Component naming conventions
- Folder structure guidelines

---

## 23. Dependencies

### 23.1 Core Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "typescript": "^5.0.0"
}
```

### 23.2 UI Libraries
```json
{
  "@mui/material": "^5.14.0", // or "antd": "^5.11.0"
  "@emotion/react": "^11.11.0",
  "@emotion/styled": "^11.11.0"
}
```

### 23.3 Utilities
```json
{
  "axios": "^1.6.0",
  "date-fns": "^2.30.0",
  "react-markdown": "^9.0.0",
  "diff-match-patch": "^1.0.5"
}
```

### 23.4 Development Tools
```json
{
  "vite": "^5.0.0",
  "vitest": "^1.0.0",
  "@testing-library/react": "^14.1.0",
  "eslint": "^8.54.0",
  "prettier": "^3.1.0"
}
```

---

## 24. Appendix

### 24.1 Design System Reference
- Color palette
- Typography scale
- Spacing system
- Component variants

### 24.2 API Contract Summary
Reference `api.json` for complete API specification.

### 24.3 Glossary
- **Prompt Family**: Collection of all versions sharing a prompt_key
- **Active Version**: The version currently in use (is_active = true)
- **Version String**: Timestamp-based version identifier
- **Soft Delete**: Marking record as deleted without physical removal

---

## 25. Sign-off & Approval

This PRD defines the complete requirements for Phase 1 of the System Prompt Management Frontend Application. Implementation should follow this specification closely, with any deviations requiring stakeholder approval.

**Document Version**: 1.0
**Last Updated**: November 17, 2025
**Status**: Ready for Development
