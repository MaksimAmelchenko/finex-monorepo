import React, { useCallback, useEffect, useMemo } from 'react';
import * as Yup from 'yup';
import { FormikHelpers } from 'formik';
import { useSnackbar } from 'notistack';

import { ApiErrors } from '../../core/errors';
import { CategoriesRepository } from '../../stores/categories-repository';
import { Category } from '../../stores/models/category';
import { CategoryPrototypesRepository } from '../../stores/category-prototypes-repository';
import { CreateCategoryData, ICategory, UpdateCategoryChanges } from '../../types/category';
import {
  Form,
  FormBody,
  FormButton,
  FormCheckbox,
  FormFooter,
  FormHeader,
  FormSelect,
  FormTextAreaField,
  FormTextField,
} from '../../components/Form';
import { ISelectOption } from '@finex/ui-kit';
import { Shape } from '../../types';
import { analytics } from '../../lib/analytics';
import { getPatch } from '../../lib/core/get-patch';
import { getT } from '../../lib/core/i18n';
import { useCloseOnEscape } from '../../hooks/use-close-on-escape';
import { useStore } from '../../core/hooks/use-store';

interface CategoryFormValues {
  name: string;
  parent: string | null;
  categoryPrototypeId: string | null;
  isEnabled: boolean;
  note: string;
}

interface CategoryWindowProps {
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

export function CategoryWindow({ category, onClose }: CategoryWindowProps): JSX.Element {
  const categoriesRepository = useStore(CategoriesRepository);
  const categoryPrototypesRepository = useStore(CategoryPrototypesRepository);

  const { enqueueSnackbar } = useSnackbar();

  const { onCanCloseChange } = useCloseOnEscape({ onClose });

  useEffect(() => {
    analytics.view({
      page_title: 'category',
    });
  }, []);

  const nameFieldRefCallback = useCallback((node: HTMLInputElement | null) => {
    if (node) {
      node.focus();
    }
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

      return result
        .then(() => {
          onClose();
        })
        .catch(err => {
          let message = '';
          switch (err.code) {
            case 'cycleInHierarchy':
              message = t('There is a cycle in the hierarchy');
              break;
            default:
              message = err.message;
          }
          enqueueSnackbar(message, { variant: 'error' });
        });
    },
    [categoriesRepository, category, enqueueSnackbar, onClose]
  );

  const validationSchema = useMemo(
    () =>
      Yup.object<Shape<CategoryFormValues>>({
        name: Yup.string().required(t('Please fill name')),
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
      onDirtyChange={dirty => onCanCloseChange(!dirty)}
      name="category"
    >
      <FormHeader title={category instanceof Category ? t('Edit category') : t('Add new category')} onClose={onClose} />

      <FormBody>
        <FormTextField name="name" label={t('Name')} ref={nameFieldRefCallback} />
        <FormSelect name="parent" label={t('Parent category')} options={selectParentsOptions} isClearable />
        <FormSelect
          name="categoryPrototypeId"
          label={t('Prototype')}
          options={selectCategoryPrototypesOptions}
          isClearable
        />
        <FormCheckbox name="isEnabled" helperText={t('Show category when adding or editing a transaction')}>
          {t('Active')}
        </FormCheckbox>
        <FormTextAreaField name="note" label={t('Note')} />
      </FormBody>

      <FormFooter>
        <FormButton variant="secondaryGray" isIgnoreValidation onClick={onClose}>
          {t('Cancel')}
        </FormButton>
        <FormButton type="submit" color="primary" isIgnoreValidation>
          {t('Save')}
        </FormButton>
      </FormFooter>
    </Form>
  );
}
