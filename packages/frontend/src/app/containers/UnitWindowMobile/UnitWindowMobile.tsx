import React, { useCallback, useEffect, useMemo } from 'react';
import * as Yup from 'yup';
import { FormikHelpers } from 'formik';
import { useSnackbar } from 'notistack';

import { BackButton, DeleteButton, Header } from '../../components/Header/Header';
import { CreateUnitData, IUnit, UpdateUnitChanges } from '../../types/unit';
import { Form, FormBody, FormButton, FormInput } from '../../components/Form';
import { Shape } from '../../types';
import { Unit } from '../../stores/models/unit';
import { UnitsRepository } from '../../stores/units-repository';
import { analytics } from '../../lib/analytics';
import { getPatch } from '../../lib/core/get-patch';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './UnitWindowMobile.module.scss';

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
export function UnitWindowMobile({ unit, onClose }: UnitWindowProps): JSX.Element {
  const unitsRepository = useStore(UnitsRepository);

  const { enqueueSnackbar } = useSnackbar();

  const isNew = !(unit instanceof Unit);

  useEffect(() => {
    analytics.view({
      page_title: 'unit-mobile',
    });
  }, []);

  const nameFieldRefCallback = useCallback((node: HTMLInputElement | null) => {
    if (node) {
      // node.focus();
      requestAnimationFrame(() => node.focus());
    }
  }, []);

  const onSubmit = useCallback(
    (values: UnitFormValues, _: FormikHelpers<UnitFormValues>, initialValues: UnitFormValues) => {
      let result: Promise<unknown>;
      if (isNew) {
        const data: CreateUnitData = mapValuesToPayload(values);
        result = unitsRepository.createUnit(unit, data);
      } else {
        const changes: UpdateUnitChanges = getPatch(mapValuesToPayload(initialValues), mapValuesToPayload(values));
        result = unitsRepository.updateUnit(unit, changes);
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

  const handleDeleteClick = () => {
    unitsRepository
      .deleteUnit(unit as Unit)
      .then(() => {
        onClose();
      })
      .catch(err => {
        let message = '';
        switch (err.code) {
          case 'cashflow_detail_2_unit': {
            message = t("You can't delete unit with transaction");
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
      name="unit-mobile"
    >
      <Header
        title={isNew ? t('Add new unit') : t('Edit unit')}
        startAdornment={<BackButton onClick={onClose} />}
        endAdornment={!isNew && <DeleteButton onClick={handleDeleteClick} />}
      />
      <FormBody className={styles.main}>
        <FormInput name="name" label={t('Name')} ref={nameFieldRefCallback} />
      </FormBody>

      <footer className={styles.footer}>
        <FormButton type="submit" color="primary" isIgnoreValidation>
          {t('Save')}
        </FormButton>
      </footer>
    </Form>
  );
}
