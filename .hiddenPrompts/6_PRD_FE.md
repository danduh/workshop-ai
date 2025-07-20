## 1. Overview

### 1.1 Purpose
Develop a React-based frontend application for the System Prompt Management Service that provides a comprehensive web interface for managing versioned system prompts used by AI tools. The application will offer intuitive CRUD operations, version management, and filtering capabilities for prompt libraries.

### 1.2 Technical Stack
- **Framework**: React 18+ with TypeScript
- **UI Library**: React mui
- **State Management**: React Context API with custom hooks
- **Styling**: CSS Modules or tailwind
- **HTTP Client**: Axios
- **Build Tool**: RSPack, NX
- **Testing**: Jest + React Testing Library
- **Code Quality**: ESLint + Prettier

### 1.3 Core Objectives
- Provide intuitive prompt library management
- Enable efficient version control and comparison
- Implement comprehensive filtering and search capabilities
- Ensure responsive design for desktop and tablet usage
- Maintain type safety throughout the application

## 2. Architecture & Project Structure

### 2.1 Folder Structure
App location `packages/app`
```
src/
├── components/
│   ├── common/
│   ├── layout/
│   └── prompts/
├── pages/
├── hooks/
├── context/
├── services/
├── types/
├── utils/
└── styles/
```

### 2.2 State Management Strategy
- **Global State**: React Context for user preferences, theme, and shared data
- **Local State**: useState and useReducer for component-specific state
- **Server State**: Custom hooks for API data management no caching

## 3. User Interface Requirements

### 3.1 Design Principles
- Clean, modern interface with consistent spacing
- Intuitive navigation with clear visual hierarchy
- Responsive design (desktop-first approach)
- Accessibility compliance (WCAG 2.1 AA)
- Dark/light theme support

### 3.2 Common Components
- **Header**: Navigation, search bar, user info
- **Sidebar**: Quick filters, categories
- **Loading States**: Spinners, skeleton screens
- **Error Boundaries**: Graceful error handling
- **Modals**: For create/edit operations
- **Pagination**: For list views

## 4. Page Specifications

### 4.1 Prompt Library Page (/)

#### 4.1.1 Purpose
Main dashboard for browsing and managing all prompt families with advanced filtering and search capabilities.

#### 4.1.2 Layout Components
- **Header Section**
  - Page title: "Prompt Library"
  - "Create New Prompt" primary button
  - Global search input with debounced search
  
- **Filter Panel** (Left sidebar or collapsible)
  - Model Name filter (dropdown with checkboxes)
  - Tags filter (multi-select with autocomplete)
  - Active Status filter (All/Active/Inactive radio buttons)
  - Created By filter (searchable dropdown)
  - Date Range picker for creation date
  - Clear Filters button

- **Results Section**
  - Sort controls (dropdown): Date Created, Prompt Key, Version
  - Sort order toggle (ASC/DESC)
  - Results count display
  - Prompt cards grid/list view toggle

#### 4.1.3 Prompt Card Component (Example)
```typescript
interface PromptCardProps {
  prompt: PromptResponseDto;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onViewDetails: (promptKey: string) => void;
}
```

**Card Content:**
- Prompt key (title)
- Version badge (active version highlighted)
- Model name chip
- Description (truncated)
- Tags display (max 3, show "+" for more)
- Created by info
- Creation date (relative time)
- Active status indicator
- Action buttons: View Details, Edit, Delete

#### 4.1.4 API Integration
- `GET /api/prompts` with query parameters
- Real-time filtering with debounced API calls
- Pagination with infinite scroll or traditional pagination
- Loading states during API calls
- Error handling with retry mechanisms

#### 4.1.5 State Management
```typescript
interface PromptLibraryState {
  prompts: PromptResponseDto[];
  loading: boolean;
  error: string | null;
  filters: FilterState;
  pagination: PaginationState;
  sortConfig: SortConfig;
}
```

### 4.2 Prompt Detail Page (/prompts/:promptKey)

#### 4.2.1 Purpose
Comprehensive view of a specific prompt family showing the active version details and providing access to version management.

