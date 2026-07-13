import styles from './Footer.module.scss'

interface SiteSettings {
  instagramUrl?: string
  soundcloudUrl?: string
  youtubeUrl?: string
  bandcampUrl?: string
  siteName?: string
}

export default function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.social}>
        {settings.instagramUrl && (
          <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <InstagramSvg />
          </a>
        )}
        {settings.soundcloudUrl && (
          <a href={settings.soundcloudUrl} target="_blank" rel="noopener noreferrer" aria-label="SoundCloud">
            <SoundcloudSvg />
          </a>
        )}
        {settings.youtubeUrl && (
          <a href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
            <YoutubeSvg />
          </a>
        )}
        {settings.bandcampUrl && (
          <a href={settings.bandcampUrl} target="_blank" rel="noopener noreferrer" aria-label="Bandcamp">
            <BandcampSvg />
          </a>
        )}
      </div>
      <p className={styles.copy}>
        © {new Date().getFullYear()} {settings.siteName || 'Falgoush'}
      </p>
    </footer>
  )
}

function InstagramSvg() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function SoundcloudSvg() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M1.175 12.225c-.017.125 0 .25.15.25h.6c.1 0 .175-.1.2-.2l.575-3.2-.575-3.225c-.025-.1-.1-.2-.2-.2h-.6c-.15 0-.175.125-.15.25l.5 3.175zm2.225-1.425l-.65 4c-.025.1.05.2.175.2h.65c.1 0 .175-.1.2-.2l.75-4-.75-4c-.025-.1-.1-.2-.2-.2h-.65c-.125 0-.2.1-.175.2zm2.325-1.825L5 14.8c0 .1.075.175.175.175h.7c.1 0 .175-.075.175-.175l.85-5.825-.85-5.925c0-.1-.075-.175-.175-.175h-.7c-.1 0-.175.075-.175.175zm2.325-1.85l-.875 8.675c0 .1.075.175.175.175h.7c.1 0 .175-.075.175-.175L9.1 14.8l-.875-8.675c0-.1-.075-.175-.175-.175h-.7c-.1 0-.175.075-.175.175zm9.175.775a3.65 3.65 0 00-1.275.225 4.975 4.975 0 00-4.9-4.275 4.95 4.95 0 00-1.525.25c-.15.05-.175.1-.175.175V14.8c0 .1.075.175.175.175h7.7c1.3 0 2.35-1.05 2.35-2.35a2.35 2.35 0 00-2.35-2.35 2.4 2.4 0 00-.25.025A3.65 3.65 0 0017.225 7.9z" />
    </svg>
  )
}

function YoutubeSvg() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
    </svg>
  )
}

function BandcampSvg() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M0 18.75l7.437-13.5H24l-7.438 13.5z" />
    </svg>
  )
}
