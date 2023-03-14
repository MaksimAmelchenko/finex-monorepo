import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import { useField, useFormikContext } from 'formik';

import { CategoriesMobile } from '../CategoriesMobile/CategoriesMobile_';
import { CategoriesRepository } from '../../stores/categories-repository';
import { Category } from '../../stores/models/category';
import { Dropdown, Input } from '@finex/ui-kit';
import { IFormInputProps } from '../../components/Form';
import { useStore } from '../../core/hooks/use-store';

interface CategoryFieldProps extends Omit<IFormInputProps, 'endAdornment'> {}

export const CategoryField = forwardRef<HTMLInputElement, CategoryFieldProps>(({ name, ...props }, ref) => {
  const categoriesRepository = useStore(CategoriesRepository);

  const [openCategories, setOpenCategories] = useState<boolean>(false);

  const { setFieldValue, setFieldTouched } = useFormikContext<any>();
  const [{ value: categoryId }, meta] = useField(name);

  const category = useMemo(() => categoriesRepository.get(categoryId), [categoryId]);

  const handleCategoryDropdownClick = useCallback(() => {
    setOpenCategories(true);
  }, []);

  const handleCategorySelect = useCallback(
    (category: Category) => {
      setFieldValue(name, category.id);
      setFieldTouched(name, true, false);
      setOpenCategories(false);
    },
    [name]
  );

  const handleCategoriesClose = useCallback(() => {
    setOpenCategories(false);
  }, []);

  return (
    <>
      <Input
        {...props}
        value={category?.fullPath(true) ?? ''}
        readOnly
        errorText={meta.error}
        endAdornment={<Dropdown onClick={handleCategoryDropdownClick} />}
        onClick={handleCategoryDropdownClick}
        ref={ref}
      />

      <CategoriesMobile open={openCategories} onSelect={handleCategorySelect} onClose={handleCategoriesClose} />
    </>
  );
});
