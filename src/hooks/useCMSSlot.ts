'use client';

import { useState, useEffect } from 'react';
import { getSlotById, type MediaSlot } from '../lib/cms-config';

interface UseCMSSlotResult {
  slot: MediaSlot | undefined;
  currentFiles: string[];
  updateFiles: (files: string[]) => void;
  isLoading: boolean;
}

export function useCMSSlot(slotId: string): UseCMSSlotResult {
  const [slot, setSlot] = useState<MediaSlot | undefined>();
  const [currentFiles, setCurrentFiles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const foundSlot = getSlotById(slotId);
    if (foundSlot) {
      setSlot(foundSlot);
      setCurrentFiles(foundSlot.currentFiles);
    }
    setIsLoading(false);
  }, [slotId]);

  const updateFiles = (files: string[]) => {
    setCurrentFiles(files);
    if (slot) {
      // 실제 CMS 업데이트 로직은 여기서 구현
      // 현재는 로컬 상태만 업데이트
      setSlot(prev => prev ? { ...prev, currentFiles: files } : prev);
    }
  };

  return {
    slot,
    currentFiles,
    updateFiles,
    isLoading
  };
}