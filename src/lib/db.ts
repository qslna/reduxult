/**
 * Database Utilities
 * 데이터베이스 연결 및 관리 (현재는 로컬 스토리지 기반)
 */

interface DBRecord {
  id: string;
  table: string;
  data: any;
  createdAt: string;
  updatedAt: string;
}

class SimpleDB {
  private storageKey = 'redux-db';

  // 데이터 저장
  async create(table: string, data: any): Promise<string> {
    const id = this.generateId();
    const record: DBRecord = {
      id,
      table,
      data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const records = this.getAllRecords();
    records.push(record);
    this.saveAllRecords(records);

    return id;
  }

  // 데이터 조회 (단일)
  async findById(table: string, id: string): Promise<any | null> {
    const records = this.getAllRecords();
    const record = records.find(r => r.table === table && r.id === id);
    return record ? record.data : null;
  }

  // 데이터 조회 (다중)
  async findMany(table: string, filter?: (data: any) => boolean): Promise<any[]> {
    const records = this.getAllRecords();
    let tableRecords = records.filter(r => r.table === table);

    if (filter) {
      tableRecords = tableRecords.filter(r => filter(r.data));
    }

    return tableRecords.map(r => ({ id: r.id, ...r.data }));
  }

  // 데이터 업데이트
  async update(table: string, id: string, data: Partial<any>): Promise<boolean> {
    const records = this.getAllRecords();
    const recordIndex = records.findIndex(r => r.table === table && r.id === id);

    if (recordIndex === -1) return false;

    records[recordIndex].data = { ...records[recordIndex].data, ...data };
    records[recordIndex].updatedAt = new Date().toISOString();

    this.saveAllRecords(records);
    return true;
  }

  // 데이터 삭제
  async delete(table: string, id: string): Promise<boolean> {
    const records = this.getAllRecords();
    const filteredRecords = records.filter(r => !(r.table === table && r.id === id));

    if (filteredRecords.length === records.length) return false;

    this.saveAllRecords(filteredRecords);
    return true;
  }

  // 테이블의 모든 데이터 삭제
  async clearTable(table: string): Promise<void> {
    const records = this.getAllRecords();
    const filteredRecords = records.filter(r => r.table !== table);
    this.saveAllRecords(filteredRecords);
  }

  // 데이터베이스 초기화
  async clearAll(): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.storageKey);
    }
  }

  // 통계 정보
  async getStats() {
    const records = this.getAllRecords();
    const stats = {
      totalRecords: records.length,
      byTable: {} as Record<string, number>,
      oldestRecord: records.length > 0 ? Math.min(...records.map(r => new Date(r.createdAt).getTime())) : 0,
      newestRecord: records.length > 0 ? Math.max(...records.map(r => new Date(r.updatedAt).getTime())) : 0
    };

    records.forEach(record => {
      stats.byTable[record.table] = (stats.byTable[record.table] || 0) + 1;
    });

    return stats;
  }

  // 데이터 백업
  async backup(): Promise<string> {
    const records = this.getAllRecords();
    return JSON.stringify(records, null, 2);
  }

  // 데이터 복원
  async restore(backupData: string): Promise<boolean> {
    try {
      const records = JSON.parse(backupData);
      if (Array.isArray(records)) {
        this.saveAllRecords(records);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to restore backup:', error);
      return false;
    }
  }

  // 헬스 체크
  async healthCheck(): Promise<{ status: 'ok' | 'error'; message: string }> {
    try {
      const testId = await this.create('health_check', { test: true });
      const testData = await this.findById('health_check', testId);
      await this.delete('health_check', testId);

      if (testData && testData.test === true) {
        return { status: 'ok', message: 'Database is healthy' };
      } else {
        return { status: 'error', message: 'Database test failed' };
      }
    } catch (error) {
      return { status: 'error', message: `Database error: ${error}` };
    }
  }

  // Private methods
  private getAllRecords(): DBRecord[] {
    if (typeof window === 'undefined') return [];

    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to parse stored records:', error);
      return [];
    }
  }

  private saveAllRecords(records: DBRecord[]): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(records));
    } catch (error) {
      console.error('Failed to save records:', error);
    }
  }

  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// 싱글톤 데이터베이스 인스턴스
export const db = new SimpleDB();

// 테이블별 헬퍼 함수들
export const dbHelpers = {
  // 사용자 관리
  users: {
    create: (userData: any) => db.create('users', userData),
    findById: (id: string) => db.findById('users', id),
    findAll: () => db.findMany('users'),
    update: (id: string, data: any) => db.update('users', id, data),
    delete: (id: string) => db.delete('users', id)
  },

  // 콘텐츠 관리
  content: {
    create: (contentData: any) => db.create('content', contentData),
    findById: (id: string) => db.findById('content', id),
    findByPage: (page: string) => db.findMany('content', (data) => data.page === page),
    findAll: () => db.findMany('content'),
    update: (id: string, data: any) => db.update('content', id, data),
    delete: (id: string) => db.delete('content', id)
  },

  // 미디어 관리
  media: {
    create: (mediaData: any) => db.create('media', mediaData),
    findById: (id: string) => db.findById('media', id),
    findByCategory: (category: string) => db.findMany('media', (data) => data.category === category),
    findAll: () => db.findMany('media'),
    update: (id: string, data: any) => db.update('media', id, data),
    delete: (id: string) => db.delete('media', id)
  },

  // 설정 관리
  settings: {
    create: (settingsData: any) => db.create('settings', settingsData),
    findById: (id: string) => db.findById('settings', id),
    findAll: () => db.findMany('settings'),
    update: (id: string, data: any) => db.update('settings', id, data),
    delete: (id: string) => db.delete('settings', id)
  }
};

// 데이터베이스 초기화 함수
export async function initializeDB() {
  try {
    await db.healthCheck();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}

// 기본 데이터 시드
export async function seedDatabase() {
  const stats = await db.getStats();
  
  // 이미 데이터가 있으면 시드하지 않음
  if (stats.totalRecords > 0) {
    console.log('Database already seeded');
    return;
  }

  try {
    // 기본 설정 생성
    await dbHelpers.settings.create({
      key: 'site_config',
      value: {
        siteName: 'REDUX',
        siteDescription: 'Fashion Design Collective',
        adminPassword: 'redux2025',
        theme: 'dark',
        language: 'ko'
      }
    });

    // 기본 콘텐츠 생성
    await dbHelpers.content.create({
      page: 'home',
      section: 'hero',
      type: 'text',
      content: {
        title: 'REDUX',
        subtitle: 'THE ROOM OF [ ]',
        cta_primary: 'DISCOVER REDUX',
        cta_secondary: 'VIEW EXHIBITIONS'
      }
    });

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Failed to seed database:', error);
  }
}

export default db;