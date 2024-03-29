import React, { useCallback, useEffect, useMemo } from 'react';
import * as Yup from 'yup';
import { FormikHelpers } from 'formik';
import { useSnackbar } from 'notistack';

import { CreateUnitData, IUnit, UpdateUnitChanges } from '../../types/unit';
import { Form, FormBody, FormButton, FormFooter, FormHeader, FormInput } from '../../components/Form';
import { Shape } from '../../types';
import { Unit } from '../../stores/models/unit';
import { UnitsRepository } from '../../stores/units-repository';
import { analytics } from '../../lib/analytics';
import { getPatch } from '../../lib/core/get-patch';
import { getT } from '../../lib/core/i18n';
import { useCloseOnEscape } from '../../hooks/use-close-on-escape';
import { useStore } from '../../core/hooks/use-store';

interface UnitFormValues {
  name: string;
}

interface UnitWindowProps {
  unit: Partial<IUnit> | Unit;
  onClose: () => unknown;
}

const t = getT('UnitWindow');

function mapValuesToPayload({ name }: UnitFormValues): CreateUnitData {
  return {
    name,
  };
}
export function UnitWindow({ unit, onClose }: UnitWindowProps): JSX.Element {
  const unitsRepository = useStore(UnitsRepository);

  const { enqueueSnackbar } = useSnackbar();
  const { onCanCloseChange } = useCloseOnEscape({ onClose });

  useEffect(() => {
    analytics.view({
      page_title: 'unit',
    });
  }, []);

  const nameFieldRefCallback = useCallback((node: HTMLInputElement | null) => {
    if (node) {
      node.focus();
    }
  }, []);

  const onSubmit = useCallback(
    (values: UnitFormValues, _: FormikHelpers<UnitFormValues>, initialValues: UnitFormValues) => {
      let result: Promise<unknown>;
      if (unit instanceof Unit) {
        const changes: UpdateUnitChanges = getPatch(mapValuesToPayload(initialValues), mapValuesToPayload(values));
        result = unitsRepository.updateUnit(unit, changes);
      } else {
        const data: CreateUnitData = mapValuesToPayload(values);
        result = unitsRepository.createUnit(unit, data);
      }

      return result
        .then(() => {
          onClose();
        })
        .catch(err => {
          let message = '';
          switch (err.code) {
            case 'unit_id_project_name_u':
              message = t('Unit already exists');
              break;
            default:
              message = err.message;
          }
          enqueueSnackbar(message, { variant: 'error' });
        });
    },
    [enqueueSnackbar, onClose, unit, unitsRepository]
  );

  const validationSchema = useMemo(
    () =>
      Yup.object<Shape<UnitFormValues>>({
        name: Yup.string().required(t('Please fill name')),
      }),
    []
  );

  const { name } = unit;

  return (
    <Form<UnitFormValues>
      onSubmit={onSubmit}
      initialValues={{
        name: name ?? '',
      }}
      validationSchema={validationSchema}
      onDirtyChange={dirty => onCanCloseChange(!dirty)}
      name="unit"
    >
      <FormHeader title={unit instanceof Unit ? t('Edit unit') : t('Add new unit')} onClose={onClose} />

      <FormBody>
        <FormInput name="name" label={t('Name')} ref={nameFieldRefCallback} />
      </FormBody>

      <FormFooter>
        <FormButton variant="secondaryGray" isIgnoreValidation onClick={onClose}>
          {t('Cancel')}
        </FormButton>
        <FormButton type="submit" variant="primary" isIgnoreValidation>
          {t('Save')}
        </FormButton>
      </FormFooter>
    </Form>
  );
}
