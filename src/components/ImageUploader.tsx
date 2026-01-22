import { useRef, ChangeEvent, useState } from 'react'
import { useTodos } from '../hooks/useTodos'
import { useLanguage } from '../contexts/LanguageContext'
import { compressImage, validateImageFile } from '../utils/imageCompression'
import type { SubtaskImage } from '../types/todo'
import styles from '../styles/ImageUploader.module.css'

interface ImageUploaderProps {
  todoId: string
  subtaskId: string
  images: SubtaskImage[]
  onImagesChange: (images: SubtaskImage[]) => void
  maxImages?: number
}

export function ImageUploader({ todoId, subtaskId, images, onImagesChange, maxImages = 5 }: ImageUploaderProps) {
  const { dispatch } = useTodos()
  const { t } = useLanguage()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [compressing, setCompressing] = useState(false)

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Validate images
    const validFiles = files.filter((file) => {
      const validation = validateImageFile(file)
      if (!validation.valid) {
        alert(validation.error)
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    // Check limit
    if (images.length + validFiles.length > maxImages) {
      alert(t('maxImagesReached', { max: maxImages }))
      return
    }

    // Compress images
    setCompressing(true)
    try {
      const compressedImages: SubtaskImage[] = []

      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i]
        try {
          const compressed = await compressImage(file, {
            maxWidth: 1920,
            maxHeight: 1080,
            quality: 0.8,
            maxSizeKB: 500,
          })

          const subtaskImage: SubtaskImage = {
            id: crypto.randomUUID(),
            data: compressed.dataUrl,
            name: file.name,
            size: file.size,
            compressedSize: compressed.size,
            uploadedAt: Date.now(),
          }

          compressedImages.push(subtaskImage)

          // If this is for an existing subtask, dispatch ADD_SUBTASK_IMAGE
          if (subtaskId) {
            dispatch({
              type: 'ADD_SUBTASK_IMAGE',
              todoId,
              subtaskId,
              image: subtaskImage,
            })
          }
        } catch (error) {
          console.error('Failed to compress image:', error)
          alert(`${t('compressingImage')} ${file.name}... ${error}`)
        }
      }

      // Update parent component state
      onImagesChange([...images, ...compressedImages])
    } catch (error) {
      console.error('Failed to process images:', error)
      alert(t('imageTooLarge'))
    } finally {
      setCompressing(false)
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemoveImage = (imageId: string) => {
    // If this is for an existing subtask, dispatch DELETE_SUBTASK_IMAGE
    if (subtaskId) {
      dispatch({
        type: 'DELETE_SUBTASK_IMAGE',
        todoId,
        subtaskId,
        imageId,
      })
    }

    // Update parent component state
    onImagesChange(images.filter((img) => img.id !== imageId))
  }

  return (
    <div className={styles.uploader}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        multiple
        onChange={handleFileSelect}
        className={styles.fileInput}
        disabled={compressing || images.length >= maxImages}
      />

      <button
        type="button"
        className={styles.uploadButton}
        onClick={() => fileInputRef.current?.click()}
        disabled={compressing || images.length >= maxImages}
      >
        {compressing ? t('compressingImage') : `📷 ${t('uploadImage')}`}
      </button>

      {images.length > 0 && (
        <div className={styles.previews}>
          {images.map((image) => (
            <div key={image.id} className={styles.preview}>
              <img src={image.data} alt={image.name} />
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => handleRemoveImage(image.id)}
                title={t('deleteImage')}
              >
                ✕
              </button>
              <div className={styles.imageInfo}>
                <span className={styles.imageName}>{image.name}</span>
                <span className={styles.imageSize}>
                  {((image.compressedSize || image.size) / 1024).toFixed(1)} KB
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
