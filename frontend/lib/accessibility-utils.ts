/**
 * Accessibility utilities for keyboard navigation and focus indicators
 */

/**
 * Focus indicator styles for interactive elements
 */
export const FOCUS_STYLES = {
  default: 'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background',
  ring: 'focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background',
  underline: 'focus-visible:underline focus-visible:underline-offset-4',
  border: 'focus:border-primary focus:border-2',
} as const

/**
 * Keyboard navigation event handlers
 */
export const KEYBOARD_CODES = {
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  SPACE: ' ',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  TAB: 'Tab',
  HOME: 'Home',
  END: 'End',
} as const

/**
 * Check if key is an enter key
 */
export function isEnterKey(event: React.KeyboardEvent): boolean {
  return event.key === KEYBOARD_CODES.ENTER
}

/**
 * Check if key is an escape key
 */
export function isEscapeKey(event: React.KeyboardEvent): boolean {
  return event.key === KEYBOARD_CODES.ESCAPE
}

/**
 * Check if key is a space key
 */
export function isSpaceKey(event: React.KeyboardEvent): boolean {
  return event.key === KEYBOARD_CODES.SPACE
}

/**
 * Check if key is an arrow key
 */
export function isArrowKey(event: React.KeyboardEvent): boolean {
  return [
    KEYBOARD_CODES.ARROW_UP,
    KEYBOARD_CODES.ARROW_DOWN,
    KEYBOARD_CODES.ARROW_LEFT,
    KEYBOARD_CODES.ARROW_RIGHT,
  ].includes(event.key as any)
}

/**
 * Trap focus within a container (for modals, popovers, etc.)
 */
export function trapFocus(event: React.KeyboardEvent, containerId: string) {
  if (event.key !== KEYBOARD_CODES.TAB) return

  const container = document.getElementById(containerId)
  if (!container) return

  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  const firstElement = focusableElements[0] as HTMLElement
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

  if (event.shiftKey) {
    if (document.activeElement === firstElement) {
      lastElement?.focus()
      event.preventDefault()
    }
  } else {
    if (document.activeElement === lastElement) {
      firstElement?.focus()
      event.preventDefault()
    }
  }
}

/**
 * Get all focusable elements in a container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  ) as HTMLElement[]
}

/**
 * Focus on first focusable element in container
 */
export function focusFirst(container: HTMLElement): void {
  const elements = getFocusableElements(container)
  elements[0]?.focus()
}

/**
 * ARIA label helpers
 */
export const ARIA_LABELS = {
  close: 'Close',
  menu: 'Open menu',
  submit: 'Submit',
  cancel: 'Cancel',
  delete: 'Delete',
  edit: 'Edit',
  save: 'Save',
  loading: 'Loading',
  search: 'Search',
  filter: 'Filter',
  sort: 'Sort',
  download: 'Download',
  upload: 'Upload',
  settings: 'Settings',
  help: 'Help',
  more: 'More options',
} as const

/**
 * Create accessible icon button with ARIA label
 */
export function createAccessibleIconButtonProps(label: string, onClick?: () => void) {
  return {
    'aria-label': label,
    onClick,
  }
}

/**
 * Make element focusable with keyboard
 */
export function makeKeyboardAccessible(
  event: React.KeyboardEvent,
  onClick: () => void
) {
  if (isEnterKey(event) || isSpaceKey(event)) {
    event.preventDefault()
    onClick()
  }
}

/**
 * Announce content to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div')
  announcement.setAttribute('role', 'status')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message

  document.body.appendChild(announcement)

  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

/**
 * Skip to main content link (usually hidden but visible on focus)
 */
export function createSkipLink(mainContentId: string) {
  return {
    href: `#${mainContentId}`,
    className: 'sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-primary focus:text-white focus:rounded',
    children: 'Skip to main content',
  }
}

/**
 * Semantic HTML helper for headings
 */
export function getSemanticHeadingLevel(level: 1 | 2 | 3 | 4 | 5 | 6): 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' {
  const levels = {
    1: 'h1',
    2: 'h2',
    3: 'h3',
    4: 'h4',
    5: 'h5',
    6: 'h6',
  } as const
  return levels[level]
}

/**
 * Check if element has disabled state
 */
export function isDisabled(element: HTMLElement): boolean {
  return element.hasAttribute('disabled') || element.getAttribute('aria-disabled') === 'true'
}

/**
 * Get accessible description for element
 */
export function getAccessibleDescription(element: HTMLElement): string {
  const describedById = element.getAttribute('aria-describedby')
  if (describedById) {
    const descElement = document.getElementById(describedById)
    if (descElement) return descElement.textContent || ''
  }
  return ''
}

/**
 * Common ARIA attributes for form fields
 */
export function getFormFieldAriaAttributes(
  hasError: boolean,
  errorMessage?: string,
  helpText?: string
) {
  return {
    'aria-invalid': hasError,
    'aria-describedby': hasError ? 'error-message' : helpText ? 'help-text' : undefined,
  }
}

/**
 * Loading state ARIA attributes
 */
export function getLoadingAriaAttributes(isLoading: boolean) {
  return {
    'aria-busy': isLoading,
    'aria-live': 'polite' as const,
    'aria-label': isLoading ? 'Loading' : undefined,
  }
}

/**
 * Table accessibility helpers
 */
export const TABLE_ARIA_ATTRIBUTES = {
  table: {
    role: 'table',
    'aria-label': 'Data table',
  },
  header: {
    role: 'rowheader',
    scope: 'col',
  },
  cell: {
    role: 'gridcell',
  },
} as const
