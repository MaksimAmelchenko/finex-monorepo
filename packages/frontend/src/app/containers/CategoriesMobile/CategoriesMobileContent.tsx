import React, { useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';

import { AddButton, BackButton, Header } from '../../components/Header/Header';
import { analytics } from '../../lib/analytics';
import { CategoriesRepository } from '../../stores/categories-repository';
import { Category } from '../../stores/models/category';
import { CategoryCard } from './CategoryCard/CategoryCard';
import { CategoryWindowMobile } from '../CategoryWindowMobile/CategoryWindowMobile';
import { getT } from '../../lib/core/i18n';
import { ICategory } from '../../types/category';
import { SideSheetBody } from '../../components/SideSheetMobile/SideSheetBody/SideSheetBody';
import { SideSheetMobile } from '../../components/SideSheetMobile/SideSheetMobile';
import { useStore } from '../../core/hooks/use-store';

const t = getT('CategoriesMobile');

export interface CategoriesMobileContentProps {
  onSelect?: (category: Category) => void;
  onClose: () => void;
}

export const CategoriesMobileContent = observer<CategoriesMobileContentProps>(({ onSelect, onClose }) => {
  const categoriesRepository = useStore(CategoriesRepository);
  const [category, setCategory] = useState<Partial<ICategory> | Category | null>(null);

  const isSelectMode = Boolean(onSelect);

  useEffect(() => {
    analytics.view({
      page_title: 'categories-mobile',
    });
  }, []);

  const handleAddClick = useCallback(() => {
    setCategory({});
  }, []);

  const handleClick = useCallback(
    (category: Category, event: React.MouseEvent<HTMLButtonElement>) => {
      if (isSelectMode) {
        onSelect?.(category);
      } else {
        setCategory(category);
      }
    },
    [isSelectMode, onSelect]
  );

  const { categoriesTree } = categoriesRepository;

  return (
    <>
      <Header
        title={t('Categories')}
        startAdornment={<BackButton onClick={onClose} />}
        endAdornment={<AddButton onClick={handleAddClick} />}
      />
      <SideSheetBody>
        {categoriesTree
          .filter(
            ({ category: { isAvailable, isSystem } }) => (!isSelectMode || (isSelectMode && isAvailable)) && !isSystem
          )
          .map(node => {
            return <CategoryCard node={node} onClick={handleClick} key={node.category.id} />;
          })}
      </SideSheetBody>

      <SideSheetMobile open={Boolean(category)}>
        {category && <CategoryWindowMobile category={category} onClose={() => setCategory(null)} />}
      </SideSheetMobile>
    </>
  );
});

export default CategoriesMobileContent;
