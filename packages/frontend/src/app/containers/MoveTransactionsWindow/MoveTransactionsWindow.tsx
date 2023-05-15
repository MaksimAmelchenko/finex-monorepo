import React, { useCallback, useEffect, useMemo } from 'react';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';

import { CategoriesRepository } from '../../stores/categories-repository';
import { Category } from '../../stores/models/category';
import { Form, FormBody, FormButton, FormCheckbox, FormFooter, FormHeader, FormSelect } from '../../components/Form';
import { ISelectOption } from '@finex/ui-kit';
import { Shape } from '../../types';
import { analytics } from '../../lib/analytics';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

interface MoveTransactionsFormValues {
  categoryId: string;
  categoryIdTo: string | null;
  isRecursive: boolean;
}

interface CategoryWindowProps {
  category: Category;
  onClose: () => unknown;
}

const t = getT('MoveTransactionsWindow');

export function MoveTransactionsWindow({ category, onClose }: CategoryWindowProps): JSX.Element {
  const categoriesRepository = useStore(CategoriesRepository);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    analytics.view({
      page_title: 'move-transactions',
    });
  }, []);

  const onSubmit = useCallback(
    ({ categoryId, categoryIdTo, isRecursive }: MoveTransactionsFormValues) => {
      return categoriesRepository
        .moveTransactions(categoryId, categoryIdTo!, isRecursive)
        .then(({ count }) => {
          // TODO add pluralization
          enqueueSnackbar(t('Moved {{count}} transactions', { count }), { variant: 'success' });
          onClose();
        })
        .catch(err => {
          let message = '';
          switch (err.code) {
            case 'sameCategory': {
              message = t(
                'You cannot move transaction to the same category without using the option "Move transactions from subcategories"'
              );
              break;
            }
            default:
              message = err.message;
          }
          enqueueSnackbar(message, { variant: 'error' });
        });
    },
    [categoriesRepository, enqueueSnackbar, onClose]
  );

  const validationSchema = useMemo(
    () =>
      Yup.object<Shape<MoveTransactionsFormValues>>({
        categoryIdTo: Yup.mixed()
          .test('categoryIdTo', t('Please select a category to move transaction to'), value => Boolean(value))
          .test(
            'categoryIdTo',
            t(
              'You cannot move transaction to the same category without using the option "Move transactions from subcategories"'
            ),
            function (value) {
              return !(this.parent.categoryId === value && !this.parent.isRecursive);
            }
          ),
      }),
    []
  );

  const selectCategoriesOptions = useMemo<ISelectOption[]>(() => {
    return categoriesRepository.categories.map(category => ({
      value: category.id,
      label: category.fullPath(true),
    }));
  }, [categoriesRepository.categories]);

  return (
    <Form<MoveTransactionsFormValues>
      onSubmit={onSubmit}
      initialValues={{
        categoryId: category.id,
        categoryIdTo: null,
        isRecursive: false,
      }}
      validationSchema={validationSchema}
      name="move-transactions"
    >
      <FormHeader title={t('Move transactions from one category to another')} onClose={onClose} />

      <FormBody>
        <FormSelect name="categoryId" label={t('From')} options={selectCategoriesOptions} />
        <FormSelect name="categoryIdTo" label={t('To')} options={selectCategoriesOptions} isClearable autoFocus />
        <FormCheckbox name="isRecursive">{t('Move transactions from subcategories')}</FormCheckbox>
      </FormBody>

      <FormFooter>
        <FormButton variant="secondaryGray" isIgnoreValidation onClick={onClose}>
          {t('Cancel')}
        </FormButton>
        <FormButton type="submit" variant="primary" isIgnoreValidation>
          {t('Move')}
        </FormButton>
      </FormFooter>
    </Form>
  );
}
