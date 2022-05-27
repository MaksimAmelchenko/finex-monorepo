import React, { useCallback, useMemo, useRef } from 'react';
import * as Yup from 'yup';
import { FormikHelpers } from 'formik';

import { ApiErrors } from '../../core/errors';
import { CategoriesRepository } from '../../stores/categories-repository';
import { Category } from '../../stores/models/category';
import { CategoryPrototypesRepository } from '../../stores/category-prototypes-repository';
import { CreateCategoryData, ICategory, UpdateCategoryChanges } from '../../types/category';
import { Drawer } from '../../components/Drawer/Drawer';
import { DrawerFooter } from '../../components/Drawer/DrawerFooter';
import { Form, FormButton, FormCheckbox, FormError, FormLayout, FormTextField } from '../../components/Form';
import { FormSelect } from '../../components/Form/FormSelect/FormSelect';
import { FormTextAreaField } from '../../components/Form/FormTextArea/FormTextField';
import { ISelectOption } from '@finex/ui-kit';
import { Shape } from '../../types';
import { getPatch } from '../../lib/core/get-path';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './CategoryWindow.module.scss';

interface CategoryFormValues {
  name: string;
  parent: string | null;
  categoryPrototypeId: string | null;
  isEnabled: boolean;
  note: string;
}

interface CategoryWindowProps {
  isOpened: boolean;
  category: Partial<ICategory> | Category;
  onClose: () => unknown;
}

const t = getT('CategoryWindow');

function mapValuesToCreatePayload({
  name,
  parent,
  categoryPrototypeId,
  isEnabled,
  note,
}: CategoryFormValues): CreateCategoryData {
  return {
    name,
    parent,
    categoryPrototypeId,
    isEnabled,
    note,
  };
}

function mapValuesToUpdatePayload({
  name,
  parent,
  categoryPrototypeId,
  isEnabled,
  note,
}: CategoryFormValues): CreateCategoryData {
  return {
    name,
    parent,
    categoryPrototypeId,
    isEnabled,
    note,
  };
}

export function CategoryWindow({ isOpened, category, onClose }: CategoryWindowProps): JSX.Element {
  const categoriesRepository = useStore(CategoriesRepository);
  const categoryPrototypesRepository = useStore(CategoryPrototypesRepository);

  const nameFieldRef = useRef<HTMLInputElement | null>(null);

  const handleOnOpen = useCallback(() => {
    nameFieldRef.current?.focus();
  }, []);

  const onSubmit = useCallback(
    (values: CategoryFormValues, _: FormikHelpers<CategoryFormValues>, initialValues: CategoryFormValues) => {
      let result: Promise<unknown>;
      if (category instanceof Category) {
        const changes: UpdateCategoryChanges = getPatch(
          mapValuesToUpdatePayload(initialValues),
          mapValuesToUpdatePayload(values)
        );
        result = categoriesRepository.updateCategory(category, changes);
      } else {
        const data: CreateCategoryData = mapValuesToCreatePayload(values);
        result = categoriesRepository.createCategory(category, data);
      }

      return result.then(() => {
        onClose();
      });
    },
    [categoriesRepository, onClose, category]
  );

  const validationSchema = useMemo(
    () =>
      Yup.object<Shape<CategoryFormValues>>({
        name: Yup.string().required('Please fill name'),
      }),
    []
  );

  const selectCategoryPrototypesOptions = useMemo<ISelectOption[]>(() => {
    return categoryPrototypesRepository.categoryPrototypes
      .map(categoryPrototype => ({
        value: categoryPrototype.id,
        label: categoryPrototype.fullPath(true),
      }))
      .sort((a, b) => a.label.localeCompare(b.label, 'en', { sensitivity: 'base' }));
  }, [categoryPrototypesRepository.categoryPrototypes]);

  const selectParentsOptions = useMemo<ISelectOption[]>(() => {
    return categoriesRepository.categories.map(category => ({ value: category.id, label: category.fullPath(true) }));
  }, [categoriesRepository.categories]);

  const { name, parent, categoryPrototype, isEnabled, note } = category;

  return (
    <Drawer
      isOpened={isOpened}
      title={category instanceof Category ? t('Edit category') : t('Add new category')}
      onClose={onClose}
      onOpen={handleOnOpen}
    >
      <Form<CategoryFormValues>
        onSubmit={onSubmit}
        initialValues={{
          name: name ?? '',
          parent: parent?.id ?? null,
          categoryPrototypeId: categoryPrototype?.id ?? null,
          isEnabled: isEnabled ?? true,
          note: note ?? '',
        }}
        validationSchema={validationSchema}
        errorsHR={[
          //
          [ApiErrors.InvalidRequest, t('Check data and try again')],
        ]}
        className={styles.form}
      >
        <div className={styles.form__bodyWrapper}>
          <FormLayout className={styles.form__body}>
            <FormTextField name="name" label={t('Name')} ref={nameFieldRef} />
            <FormSelect name="parent" label={t('Parent category')} options={selectParentsOptions} isClearable />
            <FormSelect
              name="categoryPrototypeId"
              label={t('Prototype')}
              options={selectCategoryPrototypesOptions}
              isClearable
            />
            <FormCheckbox
              name="isEnabled"
              label={t('Active')}
              helperText={t('Show category when adding or editing an operation')}
            />
            <FormTextAreaField name="note" label={t('Note')} />
            <FormError />
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
