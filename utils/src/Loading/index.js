import React from 'react';
import styles from './loading.module.less'

export const Loading = ({props}) => {
  return (
    <section className={styles.loadCon}>
      <div className={styles.loadConData}>
        <div className={styles.loadCol}>
          <span></span>
          <span></span>
        </div>
        <div className={styles.loadCol}>
          <span></span>
          <span></span>
        </div>
      </div>
    </section>
  );
};

