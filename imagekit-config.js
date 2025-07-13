// ImageKit Configuration
const IMAGEKIT_CONFIG = {
    urlEndpoint: 'https://ik.imagekit.io/t914',
    publicKey: 'public_2BXoL4/MDWL0GjI21rq6iIG1TF8=',
    authenticationEndpoint: '/imagekit-auth' // We'll implement this endpoint later
};

// File validation settings
const FILE_VALIDATION = {
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    allowedVideoTypes: ['video/mp4', 'video/webm'],
    maxImageSize: 50 * 1024 * 1024, // 50MB
    maxVideoSize: 100 * 1024 * 1024, // 100MB
    allowedExtensions: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'mp4', 'webm']
};

// Folder structure for Redux
const FOLDER_STRUCTURE = {
    main: '/redux/main/',
    about: '/redux/about/',
    fashionFilm: '/redux/fashion-film/',
    memory: '/redux/memory/',
    visualArt: '/redux/visual-art/',
    process: '/redux/process/',
    designers: {
        kimBomin: '/redux/designers/kim-bomin/',
        parkParang: '/redux/designers/park-parang/',
        leeTaehyeon: '/redux/designers/lee-taehyeon/',
        choiEunsol: '/redux/designers/choi-eunsol/',
        hwangJinsu: '/redux/designers/hwang-jinsu/',ㅊ
        kimGyeongsu: '/redux/designers/kim-gyeongsu/'
    },
    test: '/redux/test/'
};

// Initialize ImageKit (only when admin is logged in)
function initializeImageKit() {
    return new Promise((resolve, reject) => {
        if (typeof ImageKit === 'undefined') {
            reject(new Error('ImageKit SDK not loaded'));
            return;
        }

        try {
            const imagekit = new ImageKit({
                publicKey: IMAGEKIT_CONFIG.publicKey,
                urlEndpoint: IMAGEKIT_CONFIG.urlEndpoint,
                authenticationEndpoint: getAuthenticationEndpoint
            });
            resolve(imagekit);
        } catch (error) {
            reject(error);
        }
    });
}

// Authentication endpoint function for ImageKit
function getAuthenticationEndpoint() {
    return new Promise((resolve, reject) => {
        try {
            // For testing, we'll use client-side auth (not recommended for production)
            const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            const expire = Math.floor(Date.now() / 1000) + 2400; // 40 minutes
            
            resolve({
                token: token,
                expire: expire,
                signature: 'test_signature_' + Date.now() // Mock signature for testing
            });
        } catch (error) {
            reject(error);
        }
    });
}

// Sanitize filename
function sanitizeFilename(filename) {
    // Get file extension
    const lastDotIndex = filename.lastIndexOf('.');
    const name = filename.substring(0, lastDotIndex);
    const extension = filename.substring(lastDotIndex + 1);
    
    // Remove special characters and replace spaces with hyphens
    const sanitizedName = name
        .replace(/[^a-zA-Z0-9-_]/g, '-')
        .replace(/-+/g, '-')
        .toLowerCase();
    
    // Add timestamp to prevent duplicates
    const timestamp = Date.now();
    
    return `${sanitizedName}-${timestamp}.${extension}`;
}

// Validate file
function validateFile(file) {
    const fileType = file.type;
    const fileSize = file.size;
    const fileName = file.name;
    const extension = fileName.split('.').pop().toLowerCase();
    
    // Check extension
    if (!FILE_VALIDATION.allowedExtensions.includes(extension)) {
        return {
            valid: false,
            error: `File type .${extension} is not allowed. Allowed types: ${FILE_VALIDATION.allowedExtensions.join(', ')}`
        };
    }
    
    // Check if it's an image
    if (FILE_VALIDATION.allowedImageTypes.includes(fileType)) {
        if (fileSize > FILE_VALIDATION.maxImageSize) {
            return {
                valid: false,
                error: `Image size exceeds 50MB limit. Current size: ${(fileSize / 1024 / 1024).toFixed(2)}MB`
            };
        }
    }
    // Check if it's a video
    else if (FILE_VALIDATION.allowedVideoTypes.includes(fileType)) {
        if (fileSize > FILE_VALIDATION.maxVideoSize) {
            return {
                valid: false,
                error: `Video size exceeds 100MB limit. Current size: ${(fileSize / 1024 / 1024).toFixed(2)}MB`
            };
        }
    }
    // Unknown file type
    else {
        return {
            valid: false,
            error: `File type ${fileType} is not supported`
        };
    }
    
    return { valid: true };
}

// Show toast message
function showToast(message, type = 'success') {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.imagekit-toast');
    existingToasts.forEach(toast => toast.remove());
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'imagekit-toast';
    toast.textContent = message;
    
    // Style based on type
    const baseStyles = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 16px 24px;
        border-radius: 4px;
        font-family: 'Space Grotesk', sans-serif;
        font-size: 14px;
        letter-spacing: 0.5px;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    
    if (type === 'success') {
        toast.style.cssText = baseStyles + `
            background: #4CAF50;
            color: white;
        `;
    } else if (type === 'error') {
        toast.style.cssText = baseStyles + `
            background: #f44336;
            color: white;
        `;
    } else {
        toast.style.cssText = baseStyles + `
            background: #333;
            color: white;
        `;
    }
    
    // Add to body
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.opacity = '1';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        IMAGEKIT_CONFIG,
        FILE_VALIDATION,
        FOLDER_STRUCTURE,
        initializeImageKit,
        sanitizeFilename,
        validateFile,
        showToast
    };
}