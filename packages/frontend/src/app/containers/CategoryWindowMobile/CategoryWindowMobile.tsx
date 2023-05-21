import React, { useCallback, useEffect, useMemo } from 'react';
import * as Yup from 'yup';
import { FormikHelpers } from 'formik';
import { useSnackbar } from 'notistack';

import { analytics } from '../../lib/analytics';
import { BackButton, DeleteButton, Header } from '../../components/Header/Header';
import { CategoriesRepository } from '../../stores/categories-repository';
import { Category } from '../../stores/models/category';
import { CategoryPrototypesRepository } from '../../stores/category-prototypes-repository';
import { CreateCategoryData, ICategory, UpdateCategoryChanges } from '../../types/category';
import { Form, FormBody, FormButton, FormCheckbox, FormInput, FormTextArea } from '../../components/Form';
import { FormSelectNative } from '../../components/Form/FormSelectNative/FormSelectNative';
import { getPatch } from '../../lib/core/get-patch';
import { getT } from '../../lib/core/i18n';
import { ISelectOption } from '@finex/ui-kit';
import { Shape } from '../../types';
import { useStore } from '../../core/hooks/use-store';

import styles from './CategoryWindowMobile.module.scss';

interface CategoryFormValues {
  name: string;
  parent: string | null;
  categoryPrototypeId: string | null;
  isEnabled: boolean;
  note: string;
}

interface CategoryWindowMobileProps {
  category: Partial<ICategory> | Category;
  onClose: () => unknown;
}

const t = getT('CategoryWindowMobile');

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

export function CategoryWindowMobile({ category, onClose }: CategoryWindowMobileProps): JSX.Element {
  const categoriesRepository = useStore(CategoriesRepository);
  const categoryPrototypesRepository = useStore(CategoryPrototypesRepository);

  const { enqueueSnackbar } = useSnackbar();

  const isNew = !(category instanceof Category);

  useEffect(() => {
    analytics.view({
      page_title: 'category-mobile',
    });
  }, []);

  const nameFieldRefCallback = useCallback((node: HTMLInputElement | null) => {
    if (node) {
      // node.focus();
      requestAnimationFrame(() => node.focus());
    }
  }, []);

  const onSubmit = useCallback(
    (values: CategoryFormValues, _: FormikHelpers<CategoryFormValues>, initialValues: CategoryFormValues) => {
      let result: Promise<unknown>;
      if (isNew) {
        const data: CreateCategoryData = mapValuesToCreatePayload(values);
        result = categoriesRepository.createCategory(category, data);
      } else {
        const changes: UpdateCategoryChanges = getPatch(
          mapValuesToUpdatePayload(initialValues),
          mapValuesToUpdatePayload(values)
        );
        result = categoriesRepository.updateCategory(category, changes);
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
    [enqueueSnackbar, isNew, category, categoriesRepository, onClose]
  );

  const handleDeleteClick = () => {
    categoriesRepository
      .deleteCategory(category as Category)
      .then(() => {
        onClose();
      })
      .catch((err: any) => {
        let message = '';
        switch (err.code) {
          case 'cashflow_detail_2_category': {
            message = t('There are transactions with this category');
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
      Yup.object<Shape<CategoryFormValues>>({
        name: Yup.string().required(t('Please fill name')),
      }),
    []
  );

  const selectCategoryPrototypesOptions = useMemo<ISelectOption[]>(() => {
    return [
      { value: '', label: '' },
      ...categoryPrototypesRepository.categoryPrototypes
        .filter(categoryPrototype => !categoryPrototype.isSystem)
        .map(categoryPrototype => ({
          value: categoryPrototype.id,
          label: categoryPrototype.fullPath(true),
        }))
        .sort((a, b) => a.label.localeCompare(b.label, 'en', { sensitivity: 'base' })),
    ];
  }, [categoryPrototypesRepository.categoryPrototypes]);

  const selectParentsOptions = useMemo<ISelectOption[]>(() => {
    return [
      { value: '', label: '' },
      ...categoriesRepository.categories.map(category => ({ value: category.id, label: category.fullPath(true) })),
    ];
  }, [categoriesRepository.categories]);

  const { name, parent, categoryPrototype, isEnabled, note } = category;

  return (
    <Form<CategoryFormValues>
      onSubmit={onSubmit}
      initialValues={{
        name: name ?? '',
        parent: parent?.id ?? '',
        categoryPrototypeId: categoryPrototype?.id ?? '',
        isEnabled: isEnabled ?? true,
        note: note ?? '',
      }}
      validationSchema={validationSchema}
      name="category-mobile"
    >
      <Header
        title={isNew ? t('Add new category') : t('Edit category')}
        startAdornment={<BackButton onClick={onClose} />}
        endAdornment={!isNew && <DeleteButton onClick={handleDeleteClick} />}
      />

      <FormBody className={styles.main}>
        <FormInput name="name" label={t('Name')} ref={nameFieldRefCallback} />
        <FormSelectNative name="parent" label={t('Parent category')} options={selectParentsOptions} />
        <FormSelectNative
          name="categoryPrototypeId"
          label={t('Prototype')}
          options={selectCategoryPrototypesOptions}
          helperText={t('Used for analytics')}
        />

        <FormCheckbox name="isEnabled" helperText={t('Show category when adding or editing a transaction')}>
          {t('Active')}
        </FormCheckbox>
        <FormTextArea name="note" label={t('Note')} />
      </FormBody>

      <footer className={styles.footer}>
        <FormButton type="submit" variant="primary" isIgnoreValidation>
          {t('Save')}
        </FormButton>
      </footer>
    </Form>
  );
}
