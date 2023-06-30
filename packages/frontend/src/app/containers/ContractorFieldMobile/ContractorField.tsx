import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import { useField, useFormikContext } from 'formik';

import { Clear, Dropdown, Input } from '@finex/ui-kit';
import { Contractor } from '../../stores/models/contractor';
import { ContractorsMobile } from '../ContractorsMobile/ContractorsMobile';
import { ContractorsRepository } from '../../stores/contractors-repository';
import { IFormInputProps } from '../../components/Form';
import { useStore } from '../../core/hooks/use-store';

interface ContractorFieldProps extends Omit<IFormInputProps, 'endAdornment'> {
  isClearable?: boolean;
}

export const ContractorField = forwardRef<HTMLInputElement, ContractorFieldProps>(
  ({ name, isClearable = false, ...props }, ref) => {
    const categoriesRepository = useStore(ContractorsRepository);

    const [openContractors, setOpenContractors] = useState<boolean>(false);

    const { setFieldValue, setFieldTouched } = useFormikContext<any>();
    const [{ value: contractorId }, meta] = useField(name);

    const contractor = useMemo(() => categoriesRepository.get(contractorId), [categoriesRepository, contractorId]);

    const handleContractorDropdownClick = useCallback(() => {
      setOpenContractors(true);
    }, []);

    const handleContractorCleanClick = useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        setFieldValue(name, null);
        setFieldTouched(name, true, false);
      },
      [name, setFieldTouched, setFieldValue]
    );

    const handleContractorSelect = useCallback(
      (contractor: Contractor) => {
        setFieldValue(name, contractor.id);
        setFieldTouched(name, true, false);
        setOpenContractors(false);
      },
      [name, setFieldTouched, setFieldValue]
    );

    const handleContractorsClose = useCallback(() => {
      setOpenContractors(false);
    }, []);

    return (
      <>
        <Input
          {...props}
          value={contractor?.name ?? ''}
          readOnly
          errorText={meta.error}
          endAdornment={
            <>
              {isClearable && <Clear onClick={handleContractorCleanClick} />}
              <Dropdown onClick={handleContractorDropdownClick} />
            </>
          }
          onClick={handleContractorDropdownClick}
          ref={ref}
        />

        <ContractorsMobile open={openContractors} onSelect={handleContractorSelect} onClose={handleContractorsClose} />
      </>
    );
  }
);
