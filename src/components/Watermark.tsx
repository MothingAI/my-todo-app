import styles from '../styles/Watermark.module.css'

// Version from package.json
const APP_VERSION = '1.0.0'
const APP_NAME = 'My Todo App'

export function Watermark() {
  return (
    <div className={styles.watermark} aria-hidden="true">
      <div className={styles.line}>{APP_NAME} v{APP_VERSION}</div>
      <div className={styles.line}>made by chenstar</div>
    </div>
  )
}
