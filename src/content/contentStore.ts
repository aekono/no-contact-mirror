import * as FileSystem from 'expo-file-system';

// Content row interface
export interface ContentRow {
  category: string;
  id: string;
  text: string;
  use_case?: string;
  tags?: string;
}

// Mapping row interface
export interface MappingRow {
  surface: string;
  categories: string;
  notes?: string;
}

// Content store state
interface ContentStoreState {
  contentRows: ContentRow[];
  mappingRows: MappingRow[];
  isLoaded: boolean;
}

// Singleton store
let contentStore: ContentStoreState = {
  contentRows: [],
  mappingRows: [],
  isLoaded: false,
};

// Cache for surface categories
const surfaceCategoriesCache = new Map<string, string[]>();

// Cache for category messages
const categoryMessagesCache = new Map<string, ContentRow[]>();

// Cache for last message per surface (for rotation)
const lastMessageCache = new Map<string, string>();

/**
 * Parse CSV content into array of objects
 */
function parseCSV<T>(csvContent: string, headers: string[]): T[] {
  const lines = csvContent.trim().split('\n');
  const result: T[] = [];
  
  for (let i = 1; i < lines.length; i++) { // Skip header row
    const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    if (values.length >= headers.length) {
      const row = {} as T;
      headers.forEach((header, index) => {
        (row as any)[header] = values[index] || '';
      });
      result.push(row);
    }
  }
  
  return result;
}

/**
 * Load content from CSV files
 */
async function loadContent(): Promise<void> {
  if (contentStore.isLoaded) return;

  try {
    // For now, use fallback content since CSV loading is problematic in Expo Go
    // In a production build, you would use a different approach like:
    // 1. Bundle the CSV content as TypeScript/JavaScript modules
    // 2. Use a remote API to fetch content
    // 3. Use a development build with proper asset handling
    
    console.log('Using fallback content (CSV loading not supported in Expo Go)');
    contentStore.contentRows = getDefaultContent();
    contentStore.mappingRows = getDefaultMapping();
    contentStore.isLoaded = true;
    
    console.log('Content loaded successfully:', {
      contentRows: contentStore.contentRows.length,
      mappingRows: contentStore.mappingRows.length
    });
  } catch (error) {
    console.error('Error loading content:', error);
    // Fallback to default content
    contentStore.contentRows = getDefaultContent();
    contentStore.mappingRows = getDefaultMapping();
    contentStore.isLoaded = true;
    console.log('Using fallback content due to loading error');
  }
}

/**
 * Get default content when CSV files fail to load
 */
function getDefaultContent(): ContentRow[] {
  return [
    {
      category: 'reframe',
      id: 'reframe_1',
      text: 'A feeling is not a command.',
      use_case: '',
      tags: ''
    },
    {
      category: 'values_prompt',
      id: 'values_prompt_1',
      text: 'What choice today honors your healing most?',
      use_case: '',
      tags: ''
    },
    {
      category: 'self_compassion',
      id: 'self_compassion_1',
      text: 'You are doing the best you can with what you have.',
      use_case: '',
      tags: ''
    },
    {
      category: 'notification',
      id: 'notification_1',
      text: 'Tiny win check-in: what\'s one kind choice tonight?',
      use_case: '',
      tags: ''
    },
    {
      category: 'coping_card',
      id: 'coping_card_1',
      text: 'Drink a full glass of water.',
      use_case: '',
      tags: ''
    },
    {
      category: 'breath',
      id: 'breath_1',
      text: 'In for 4, hold 2, out for 6 — repeat ×4.',
      use_case: '',
      tags: ''
    },
    {
      category: 'reset',
      id: 'reset_1',
      text: 'No shame. Note what led here; pick one tweak for next time.',
      use_case: '',
      tags: ''
    },
    {
      category: 'disclaimer',
      id: 'disclaimer_1',
      text: 'Not medical advice. If you\'re in immediate danger, call local emergency services.',
      use_case: '',
      tags: ''
    }
  ];
}

/**
 * Get default mapping when CSV files fail to load
 */
