import React, { useCallback, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { BackButton, Header } from '../../components/Header/Header';
import { CategoriesRepository } from '../../stores/categories-repository';
import { Category } from '../../stores/models/category';
import { CategoryCard } from './CategoryCard/CategoryCard';
import { SideSheetBody } from '../../components/SideSheetMobile/SideSheetBody/SideSheetBody';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';
import { analytics } from '../../lib/analytics';

const t = getT('CategoriesMobile');

export interface CategoriesMobileContentProps {
  onSelect?: (category: Category) => void;
  onClose: () => void;
}

export const CategoriesMobileContent = observer<CategoriesMobileContentProps>(({ onSelect, onClose }) => {
  const categoriesRepository = useStore(CategoriesRepository);
  const isSelectMode = Boolean(onSelect);

  useEffect(() => {
    analytics.view({
      page_title: 'categories-mobile',
    });
  }, []);

  const handleClick = useCallback(
    (category: Category, event: React.MouseEvent<HTMLButtonElement>) => {
      if (isSelectMode) {
        onSelect?.(category);
      }
    },
    [isSelectMode, onSelect]
  );

  const { categoriesTree } = categoriesRepository;

  return (
    <>
      <Header title={t('Categories')} startAdornment={<BackButton onClick={onClose} />} />
      <SideSheetBody>
        {categoriesTree
          .filter(
            ({ category: { isEnabled, isSystem } }) => (!isSelectMode || (isSelectMode && isEnabled)) && !isSystem
          )
          .map(node => {
            return <CategoryCard node={node} onClick={handleClick} key={node.category.id} />;
          })}
      </SideSheetBody>
    </>
  );
});

export default CategoriesMobileContent;
