import React, { useCallback } from 'react';
import { observer } from 'mobx-react-lite';

import { CategoriesRepository } from '../../stores/categories-repository';
import { Category } from '../../stores/models/category';
import { CategoryCard } from './CategoryCard/CategoryCard';
import { Drawer } from '../../components/Drawer/Drawer';
import { BackButton, Header } from '../../components/Header/Header';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './CategoriesMobile.module.scss';

const t = getT('CategoriesMobile');

interface CategoriesMobileProps {
  open: boolean;
  onSelect: (category: Category) => void;
  onClose: () => void;
}

export const CategoriesMobile = observer<CategoriesMobileProps>(({ open, onSelect, onClose }) => {
  const categoriesRepository = useStore(CategoriesRepository);
  const isSelectMode = Boolean(onSelect);

  const handleClick = useCallback(
    (category: Category, event: React.MouseEvent<HTMLButtonElement>) => {
      if (isSelectMode) {
        onSelect(category);
      }
    },
    [isSelectMode, onSelect]
  );

  const categoriesTree = open ? categoriesRepository.categoriesTree : [];

  return (
    <Drawer open={open} className={styles.root}>
      <Header title={t('Categories')} startAdornment={<BackButton onClick={onClose} />} />
      <main className={styles.root__main}>
        {categoriesTree
          .filter(({ category: { isEnabled } }) => !isSelectMode || (isSelectMode && isEnabled))
          .map(node => {
            return <CategoryCard node={node} onClick={handleClick} key={node.category.id} />;
          })}
      </main>
    </Drawer>
  );
});
