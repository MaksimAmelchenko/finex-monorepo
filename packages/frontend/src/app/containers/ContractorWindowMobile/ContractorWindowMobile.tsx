import React, { useCallback, useEffect, useMemo } from 'react';
import * as Yup from 'yup';
import { FormikHelpers } from 'formik';
import { useSnackbar } from 'notistack';

import { BackButton, DeleteButton, Header } from '../../components/Header/Header';
import { Contractor } from '../../stores/models/contractor';
import { ContractorsRepository } from '../../stores/contractors-repository';
import { CreateContractorData, IContractor, UpdateContractorChanges } from '../../types/contractor';
import { Form, FormBody, FormButton, FormInput, FormTextArea } from '../../components/Form';
import { Shape } from '../../types';
import { analytics } from '../../lib/analytics';
import { getPatch } from '../../lib/core/get-patch';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './ContractorWindowMobile.module.scss';

interface ContractorFormValues {
  name: string;
  note: string;
}

interface ContractorWindowProps {
  contractor: Partial<IContractor> | Contractor;
  onClose: () => unknown;
}

const t = getT('ContractorWindow');

function mapValuesToPayload({ name, note }: ContractorFormValues): CreateContractorData {
  return {
    name,
    note,
  };
}

export function ContractorWindowMobile({ contractor, onClose }: ContractorWindowProps): JSX.Element {
  const contractorsRepository = useStore(ContractorsRepository);

  const { enqueueSnackbar } = useSnackbar();

  const isNew = !(contractor instanceof Contractor);

  useEffect(() => {
    analytics.view({
      page_title: 'contractor-mobile',
    });
  }, []);

  const nameFieldRefCallback = useCallback((node: HTMLInputElement | null) => {
    if (node) {
      // node.focus();
      requestAnimationFrame(() => node.focus());
    }
  }, []);

  const onSubmit = useCallback(
    (values: ContractorFormValues, _: FormikHelpers<ContractorFormValues>, initialValues: ContractorFormValues) => {
      let result: Promise<unknown>;
      if (isNew) {
        const data: CreateContractorData = mapValuesToPayload(values);
        result = contractorsRepository.createContractor(contractor, data);
      } else {
        const changes: UpdateContractorChanges = getPatch(
          mapValuesToPayload(initialValues),
          mapValuesToPayload(values)
        );
        result = contractorsRepository.updateContractor(contractor, changes);
      }

      return result
        .then(() => {
          onClose();
        })
        .catch(err => {
          let message = '';
          switch (err.code) {
            case 'contractor_id_project_name_u':
              message = t('Contractor already exists');
              break;
            default:
              message = err.message;
          }
          enqueueSnackbar(message, { variant: 'error' });
        });
    },
    [contractor, contractorsRepository, enqueueSnackbar, isNew, onClose]
  );

  const handleDeleteClick = () => {
    contractorsRepository
      .deleteContractor(contractor as Contractor)
      .then(() => {
        onClose();
      })
      .catch(err => {
        let message = '';
        switch (err.code) {
          case 'cashflow_2_contractor': {
            message = t("You can't delete contractor with transaction");
            break;
          }
          default:
            message = err.message;
        }
        enqueueSnackbar(message, { variant: 'error' });
      });
  };

  const validationSchema = useMemo(
    () =>
      Yup.object<Shape<ContractorFormValues>>({
        name: Yup.string().required(t('Please fill name')),
      }),
    []
  );

  const { name, note } = contractor;

  return (
    <Form<ContractorFormValues>
      onSubmit={onSubmit}
      initialValues={{
        name: name ?? '',
        note: note ?? '',
      }}
      validationSchema={validationSchema}
      name="contractor-mobile"
    >
      <Header
        title={isNew ? t('Add new contractor') : t('Edit contractor')}
        startAdornment={<BackButton onClick={onClose} />}
        endAdornment={!isNew && <DeleteButton onClick={handleDeleteClick} />}
      />
      <FormBody className={styles.main}>
        <FormInput name="name" label={t('Name')} ref={nameFieldRefCallback} autoComplete="off" />

        <FormTextArea name="note" label={t('Note')} />
      </FormBody>

      <footer className={styles.footer}>
        <FormButton type="submit" variant="primary" isIgnoreValidation>
          {t('Save')}
        </FormButton>
      </footer>
    </Form>
  );
}
