export interface CompressionOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number // 0.1 to 1.0
  maxSizeKB?: number // Target maximum size in KB
}

export interface CompressedImage {
  dataUrl: string
  size: number
  width: number
  height: number
}

/**
 * Compress an image file using canvas
 * @param file - The image file to compress
 * @param options - Compression options
 * @returns Promise with compressed image data
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<CompressedImage> {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.8,
    maxSizeKB = 500,
  } = options

  return new Promise((resolve, reject) => {
    const img = new Image()
    const reader = new FileReader()

    reader.onload = (e) => {
      img.src = e.target?.result as string
    }

    img.onload = () => {
      // Calculate dimensions maintaining aspect ratio
      let width = img.width
      let height = img.height

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width = width * ratio
        height = height * ratio
      }

      // Create canvas and draw resized image
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Failed to get canvas context'))
        return
      }

      ctx.drawImage(img, 0, 0, width, height)

      // Try compressing with decreasing quality until size fits
      let currentQuality = quality
      let dataUrl = ''
      let size = 0

      const attemptCompression = () => {
        dataUrl = canvas.toDataURL('image/jpeg', currentQuality)
        // Approximate base64 size (base64 is ~33% larger than binary)
        size = Math.round((dataUrl.length * 3) / 4)

        if (size <= maxSizeKB * 1024 || currentQuality <= 0.1) {
          resolve({
            dataUrl,
            size,
            width,
            height,
          })
        } else {
          currentQuality -= 0.1
          attemptCompression()
        }
      }

      attemptCompression()
    }

    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsDataURL(file)
  })
}

/**
 * Validate image file
 * @param file - The file to validate
 * @returns Object with valid flag and optional error message
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 5 * 1024 * 1024 // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload JPEG, PNG, GIF, or WebP images.',
    }
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File too large. Maximum size is 5MB, your file is ${(file.size / 1024 / 1024).toFixed(2)}MB.`,
    }
  }

  return { valid: true }
}
