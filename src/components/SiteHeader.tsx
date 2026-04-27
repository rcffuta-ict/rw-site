import Link from "next/link";
import styles from "./siteHeader.module.css";

const links: Array<{ href: string; label: string }> = [
  { href: "/programme", label: "Programme" },
  { href: "/merch", label: "Merch" },
  { href: "/order", label: "Pre-order" },
  { href: "/gallery", label: "Gallery" },
  { href: "/archive", label: "Archive" },
];

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand}>
          <span className={styles.badge}>RW</span>
          <span className={styles.brandText}>
            <span className={styles.title}>Redemption Week</span>
            <span className={styles.subtitle}>RCF FUTA</span>
          </span>
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={styles.link}>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

