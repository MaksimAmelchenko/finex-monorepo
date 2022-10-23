import React from 'react';

import { ExportData } from './ExportData/ExportData';
import { HeaderLayout } from '../../components/HeaderLayout/HeaderLayout';
import { getT } from '../../lib/core/i18n';

import styles from './Tools.module.scss';

const t = getT('Tools');

export function Tools(): JSX.Element {
  return (
    <div className={styles.layout}>
      <HeaderLayout title={t('Tools')} className={styles.header} />
      <main className={styles.content}>
        <ExportData />
      </main>
    </div>
  );
}

export default Tools;
