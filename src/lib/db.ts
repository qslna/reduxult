// Mock Prisma client for deployment without database
export const prisma = {
  user: {
    findUnique: async (...args: any[]) => null,
    findMany: async (...args: any[]) => [],
    create: async (...args: any[]) => ({}),
    update: async (...args: any[]) => ({}),
    delete: async (...args: any[]) => ({}),
    count: async (...args: any[]) => 0,
    upsert: async (...args: any[]) => ({})
  },
  contentType: {
    findMany: async (...args: any[]) => [],
    findUnique: async (...args: any[]) => null,
    create: async (...args: any[]) => ({}),
    update: async (...args: any[]) => ({}),
    delete: async (...args: any[]) => ({}),
    upsert: async (...args: any[]) => ({})
  },
  contentItem: {
    findMany: async (...args: any[]) => [],
    findUnique: async (...args: any[]) => null,
    findFirst: async (...args: any[]) => null,
    create: async (...args: any[]) => ({}),
    update: async (...args: any[]) => ({}),
    delete: async (...args: any[]) => ({}),
    deleteMany: async (...args: any[]) => ({ count: 0 })
  },
  mediaItem: {
    findMany: async (...args: any[]) => [],
    findUnique: async (...args: any[]) => null,
    create: async (...args: any[]) => ({}),
    update: async (...args: any[]) => ({}),
    delete: async (...args: any[]) => ({}),
    deleteMany: async (...args: any[]) => ({ count: 0 }),
    count: async (...args: any[]) => 0
  },
  contentMedia: {
    deleteMany: async (...args: any[]) => ({ count: 0 })
  },
  navigationItem: {
    deleteMany: async (...args: any[]) => ({ count: 0 })
  },
  auditLog: {
    deleteMany: async (...args: any[]) => ({ count: 0 })
  },
  systemConfig: {
    deleteMany: async (...args: any[]) => ({ count: 0 })
  },
  $connect: async (...args: any[]) => {},
  $disconnect: async (...args: any[]) => {},
  $queryRaw: async (...args: any[]) => [{ result: 1 }]
};

// Database connection helper (mock)
export async function connectDb() {
  console.log('✅ Mock database connected successfully');
}

// Database disconnection helper (mock)
export async function disconnectDb() {
  console.log('🔌 Mock database disconnected');
}

// Health check for database (mock)
export async function dbHealthCheck() {
  return { status: 'healthy', timestamp: new Date().toISOString() };
}

// Database migration helper (mock)
export async function runMigrations() {
  console.log('⚠️ Mock migrations - no action needed');
}

// Seed database with initial data (mock)
export async function seedDatabase() {
  console.log('🌱 Mock database seeded successfully');
  return {
    contentTypes: {
      designer: { id: 'mock-designer', name: 'designer' },
      exhibition: { id: 'mock-exhibition', name: 'exhibition' },
      aboutSection: { id: 'mock-about', name: 'about_section' }
    }
  };
}

// Clean up development data (mock)
export async function cleanDatabase() {
  console.log('🧹 Mock database cleaned');
}

// Database utilities (mock)
export const dbUtils = {
  // Get content item with all relations (mock)
  async getContentItemWithRelations(id: string) {
    return null;
  },

  // Search content items (mock)
  async searchContentItems(query: string, contentType?: string) {
    return [];
  },

  // Get published content for public API (mock)
  async getPublishedContent(contentTypeName: string, slug?: string) {
    return slug ? null : [];
  }
};

export default prisma;