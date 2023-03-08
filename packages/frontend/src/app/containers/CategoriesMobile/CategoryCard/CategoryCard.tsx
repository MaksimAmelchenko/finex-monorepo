import React, { useState } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { Accordion, ChevronRightIcon, chevronRightSvg } from '@finex/ui-kit';
import { Category } from '../../../stores/models/category';
import { CategoryTreeNode } from '../../../stores/categories-repository';

import styles from './CategoryCard.module.scss';

interface CategoryCardProps {
  node: CategoryTreeNode;
  level?: number;
  onClick: (category: Category, event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const CategoryCard = observer<CategoryCardProps>(({ node, level = 1, onClick }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const { category, children } = node;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick(category, event);
  };

  const handleExpandButtonClick = () => {
    setIsExpanded(!isExpanded);
  };

  const { isEnabled, name } = category;

  return (
    <div className={clsx(styles.root, !isEnabled && styles.root_disabled)} style={{ ['--level' as any]: level }}>
      <div className={clsx(styles.category)}>
        {children.length > 0 ? (
          <button
            className={clsx(styles.category__expandButton, isExpanded && styles.category__expandButton_expended)}
            onClick={handleExpandButtonClick}
          >
            <ChevronRightIcon />
          </button>
        ) : (
          <div className={styles.category__expandPlaceholder} />
        )}

        <button type="button" className={styles.category__content} onClick={handleClick}>
          {name}
        </button>
      </div>

      {children.length > 0 && (
        <Accordion isExpanded={isExpanded}>
          {children.map(node => {
            return <CategoryCard node={node} level={level + 1} onClick={onClick} key={node.category.id} />;
          })}
        </Accordion>
      )}
    </div>
  );
});
