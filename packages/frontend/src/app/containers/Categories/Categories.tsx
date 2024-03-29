import React, { useState } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { useSnackbar } from 'notistack';

import {
  BaseCheckbox,
  Button,
  Image,
  PlusIcon,
  RefreshCW01Icon,
  RightLongIcon,
  TreeTableGroupingCell,
  TreeTableRow,
  checkSvg,
  useTreeTable,
} from '@finex/ui-kit';
import { CategoriesRepository } from '../../stores/categories-repository';
import { Category } from '../../stores/models/category';
import { CategoryWindow } from '../CategoryWindow/CategoryWindow';
import { Drawer } from '../../components/Drawer/Drawer';
import { ICategory } from '../../types/category';
import { MoveTransactionsWindow } from '../MoveTransactionsWindow/MoveTransactionsWindow';
import { TrashIcon } from '../../components/TrashIcon/TrashIcon';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './Categories.module.scss';

const t = getT('Categories');

export const Categories = observer(() => {
  const categoriesRepository = useStore(CategoriesRepository);

  const [isOpenedCategoryWindow, setIsOpenedCategoryWindow] = useState<boolean>(false);
  const [isOpenedMoveTransactionsWindow, setIsOpenedMoveTransactionsWindow] = useState<boolean>(false);
  const [category, setCategory] = useState<Partial<ICategory> | Category | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const { getRowProps, getGroupingCellToggleProps } = useTreeTable();

  const { enqueueSnackbar } = useSnackbar();

  const handleAddClick = () => {
    setCategory({ parent: selectedCategory });
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
          case 'plan_cashflow_item_2_category':
            message = t("You can't delete a category with plan. Please change the plan at first.");
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

  const handleCheckboxCellClick = (category: Category) => (event: React.SyntheticEvent) => {
    if (category !== selectedCategory) {
      setSelectedCategory(category);
    } else {
      setSelectedCategory(null);
    }
  };

  const handleClickOnCategory = (category: Category) => (event: React.SyntheticEvent) => {
    setCategory(category);
    setIsOpenedCategoryWindow(true);
  };

  const handleCloseCategoryWindow = () => {
    setIsOpenedCategoryWindow(false);
  };

  const handleCloseMoveTransactionsWindow = () => {
    setIsOpenedMoveTransactionsWindow(false);
  };

  const categories = categoriesRepository.categories.filter(({ isSystem }) => !isSystem);
  const isDeleteButtonDisabled = Boolean(!selectedCategory);

  return (
    <>
      <article className={styles.article}>
        <div className={clsx(styles.article__panel, styles.panel)}>
          <div className={clsx(styles.panel__toolbar, styles.toolbar)}>
            <div className={styles.toolbar__buttons}>
              <Button size="md" startIcon={<PlusIcon />} onClick={handleAddClick}>
                {t('New')}
              </Button>
              <Button
                variant="secondaryGray"
                size="md"
                startIcon={<TrashIcon disabled={isDeleteButtonDisabled} />}
                disabled={isDeleteButtonDisabled}
                onClick={handleDeleteClick}
              >
                {t('Delete')}
              </Button>
              <Button variant="secondaryGray" size="md" startIcon={<RefreshCW01Icon />} onClick={handleRefreshClick}>
                {t('Refresh')}
              </Button>
              <Button
                variant="secondaryGray"
                size="md"
                startIcon={<RightLongIcon />}
                disabled={!selectedCategory}
                onClick={handleMoveTransactionsClick}
              >
                {t('Move transactions')}
              </Button>
            </div>
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={clsx('table table-hover table-sm', styles.table)}>
            <thead>
              <tr>
                <th />
                <th>{t('Name')}</th>
                <th>{t('Active')}</th>
                <th>{t('Note')}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {categories.map(category => {
                const { idsPath, name, isEnabled, note } = category;
                const { isLeaf, isExpanded, level, isVisible } = getRowProps(idsPath);
                const { onClick } = getGroupingCellToggleProps(idsPath);
                if (!isVisible) {
                  return null;
                }
                const isSelected = category === selectedCategory;
                return (
                  <TreeTableRow
                    className={clsx(styles.row, isSelected && styles.row_selected)}
                    isVisible={isVisible}
                    key={category.id}
                  >
                    <td className="checkboxCell" onClick={handleCheckboxCellClick(category)}>
                      <BaseCheckbox value={isSelected} />
                    </td>

                    <TreeTableGroupingCell isLeaf={isLeaf} isExpanded={isExpanded} level={level} onClick={onClick}>
                      <div className="name" onClick={handleClickOnCategory(category)}>
                        {name}
                      </div>
                    </TreeTableGroupingCell>
                    <td className="tickCell">{isEnabled && <Image src={checkSvg} alt="active" />}</td>
                    <td>{note}</td>
                    <td>
                      <div className={styles.row__actionsButtons}>
                        <Button variant="linkGray" size="md" href={`/transactions?categories=${category.id}`}>
                          {t('Transactions')}
                        </Button>
                      </div>
                    </td>
                  </TreeTableRow>
                );
              })}
            </tbody>
          </table>
        </div>
      </article>

      <Drawer open={isOpenedCategoryWindow}>
        {category && <CategoryWindow category={category} onClose={handleCloseCategoryWindow} />}
      </Drawer>

      <Drawer open={isOpenedMoveTransactionsWindow}>
        {selectedCategory && (
          <MoveTransactionsWindow category={selectedCategory} onClose={handleCloseMoveTransactionsWindow} />
        )}
      </Drawer>
    </>
  );
});

export default Categories;
