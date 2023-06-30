import React, { useCallback } from 'react';
import { useSnackbar } from 'notistack';

import { Form, FormButton, FormLayout } from '../../../components/Form';
import { ToolsApi } from '../../../stores/api/tools-api';
import { getT } from '../../../lib/core/i18n';
import { useStore } from '../../../core/hooks/use-store';

import styles from '../Tools.module.scss';

const t = getT('ExportData');

export function ExportData(): JSX.Element {
  const toolsApi = useStore(ToolsApi);
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = useCallback(() => {
    return toolsApi
      .exportData()
      .then(() => {
        enqueueSnackbar(t('Data export started. In a few minutes you will receive the file by e-mail'), {
          variant: 'success',
        });
      })
      .catch(err => {
        let message = '';
        switch (err.code) {
          default:
            message = err.message;
        }
        enqueueSnackbar(message, { variant: 'error' });

        throw err;
      });
  }, [toolsApi, enqueueSnackbar]);

  return (
    <div className={styles.section}>
      <div className={styles.section__sidebar}>
        <h2 className={styles.section__title}>{t('Export Data')}</h2>
      </div>

      <div className={styles.section__content}>
        <Form onSubmit={onSubmit} initialValues={{}} name="export-data">
          <FormLayout>
            <p>{t('Export data in CSV file. The data will be sent to your e-mail.')}</p>
          </FormLayout>
          <footer className={styles.form__footer}>
            <FormButton type="submit" size="lg" isIgnoreValidation>
              {t('Export')}
            </FormButton>
          </footer>
        </Form>
      </div>
    </div>
  );
}
