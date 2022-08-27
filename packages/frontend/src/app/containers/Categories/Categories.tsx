import React, { useState } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { useSnackbar } from 'notistack';

import { Button, Image, TickSvg, TreeTableGroupingCell, TreeTableRow, useTreeTable } from '@finex/ui-kit';
import { CategoriesRepository } from '../../stores/categories-repository';
import { Category as CategoryModel } from '../../stores/models/category';
import { CategoryWindow } from '../CategoryWindow/CategoryWindow';
import { Drawer } from '../../components/Drawer/Drawer';
import { ICategory } from '../../types/category';
import { MoveTransactionsWindow } from '../MoveTransactionsWindow/MoveTransactionsWindow';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './Categories.module.scss';

const t = getT('Categories');

export const Categories = observer(() => {
  const categoriesRepository = useStore(CategoriesRepository);

  const [isOpenedCategoryWindow, setIsOpenedCategoryWindow] = useState<boolean>(false);
  const [isOpenedMoveTransactionsWindow, setIsOpenedMoveTransactionsWindow] = useState<boolean>(false);
  const [category, setCategory] = useState<Partial<ICategory> | CategoryModel | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryModel | null>(null);

  const { getRowProps, getGroupingCellToggleProps } = useTreeTable();

  const { enqueueSnackbar } = useSnackbar();

  const handleAddClick = () => {
    setCategory({});
    setIsOpenedCategoryWindow(true);
  };

  const handleMoveTransactionsClick = () => {
    setIsOpenedMoveTransactionsWindow(true);
  };

  const handleDeleteClick = () => {
    if (!selectedCategory) {
      return;
    }

    categoriesRepository
      .deleteCategory(selectedCategory)
      .then(() => setSelectedCategory(null))
      .catch(err => {
        let message = '';
        switch (err.code) {
          case 'category_2_category_parent':
            message = t("You can't delete a category with subcategories");
            break;
          case 'cashflow_detail_2_category':
            message = t("You can't delete a category with transaction. Move them to another category.");
            break;
          default:
            message = err.message;
        }
        enqueueSnackbar(message, { variant: 'error' });
      });
  };

  const handleRefreshClick = () => {
    categoriesRepository.getCategories();
  };

  const handleRowClick = (category: CategoryModel) => (event: React.SyntheticEvent) => {
    setSelectedCategory(category);
  };

  const handleClickOnCategory = (category: CategoryModel) => (event: React.SyntheticEvent) => {
    setCategory(category);
    setIsOpenedCategoryWindow(true);
  };

  const handleCloseCategoryWindow = () => {
    setIsOpenedCategoryWindow(false);
  };

  const handleCloseMoveTransactionsWindow = () => {
    setIsOpenedMoveTransactionsWindow(false);
  };

  return (
    <>
      <article>
        <div className={styles.panel}>
          <div className={clsx(styles.panel__toolbar, styles.toolbar)}>
            <div className={styles.toolbar__buttons}>
              <Button variant="contained" size="small" color="secondary" onClick={handleAddClick}>
                {t('New')}
              </Button>
              <Button variant="outlined" size="small" disabled={!selectedCategory} onClick={handleDeleteClick}>
                {t('Delete')}
              </Button>
              <Button variant="outlined" size="small" onClick={handleRefreshClick}>
                {t('Refresh')}
              </Button>
              <Button
                variant="outlined"
                size="small"
                disabled={!selectedCategory}
                onClick={handleMoveTransactionsClick}
              >
                {t('Move transactions')}
              </Button>
            </div>
          </div>
        </div>
        <table className={clsx('table table-hover table-sm', styles.table)}>
          <thead>
            <tr>
              <th>{t('Name')}</th>
              <th>{t('Active')}</th>
              <th>{t('Note')}</th>
            </tr>
          </thead>
          <tbody>
            {categoriesRepository.categories.map(category => {
              const { path, name, isEnabled, note } = category;
              const { isLeaf, isExpanded, level, isVisible } = getRowProps(path);
              const { onClick } = getGroupingCellToggleProps(path);
              if (!isVisible) {
                return null;
              }
              return (
                <TreeTableRow
                  className={clsx(styles.row, category === selectedCategory && styles.row_selected)}
                  isVisible={isVisible}
                  onClick={handleRowClick(category)}
                  key={category.id}
                >
                  <TreeTableGroupingCell isLeaf={isLeaf} isExpanded={isExpanded} level={level} onClick={onClick}>
                    <div className={styles.row__name} onClick={handleClickOnCategory(category)}>
                      {name}
                    </div>
                  </TreeTableGroupingCell>
                  <td className={styles.tick}>{isEnabled && <Image src={TickSvg} alt="active" />}</td>
                  <td>{note}</td>
                </TreeTableRow>
              );
            })}
          </tbody>
        </table>
      </article>

      <Drawer isOpened={isOpenedCategoryWindow}>
        {category && <CategoryWindow category={category} onClose={handleCloseCategoryWindow} />}
      </Drawer>

      <Drawer isOpened={isOpenedMoveTransactionsWindow}>
        {selectedCategory && (
          <MoveTransactionsWindow category={selectedCategory} onClose={handleCloseMoveTransactionsWindow} />
        )}
      </Drawer>
    </>
  );
});

export default Categories;
