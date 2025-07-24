import { PrismaClient } from '@prisma/client';

// Singleton pattern for Prisma client to prevent multiple instances in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query'] : ['error'],
});

// Prevent multiple instances in development
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Database connection helper
export async function connectDb() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

// Database disconnection helper
export async function disconnectDb() {
  await prisma.$disconnect();
  console.log('🔌 Database disconnected');
}

// Health check for database
export async function dbHealthCheck() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: 'healthy', timestamp: new Date().toISOString() };
  } catch (error) {
    return { 
      status: 'unhealthy', 
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString() 
    };
  }
}

// Database migration helper
export async function runMigrations() {
  try {
    // In production, migrations should be run via deployment pipeline
    if (process.env.NODE_ENV === 'production') {
      console.log('⚠️ Skipping migrations in production - should be handled by deployment');
      return;
    }
    
    // For development, we can use Prisma's migration commands
    const { execSync } = await import('child_process');
    execSync('npx prisma migrate dev', { stdio: 'inherit' });
    console.log('✅ Database migrations completed');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Seed database with initial data
export async function seedDatabase() {
  try {
    console.log('🌱 Seeding database...');
    
    // Create default content types
    const designerContentType = await prisma.contentType.upsert({
      where: { name: 'designer' },
      update: {},
      create: {
        name: 'designer',
        displayName: 'Designers',
        schema: {
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              label: 'Designer Name'
            },
            {
              name: 'bio',
              type: 'textarea',
              required: true,
              label: 'Biography'
            },
            {
              name: 'instagram_handle',
              type: 'text',
              label: 'Instagram Handle'
            },
            {
              name: 'profile_image',
              type: 'image',
              required: true,
              label: 'Profile Image'
            },
            {
              name: 'portfolio_images',
              type: 'gallery',
              label: 'Portfolio Gallery'
            }
          ]
        }
      }
    });

    const exhibitionContentType = await prisma.contentType.upsert({
      where: { name: 'exhibition' },
      update: {},
      create: {
        name: 'exhibition',
        displayName: 'Exhibitions',
        schema: {
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              label: 'Exhibition Title'
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
              label: 'Description'
            },
            {
              name: 'start_date',
              type: 'date',
              required: true,
              label: 'Start Date'
            },
            {
              name: 'end_date',
              type: 'date',
              required: true,
              label: 'End Date'
            },
            {
              name: 'location',
              type: 'text',
              label: 'Location'
            },
            {
              name: 'hero_image',
              type: 'image',
              required: true,
              label: 'Hero Image'
            },
            {
              name: 'gallery',
              type: 'gallery',
              label: 'Exhibition Gallery'
            }
          ]
        }
      }
    });

    const aboutContentType = await prisma.contentType.upsert({
      where: { name: 'about_section' },
      update: {},
      create: {
        name: 'about_section',
        displayName: 'About Sections',
        schema: {
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              label: 'Section Title'
            },
            {
              name: 'subtitle',
              type: 'text',
              label: 'Subtitle'
            },
            {
              name: 'content',
              type: 'rich_text',
              required: true,
              label: 'Content'
            },
            {
              name: 'hero_image',
              type: 'image',
              label: 'Hero Image'
            },
            {
              name: 'gallery',
              type: 'gallery',
              label: 'Image Gallery'
            }
          ]
        }
      }
    });

    // Create default admin user (only if no users exist)
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123!', 12);
      
      await prisma.user.create({
        data: {
          email: 'admin@redux.com',
          passwordHash: hashedPassword,
          name: 'REDUX Admin',
          role: 'SUPER_ADMIN'
        }
      });
      
      console.log('👤 Default admin user created: admin@redux.com / admin123!');
    }

    console.log('✅ Database seeded successfully');
    
    return {
      contentTypes: {
        designer: designerContentType,
        exhibition: exhibitionContentType,
        aboutSection: aboutContentType
      }
    };
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  }
}

// Clean up development data
export async function cleanDatabase() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Cannot clean database in production');
  }
  
  console.log('🧹 Cleaning database...');
  
  // Delete in correct order to respect foreign key constraints
  await prisma.contentMedia.deleteMany();
  await prisma.contentItem.deleteMany();
  await prisma.mediaItem.deleteMany();
  await prisma.navigationItem.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.contentType.deleteMany();
  await prisma.user.deleteMany();
  await prisma.systemConfig.deleteMany();
  
  console.log('✅ Database cleaned');
}

// Database utilities
export const dbUtils = {
  // Get content item with all relations
  async getContentItemWithRelations(id: string) {
    return await prisma.contentItem.findUnique({
      where: { id },
      include: {
        contentType: true,
        createdBy: {
          select: { id: true, name: true, email: true }
        },
        updatedBy: {
          select: { id: true, name: true, email: true }
        },
        media: {
          include: {
            mediaItem: true
          },
          orderBy: { sortOrder: 'asc' }
        }
      }
    });
  },

  // Search content items
  async searchContentItems(query: string, contentType?: string) {
    return await prisma.contentItem.findMany({
      where: {
        AND: [
          contentType ? { contentType: { name: contentType } } : {},
          {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { slug: { contains: query, mode: 'insensitive' } }
            ]
          }
        ]
      },
      include: {
        contentType: true,
        createdBy: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
  },

  // Get published content for public API
  async getPublishedContent(contentTypeName: string, slug?: string) {
    const where = {
      contentType: { name: contentTypeName },
      status: 'PUBLISHED' as const,
      ...(slug && { slug })
    };

    if (slug) {
      return await prisma.contentItem.findFirst({
        where,
        include: {
          contentType: true,
          media: {
            include: { mediaItem: true },
            orderBy: { sortOrder: 'asc' }
          }
        }
      });
    }

    return await prisma.contentItem.findMany({
      where,
      include: {
        contentType: true,
        media: {
          include: { mediaItem: true },
          orderBy: { sortOrder: 'asc' }
        }
      },
      orderBy: { publishedAt: 'desc' }
    });
  }
};

export default prisma;