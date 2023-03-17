import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import { useField, useFormikContext } from 'formik';

import { Contractor } from '../../stores/models/contractor';
import { ContractorsMobile } from '../ContractorsMobile/ContractorsMobile';
import { ContractorsRepository } from '../../stores/contractors-repository';
import { Dropdown, Input } from '@finex/ui-kit';
import { IFormInputProps } from '../../components/Form';
import { useStore } from '../../core/hooks/use-store';

interface ContractorFieldProps extends Omit<IFormInputProps, 'endAdornment'> {}

export const ContractorField = forwardRef<HTMLInputElement, ContractorFieldProps>(({ name, ...props }, ref) => {
  const categoriesRepository = useStore(ContractorsRepository);

  const [openContractors, setOpenContractors] = useState<boolean>(false);

  const { setFieldValue, setFieldTouched } = useFormikContext<any>();
  const [{ value: contractorId }, meta] = useField(name);

  const contractor = useMemo(() => categoriesRepository.get(contractorId), [contractorId]);

  const handleContractorDropdownClick = useCallback(() => {
    setOpenContractors(true);
  }, []);

  const handleContractorSelect = useCallback(
    (contractor: Contractor) => {
      setFieldValue(name, contractor.id);
      setFieldTouched(name, true, false);
      setOpenContractors(false);
    },
    [name]
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
        endAdornment={<Dropdown onClick={handleContractorDropdownClick} />}
        onClick={handleContractorDropdownClick}
        ref={ref}
      />

      <ContractorsMobile open={openContractors} onSelect={handleContractorSelect} onClose={handleContractorsClose} />
    </>
  );
});
