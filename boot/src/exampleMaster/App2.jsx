import React from 'react';
import styles from './app2mod.module.less';
export default (props) => (
  <div>
    app2
    <div className={styles.colorTest}>red1</div>dd
    <div className={styles.red2}>red2</div>
    <div className={styles.red3}>red3</div>
    <div className={styles.red4}>
      <div className='globalColor'>
        red4.1
        <div className='cla'>
          red4.2
        </div>
      </div>
    </div>
  </div>
)

