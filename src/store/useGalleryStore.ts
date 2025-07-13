import { create } from 'zustand';

interface Image {
  id: string;
  url: string;
  name: string;
  category: string;
  designer: string;
  width?: number;
  height?: number;
  tags?: string[];
  createdAt: Date;
}

interface GalleryState {
  images: Image[];
  selectedImages: string[];
  currentCategory: string;
  currentDesigner: string;
  isUploadModalOpen: boolean;
  isDeleteModalOpen: boolean;
  isLoading: boolean;
  uploadProgress: number;
  
  // Actions
  setImages: (images: Image[]) => void;
  addImage: (image: Image) => void;
  removeImage: (id: string) => void;
  selectImage: (id: string) => void;
  deselectImage: (id: string) => void;
  clearSelection: () => void;
  setCategory: (category: string) => void;
  setDesigner: (designer: string) => void;
  openUploadModal: () => void;
  closeUploadModal: () => void;
  openDeleteModal: () => void;
  closeDeleteModal: () => void;
  setLoading: (loading: boolean) => void;
  setUploadProgress: (progress: number) => void;
}

export const useGalleryStore = create<GalleryState>((set, get) => ({
  images: [],
  selectedImages: [],
  currentCategory: '',
  currentDesigner: '',
  isUploadModalOpen: false,
  isDeleteModalOpen: false,
  isLoading: false,
  uploadProgress: 0,
  
  setImages: (images) => set({ images }),
  addImage: (image) => set((state) => ({ 
    images: [...state.images, image] 
  })),
  removeImage: (id) => set((state) => ({ 
    images: state.images.filter(img => img.id !== id),
    selectedImages: state.selectedImages.filter(imgId => imgId !== id)
  })),
  selectImage: (id) => set((state) => ({
    selectedImages: state.selectedImages.includes(id) 
      ? state.selectedImages 
      : [...state.selectedImages, id]
  })),
  deselectImage: (id) => set((state) => ({
    selectedImages: state.selectedImages.filter(imgId => imgId !== id)
  })),
  clearSelection: () => set({ selectedImages: [] }),
  setCategory: (category) => set({ currentCategory: category }),
  setDesigner: (designer) => set({ currentDesigner: designer }),
  openUploadModal: () => set({ isUploadModalOpen: true }),
  closeUploadModal: () => set({ isUploadModalOpen: false }),
  openDeleteModal: () => set({ isDeleteModalOpen: true }),
  closeDeleteModal: () => set({ isDeleteModalOpen: false }),
  setLoading: (loading) => set({ isLoading: loading }),
  setUploadProgress: (progress) => set({ uploadProgress: progress }),
}));