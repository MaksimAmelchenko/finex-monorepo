import React, { FC } from 'react';

import { Link } from 'react-router-dom';

import styles from './NotFound.module.css';

export const NotFound: FC = () => {
  return (
    <div className={styles.notFound}>
      <h1>Error 404</h1>
      <p>That page doesn&apos;t exist.</p>
      <Link to="/">
        <h4>Back to Home</h4>
      </Link>
    </div>
  );
};

export default NotFound;