function getDefaultMapping(): MappingRow[] {
  return [
    {
      surface: 'Home Rotating Support Message',
      categories: 'reframe, values_prompt, self_compassion, notification',
      notes: 'Cycle evidence-based reframes, values prompts, and compassion lines. Keep ≤130 chars.'
    },
    {
      surface: 'Panic Modal — Urge Surfing Timer',
      categories: 'breath, coping_card',
      notes: 'Tick message every 45–60s. Include breath cues. Quick Coping Cards accessible.'
    },
    {
      surface: 'Panic Modal — Coping Deck',
      categories: 'coping_card, reframe, values_prompt',
      notes: 'Show actionable cards. Shuffle or let users star favorites. Ensure large tap targets.'
    },
    {
      surface: 'Check-In Feedback (after Save)',
      categories: 'reframe, self_compassion, values_prompt',
      notes: 'After journal save, show one short supportive line (CBT reframe or value reminder).'
    },
    {
      surface: 'Notifications (opt-in)',
      categories: 'notification, values_prompt',
      notes: 'Limit 1–2/day. Default evening. Discreet and supportive tone. Avoid shaming.'
    },
    {
      surface: 'Slip / Reset Flow',
      categories: 'reset, self_compassion, values_prompt',
      notes: 'On slip, show compassionate reset prompts. Normalize slips. Suggest one tweak.'
    },
    {
      surface: 'SOS Panel',
      categories: 'disclaimer',
      notes: 'Always show \'Not medical advice\' + verified crisis lines.'
    }
  ];
}

/**
 * Get categories for a specific surface
 */
export function getCategoriesForSurface(surface: string): string[] {
  if (surfaceCategoriesCache.has(surface)) {
    return surfaceCategoriesCache.get(surface)!;
  }

  const mapping = contentStore.mappingRows.find(row => row.surface === surface);
  if (!mapping) {
    surfaceCategoriesCache.set(surface, []);
    return [];
  }

  const categories = mapping.categories
    .split(',')
    .map(cat => cat.trim())
    .filter(cat => cat.length > 0);
  
  surfaceCategoriesCache.set(surface, categories);
  return categories;
}

/**
 * Get messages by category
 */
export function getMessagesByCategory(category: string): ContentRow[] {
  if (categoryMessagesCache.has(category)) {
    return categoryMessagesCache.get(category)!;
  }

  const messages = contentStore.contentRows.filter(row => row.category === category);
  categoryMessagesCache.set(category, messages);
  return messages;
}

/**
 * Get random message for surface
 */
export function getRandomMessageForSurface(surface: string): ContentRow | null {
  const categories = getCategoriesForSurface(surface);
  if (categories.length === 0) return null;

  // Get all messages for all categories
  const allMessages: ContentRow[] = [];
  categories.forEach(category => {
    allMessages.push(...getMessagesByCategory(category));
  });

  if (allMessages.length === 0) return null;

  // Avoid immediate repeats
  const lastMessageId = lastMessageCache.get(surface);
  const availableMessages = lastMessageId 
    ? allMessages.filter(msg => msg.id !== lastMessageId)
    : allMessages;

  if (availableMessages.length === 0) {
    // Fallback to all messages if we've seen them all
    const randomIndex = Math.floor(Math.random() * allMessages.length);
    const selectedMessage = allMessages[randomIndex];
    lastMessageCache.set(surface, selectedMessage.id);
    return selectedMessage;
  }

  const randomIndex = Math.floor(Math.random() * availableMessages.length);
  const selectedMessage = availableMessages[randomIndex];
  lastMessageCache.set(surface, selectedMessage.id);
  return selectedMessage;
}

/**
 * Get rotation generator for surface
 */
export function* getRotationForSurface(surface: string, seed?: string): Generator<ContentRow, void, unknown> {
  const categories = getCategoriesForSurface(surface);
  if (categories.length === 0) return;

  const allMessages: ContentRow[] = [];
  categories.forEach(category => {
    allMessages.push(...getMessagesByCategory(category));
  });

  if (allMessages.length === 0) return;

  // Simple shuffle based on seed
  const shuffled = [...allMessages];
  if (seed) {
    // Simple seeded shuffle
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.abs(hash + i) % (i + 1);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
  } else {
    // Fisher-Yates shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
  }

  let index = 0;
  while (true) {
    yield shuffled[index % shuffled.length];
    index++;
  }
}

/**
 * Get disclaimer message
 */
export function getDisclaimer(): ContentRow | null {
  const disclaimers = getMessagesByCategory('disclaimer');
  return disclaimers.length > 0 ? disclaimers[0] : null;
}

/**
 * Initialize content store
 */
export async function initializeContentStore(): Promise<void> {
  await loadContent();
}

/**
 * Check if content is loaded
 */
export function isContentLoaded(): boolean {
  return contentStore.isLoaded;
}

/**
 * Get all surfaces
 */
export function getAllSurfaces(): string[] {
  return contentStore.mappingRows.map(row => row.surface);
}

/**
 * Get all categories
 */
export function getAllCategories(): string[] {
  const categories = new Set<string>();
  contentStore.contentRows.forEach(row => categories.add(row.category));
  return Array.from(categories);
}

/**
 * Clear caches (useful for testing)
 */
export function clearCaches(): void {
  surfaceCategoriesCache.clear();
  categoryMessagesCache.clear();
  lastMessageCache.clear();
}