#### 4.2.2 Layout Components
- **Breadcrumb Navigation**
  - Home > Prompt Library > [Prompt Key]

- **Header Section**
  - Prompt key (title)
  - Active version badge
  - Action buttons: Edit, Create Version, View All Versions
  - Active status toggle

- **Main Content Area**
  - **Metadata Panel**
    - Model name
    - Description
    - Tags (editable inline)
    - Created by
    - Creation date
    - Last modified date

  - **Content Panel**
    - Markdown-rendered prompt content
    - Character count
    - Copy to clipboard button
    - Full-screen view toggle

- **Version Summary Section**
  - Quick stats: Total versions, Active version
  - Recent versions list (last 5)
  - "View All Versions" link

#### 4.2.3 API Integration
- `GET /api/prompts/{promptKey}` for active prompt
- `GET /api/prompts/{promptKey}/versions` for version summary
- Real-time updates when version is activated

#### 4.2.4 Interactive Features
- **Inline Tag Editing**: Click to edit tags with autocomplete
- **Content Preview**: Expandable/collapsible content view
- **Quick Actions**: Copy prompt, export as file
- **Version Comparison**: Link to compare with previous versions

### 4.3 Create Prompt Page (/prompts/create)

#### 4.3.1 Purpose
Form interface for creating new prompt families with comprehensive validation and rich text editing capabilities.

#### 4.3.2 Form Components

**Form Layout:**
```typescript
interface CreatePromptForm {
  promptKey: string;
  version?: string;
  modelName: ModelName;
  content: string;
  description?: string;
  tags: string[];
  createdBy: string;
  isActive: boolean;
}
```

- **Basic Information Section**
  - Prompt Key input (validated for uniqueness)
  - Version input (auto-generated or manual)
  - Model Name dropdown
  - Created By input (could be pre-filled from user context)

- **Content Section**
  - Rich text editor for prompt content with:
    - Markdown support
    - Syntax highlighting
    - Preview mode
    - Character counter
    - Full-screen editing mode
  - Description textarea
  - Live preview panel

- **Categorization Section**
  - Tags input with autocomplete from existing tags
  - Tag suggestions based on model name
  - Custom tag creation

- **Settings Section**
  - Set as Active checkbox
  - Save as Draft option

#### 4.3.3 Validation Rules
- Prompt Key: Required, 3-100 characters, unique
- Model Name: Required, from predefined enum
- Content: Required, max 50,000 characters
- Description: Optional, max 1,000 characters
- Tags: Max 20 tags
- Created By: Required, max 255 characters

#### 4.3.4 Form Behavior
- Real-time validation with error messages
- Auto-save draft functionality
- Unsaved changes warning
- Preview mode toggle
- Form reset capability

### 4.4 Version Management Page (/prompts/:promptKey/versions)

#### 4.4.1 Purpose
Comprehensive version history view with comparison tools and version activation controls.

#### 4.4.2 Layout Components

- **Header Section**
  - Breadcrumb: Home > Prompt Library > [Prompt Key] > Versions
  - Prompt key title
  - "Create New Version" button
  - Bulk actions dropdown

- **Version List Table**
  ```typescript
  interface VersionTableRow {
    version: string;
    isActive: boolean;
    dateCreation: string;
    modelName: string;
    createdBy: string;
    description: string;
    actions: ActionButtons;
  }
  ```

- **Table Columns:**
  - Version (sortable)
  - Status (Active/Inactive with visual indicators)
  - Creation Date (sortable, relative time)
  - Model Name
  - Created By
  - Description (truncated)
  - Actions (View, Activate, Compare, Delete)

#### 4.4.3 Interactive Features

- **Version Activation**
  - One-click activation with confirmation
  - Visual feedback for active version
  - Batch activation prevention

- **Version Comparison**
  - Select 2 versions for side-by-side comparison
  - Diff highlighting for content changes
  - Metadata comparison table

- **Bulk Operations**
  - Select multiple versions
  - Bulk delete (inactive only)
  - Export selected versions

#### 4.4.4 Version Comparison Modal
- Split-pane view showing two versions
- Diff highlighting with color coding
- Line-by-line change indicators
- Metadata differences table
- Navigation between changes

