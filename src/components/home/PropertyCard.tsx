import Link from 'next/link';
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
  type
}) => {
  return (
    <Link href={`/properties/${id}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        <div className={styles.badge}>{type}</div>
        <img src={image} alt={title} className={styles.image} />
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
