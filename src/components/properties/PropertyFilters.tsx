import React from 'react';
import styles from './PropertyFilters.module.css';

export const PropertyFilters: React.FC = () => {
  return (
    <aside className={styles.filters}>
      <h3 className={styles.title}>Filter Search</h3>
      
      <div className={styles.group}>
        <label>Property Type</label>
        <select>
          <option>All Types</option>
          <option>Apartment</option>
          <option>House</option>
          <option>Villa</option>
          <option>Penthouse</option>
        </select>
      </div>

      <div className={styles.group}>
        <label>Price Range</label>
        <div className={styles.range}>
          <input type="number" placeholder="Min" />
          <input type="number" placeholder="Max" />
        </div>
      </div>

      <div className={styles.group}>
        <label>Bedrooms</label>
        <div className={styles.chips}>
          <button className={styles.chip}>Any</button>
          <button className={styles.chip}>1+</button>
          <button className={styles.chip}>2+</button>
          <button className={styles.chip}>3+</button>
          <button className={styles.chip}>4+</button>
        </div>
      </div>

      <div className={styles.group}>
        <label>Amenities</label>
        <div className={styles.checkboxes}>
          <label className={styles.checkbox}>
            <input type="checkbox" /> Parking
          </label>
          <label className={styles.checkbox}>
            <input type="checkbox" /> Pool
          </label>
          <label className={styles.checkbox}>
            <input type="checkbox" /> Garden
          </label>
          <label className={styles.checkbox}>
            <input type="checkbox" /> Gym
          </label>
        </div>
      </div>

      <button className={styles.applyBtn}>Apply Filters</button>
      <button className={styles.resetBtn}>Reset All</button>
    </aside>
  );
};
