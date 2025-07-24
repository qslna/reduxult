'use client';

import AdminPanel from './AdminPanel';

export default function AdminButton() {
  // AdminPanel이 자체적으로 버튼과 패널을 모두 관리합니다
  // Ctrl + Shift + A로 관리자 버튼을 표시/숨기기 가능
  return <AdminPanel />;
}