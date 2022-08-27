import React, { useMemo } from 'react';

import { FormInlineSelect, FormTextField } from '../../components/Form';
import { IOption } from '@finex/ui-kit';
import { UnitsRepository } from '../../stores/units-repository';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './QuantityField.module.scss';

const t = getT('QuantityField');

function UnitSelect(): JSX.Element {
  const unitsRepository = useStore(UnitsRepository);

  const selectUnitsOptions = useMemo<IOption[]>(() => {
    return [{ value: '', label: '' }, ...unitsRepository.units.map(({ id: value, name: label }) => ({ value, label }))];
  }, [unitsRepository.units]);

  return (
    <div className={styles.select}>
      <div className={styles.select__delimiter} />
      <FormInlineSelect name="unitId" options={selectUnitsOptions} className={styles.select__target} />
    </div>
  );
}

export function QuantityField(): JSX.Element {
  return <FormTextField name="quantity" label={t('Quantity')} endAdornment={UnitSelect} />;
}
