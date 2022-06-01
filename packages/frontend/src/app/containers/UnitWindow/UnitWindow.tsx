import React, { useCallback, useMemo, useRef } from 'react';
import * as Yup from 'yup';
import { FormikHelpers } from 'formik';
import { useSnackbar } from 'notistack';

import { CreateUnitData, IUnit, UpdateUnitChanges } from '../../types/unit';
import { Drawer } from '../../components/Drawer/Drawer';
import { DrawerFooter } from '../../components/Drawer/DrawerFooter';
import { Form, FormButton, FormLayout, FormTextField } from '../../components/Form';
import { Shape } from '../../types';
import { Unit } from '../../stores/models/unit';
import { UnitsRepository } from '../../stores/units-repository';
import { getPatch } from '../../lib/core/get-path';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './UnitWindow.module.scss';

interface UnitFormValues {
  name: string;
}

interface UnitWindowProps {
  isOpened: boolean;
  unit: Partial<IUnit> | Unit;
  onClose: () => unknown;
}

const t = getT('UnitWindow');

function mapValuesToPayload({ name }: UnitFormValues): CreateUnitData {
  return {
    name,
  };
}
export function UnitWindow({ isOpened, unit, onClose }: UnitWindowProps): JSX.Element {
  const unitsRepository = useStore(UnitsRepository);
  const { enqueueSnackbar } = useSnackbar();

  const nameFieldRef = useRef<HTMLInputElement | null>(null);

  const handleOnOpen = useCallback(() => {
    nameFieldRef.current?.focus();
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
          let message: string = '';
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
    [unitsRepository, onClose, unit]
  );

  const validationSchema = useMemo(
    () =>
      Yup.object<Shape<UnitFormValues>>({
        name: Yup.string().required('Please fill name'),
      }),
    []
  );

  const { name } = unit;

  return (
    <Drawer
      isOpened={isOpened}
      title={unit instanceof Unit ? t('Edit unit') : t('Add new unit')}
      onClose={onClose}
      onOpen={handleOnOpen}
    >
      <Form<UnitFormValues>
        onSubmit={onSubmit}
        initialValues={{
          name: name ?? '',
        }}
        validationSchema={validationSchema}
        className={styles.form}
      >
        <div className={styles.form__bodyWrapper}>
          <FormLayout className={styles.form__body}>
            <FormTextField name="name" label={t('Name')} ref={nameFieldRef} />
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