### 4.5 Create Version Page (/prompts/:promptKey/versions/create)

#### 4.5.1 Purpose
Form for creating new versions of existing prompts with smart defaults and change tracking.

#### 4.5.2 Form Features

- **Pre-filled Form**
  - Base data from latest version
  - Auto-incremented version number
  - Current user as creator

- **Change Tracking**
  - Highlight differences from previous version
  - Content diff preview
  - Change summary panel

- **Smart Defaults**
  - Inherit tags from previous version
  - Same model name (with option to change)
  - Incremental version numbering

#### 4.5.3 Version Creation Rules
- Version must be unique for the prompt key
- Content must be different from previous version
- Automatic timestamp-based versioning option
- Validation against duplicate content

## 5. Shared Components Specifications

### 5.1 PromptContentEditor Component
```typescript
interface PromptContentEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  enablePreview?: boolean;
  enableFullscreen?: boolean;
}
```

**Features:**
- Markdown syntax highlighting
- Live preview toggle
- Character counter
- Full-screen mode
- Auto-save functionality
- Syntax validation

### 5.2 TagInput Component
```typescript
interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  suggestions?: string[];
  maxTags?: number;
  placeholder?: string;
}
```

**Features:**
- Autocomplete from existing tags
- Tag validation and sanitization
- Maximum tag limit enforcement
- Custom tag creation
- Tag removal with confirmation

### 5.3 FilterPanel Component
```typescript
interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  availableOptions: FilterOptions;
  onClearFilters: () => void;
}
```

**Features:**
- Collapsible sections
- Multi-select capabilities
- Search within filter options
- Filter count badges
- Clear all filters option

## 6. Data Management & API Integration

### 6.1 Service Layer Architecture
```typescript
// services/promptService.ts
class PromptService {
  async getAllPrompts(params: QueryPromptsDto): Promise<PromptListResponseDto>
  async getPromptByKey(promptKey: string): Promise<PromptSingleResponseDto>
  async getVersionsByKey(promptKey: string, pagination: PaginationDto): Promise<PromptListResponseDto>
  async createPrompt(data: CreatePromptDto): Promise<PromptSingleResponseDto>
  async createVersion(promptKey: string, data: CreateVersionDto): Promise<PromptSingleResponseDto>
  async activateVersion(promptKey: string, version: string): Promise<PromptSingleResponseDto>
  async deletePrompt(id: string): Promise<void>
}
```

### 6.2 Custom Hooks for Data Management
```typescript
// hooks/usePrompts.ts
export const usePrompts = (filters: FilterState) => {
  // Data fetching, caching, and state management
}

// hooks/usePromptDetail.ts
export const usePromptDetail = (promptKey: string) => {
  // Single prompt data management
}

// hooks/useVersions.ts
export const useVersions = (promptKey: string) => {
  // Version management and comparison
}
```

### 6.3 Error Handling Strategy
- Global error boundary for unhandled errors
- Service-level error handling with user-friendly messages
- Retry mechanisms for failed API calls
- Offline state detection and handling

## 7. Performance Requirements

### 7.1 Loading Performance
- Initial page load: < 2 seconds
- API response handling: < 500ms
- Search debouncing: 300ms delay
- Lazy loading for large content
- Code splitting for route-based chunks

### 7.2 Optimization Strategies
- React.memo for expensive components
- useCallback and useMemo for optimization
- Virtual scrolling for large lists
- Image lazy loading
- Service worker for caching (future enhancement)

## 8. Accessibility & User Experience

### 8.1 Accessibility Requirements
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus management in modals

### 8.2 User Experience Features
- Responsive design (desktop, tablet)
- Loading states and skeleton screens
- Error states with recovery options
- Success notifications
- Undo/redo capabilities where applicable

## 9. Testing Strategy

### 9.1 Testing Requirements
- Unit tests: 80%+ coverage
- Integration tests for API interactions
- Component testing with React Testing Library
- End-to-end testing for critical user flows
- Accessibility testing

### 9.2 Test Scenarios
- Prompt CRUD operations
- Version management workflows
- Filter and search functionality
- Form validation and error handling
- Responsive design testing

