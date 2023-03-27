import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import { useField, useFormikContext } from 'formik';

import { Dropdown, Input } from '@finex/ui-kit';
import { IFormInputProps } from '../../components/Form';
import { Unit } from '../../stores/models/unit';
import { UnitsMobile } from '../UnitsMobile/UnitsMobile';
import { UnitsRepository } from '../../stores/units-repository';
import { useStore } from '../../core/hooks/use-store';

interface QuantityFieldProps extends Omit<IFormInputProps, 'name' | 'endAdornment'> {
  quantityFieldName: string;
  unitFieldName: string;
}

export const QuantityField = forwardRef<HTMLInputElement, QuantityFieldProps>(
  ({ quantityFieldName, unitFieldName, ...props }, ref) => {
    const unitsRepository = useStore(UnitsRepository);

    const [openUnits, setOpenUnits] = useState<boolean>(false);

    const { setFieldValue, setFieldTouched } = useFormikContext<any>();

    const [quantityFieldProps, meta] = useField(quantityFieldName);
    const [{ value: unitId }] = useField(unitFieldName);

    const unit = useMemo(() => unitsRepository.get(unitId), [unitId, unitsRepository]);

    const handleUnitDropdownClick = useCallback(() => {
      setOpenUnits(true);
    }, []);

    const handleUnitSelect = useCallback(
      (unit: Unit) => {
        setFieldValue(unitFieldName, unit.id);
        setFieldTouched(unitFieldName, true, false);
        setOpenUnits(false);
      },
      [setFieldTouched, setFieldValue, unitFieldName]
    );

    const handleUnitsClose = useCallback(() => {
      setOpenUnits(false);
    }, []);

    const joinedProps = { ...props, ...quantityFieldProps };

    return (
      <>
        <Input
          {...joinedProps}
          inputMode="decimal"
          errorText={meta.error}
          endAdornment={<Dropdown text={unit?.name || ''} onClick={handleUnitDropdownClick} />}
          ref={ref}
        />

        <UnitsMobile open={openUnits} onSelect={handleUnitSelect} onClose={handleUnitsClose} />
      </>
    );
  }
);
