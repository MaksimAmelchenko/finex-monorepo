import React, { useCallback, useMemo, useRef } from 'react';
import * as Yup from 'yup';
import { FormikHelpers } from 'formik';
import { useSnackbar } from 'notistack';

import { Contractor } from '../../stores/models/contractor';
import { ContractorsRepository } from '../../stores/contractors-repository';
import { CreateContractorData, IContractor, UpdateContractorChanges } from '../../types/contractor';
import { Drawer } from '../../components/Drawer/Drawer';
import { DrawerFooter } from '../../components/Drawer/DrawerFooter';
import { Form, FormButton, FormLayout, FormTextField } from '../../components/Form';
import { FormTextAreaField } from '../../components/Form/FormTextArea/FormTextField';
import { Shape } from '../../types';
import { getPatch } from '../../lib/core/get-path';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './ContractorWindow.module.scss';

interface ContractorFormValues {
  name: string;
  note: string;
}

interface ContractorWindowProps {
  isOpened: boolean;
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
export function ContractorWindow({ isOpened, contractor, onClose }: ContractorWindowProps): JSX.Element {
  const contractorsRepository = useStore(ContractorsRepository);
  const { enqueueSnackbar } = useSnackbar();

  const nameFieldRef = useRef<HTMLInputElement | null>(null);

  const handleOnOpen = useCallback(() => {
    nameFieldRef.current?.focus();
  }, []);

  const onSubmit = useCallback(
    (values: ContractorFormValues, _: FormikHelpers<ContractorFormValues>, initialValues: ContractorFormValues) => {
      let result: Promise<unknown>;
      if (contractor instanceof Contractor) {
        const changes: UpdateContractorChanges = getPatch(
          mapValuesToPayload(initialValues),
          mapValuesToPayload(values)
        );
        result = contractorsRepository.updateContractor(contractor, changes);
      } else {
        const data: CreateContractorData = mapValuesToPayload(values);
        result = contractorsRepository.createContractor(contractor, data);
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
    [contractor, contractorsRepository, enqueueSnackbar, onClose]
  );

  const validationSchema = useMemo(
    () =>
      Yup.object<Shape<ContractorFormValues>>({
        name: Yup.string().required('Please fill name'),
      }),
    []
  );

  const { name, note } = contractor;

  return (
    <Drawer
      isOpened={isOpened}
      title={contractor instanceof Contractor ? t('Edit contractor') : t('Add new contractor')}
      onClose={onClose}
      onOpen={handleOnOpen}
    >
      <Form<ContractorFormValues>
        onSubmit={onSubmit}
        initialValues={{
          name: name ?? '',
          note: note ?? '',
        }}
        validationSchema={validationSchema}
        className={styles.form}
      >
        <div className={styles.form__bodyWrapper}>
          <FormLayout className={styles.form__body}>
            <FormTextField name="name" label={t('Name')} ref={nameFieldRef} />
            <FormTextAreaField name="note" label={t('Note')} />
          </FormLayout>
        </div>
        <DrawerFooter className={styles.footer}>
          <FormButton variant="outlined" isIgnoreValidation onClick={onClose}>
            {t('Cancel')}
          </FormButton>
          <FormButton type="submit" color="secondary" isIgnoreValidation>
            {t('Save')}
          </FormButton>
        </DrawerFooter>
      </Form>
    </Drawer>
  );
}
