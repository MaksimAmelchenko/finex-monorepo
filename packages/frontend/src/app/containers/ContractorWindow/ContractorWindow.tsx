import React, { useCallback, useMemo } from 'react';
import * as Yup from 'yup';
import { FormikHelpers } from 'formik';
import { useSnackbar } from 'notistack';

import { Contractor } from '../../stores/models/contractor';
import { ContractorsRepository } from '../../stores/contractors-repository';
import { CreateContractorData, IContractor, UpdateContractorChanges } from '../../types/contractor';
import {
  Form,
  FormBody,
  FormButton,
  FormFooter,
  FormHeader,
  FormTextAreaField,
  FormTextField,
} from '../../components/Form';
import { Shape } from '../../types';
import { getPatch } from '../../lib/core/get-path';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

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
export function ContractorWindow({ contractor, onClose }: ContractorWindowProps): JSX.Element {
  const contractorsRepository = useStore(ContractorsRepository);
  const { enqueueSnackbar } = useSnackbar();

  const nameFieldRefCallback = useCallback((node: HTMLInputElement | null) => {
    if (node) {
      node.focus();
    }
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
    <Form<ContractorFormValues>
      onSubmit={onSubmit}
      initialValues={{
        name: name ?? '',
        note: note ?? '',
      }}
      validationSchema={validationSchema}
    >
      <FormHeader
        title={contractor instanceof Contractor ? t('Edit contractor') : t('Add new contractor')}
        onClose={onClose}
      />
      <FormBody>
        <FormTextField name="name" label={t('Name')} ref={nameFieldRefCallback} />
        <FormTextAreaField name="note" label={t('Note')} />
      </FormBody>

      <FormFooter>
        <FormButton variant="outlined" isIgnoreValidation onClick={onClose}>
          {t('Cancel')}
        </FormButton>
        <FormButton type="submit" color="secondary" isIgnoreValidation>
          {t('Save')}
        </FormButton>
      </FormFooter>
    </Form>
  );
}
