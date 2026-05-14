import Link from 'next/link';
import Image from 'next/image';
import styles from './PropertyCard.module.css';

interface PropertyCardProps {
  id: string;
  image: string;
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  sqft: number;
  type: string;
  isUnavailable?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  image,
  title,
  location,
  price,
  beds,
  baths,
  sqft,
  type,
  isUnavailable = false
}) => {
  return (
    <Link href={`/properties/${id}`} className={`${styles.card} ${isUnavailable ? styles.unavailableCard : ''}`}>
      <div className={styles.imageWrapper}>
        <div className={styles.badge}>{type}</div>
        {isUnavailable && <div className={styles.unavailableBadge}>Unavailable</div>}
        <Image
          src={image}
          alt={`${title} — ${location}`}
          className={styles.image}
          width={400}
          height={300}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
          loading="lazy"
        />
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <span className={styles.price}>{price}</span>
        </div>
        <p className={styles.location}>{location}</p>
        <div className={styles.details}>
          <div className={styles.detail}>
            <span>{beds}</span> Beds
          </div>
          <div className={styles.detail}>
            <span>{baths}</span> Baths
          </div>
          <div className={styles.detail}>
            <span>{sqft}</span> Sqft
          </div>
        </div>
      </div>
    </Link>
  );
};
