import React, { useCallback, useMemo, useRef } from 'react';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';

import { CategoriesRepository } from '../../stores/categories-repository';
import { Category } from '../../stores/models/category';
import { Drawer } from '../../components/Drawer/Drawer';
import { DrawerFooter } from '../../components/Drawer/DrawerFooter';
import { Form, FormButton, FormCheckbox, FormLayout } from '../../components/Form';
import { FormSelect } from '../../components/Form/FormSelect/FormSelect';
import { ISelectOption } from '@finex/ui-kit';
import { Shape } from '../../types';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './MoveTransactionsWindow.module.scss';

interface MoveTransactionsFormValues {
  categoryId: string;
  categoryIdTo: string | null;
  isRecursive: boolean;
}

interface CategoryWindowProps {
  isOpened: boolean;
  category: Category;
  onClose: () => unknown;
}

const t = getT('MoveTransactionsWindow');

export function MoveTransactionsWindow({ isOpened, category, onClose }: CategoryWindowProps): JSX.Element {
  const categoriesRepository = useStore(CategoriesRepository);
  const { enqueueSnackbar } = useSnackbar();

  const toFieldRef = useRef<HTMLInputElement | null>(null);

  const handleOnOpen = useCallback(() => {
    toFieldRef.current?.focus();
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
                'You cannot move transaction to the same category without using the option "Move operations from subcategories"'
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
              'You cannot move transaction to the same category without using the option "Move operations from subcategories"'
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
    <Drawer
      isOpened={isOpened}
      title={t('Move transactions from one category to another')}
      onClose={onClose}
      onOpen={handleOnOpen}
    >
      <Form<MoveTransactionsFormValues>
        onSubmit={onSubmit}
        initialValues={{
          categoryId: category.id,
          categoryIdTo: null,
          isRecursive: false,
        }}
        validationSchema={validationSchema}
        className={styles.form}
      >
        <div className={styles.form__bodyWrapper}>
          <FormLayout className={styles.form__body}>
            <FormSelect name="categoryId" label={t('From')} options={selectCategoriesOptions} />
            <FormSelect name="categoryIdTo" label={t('To')} options={selectCategoriesOptions} isClearable autoFocus />
            <FormCheckbox name="isRecursive" label={t('Move operations from subcategories')} />
          </FormLayout>
        </div>
        <DrawerFooter className={styles.footer}>
          <FormButton variant="outlined" isIgnoreValidation onClick={onClose}>
            {t('Cancel')}
          </FormButton>
          <FormButton type="submit" color="secondary" isIgnoreValidation>
            {t('Move')}
          </FormButton>
        </DrawerFooter>
      </Form>
    </Drawer>
  );
}
