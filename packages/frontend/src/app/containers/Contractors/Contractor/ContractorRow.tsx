import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { BaseCheckbox, Button } from '@finex/ui-kit';
import { Contractor } from '../../../stores/models/contractor';
import { getT } from '../../../lib/core/i18n';

import styles from './ContractorRow.module.scss';

interface ContractorProps {
  contractor: Contractor;
  onClick: (contractor: Contractor) => void;
}

const t = getT('Contractors');

export const ContractorRow = observer<ContractorProps>(({ contractor, onClick }: ContractorProps) => {
  const { name, note, isSelected, isDeleting } = contractor;

  const handleOnSelect = () => {
    contractor.toggleSelection();
  };

  const handleClick = (event: React.SyntheticEvent) => {
    onClick(contractor);
  };

  return (
    <tr className={clsx(isDeleting && 'is_deleting')}>
      <td className="checkboxCell" onClick={handleOnSelect}>
        <BaseCheckbox value={isSelected} />
      </td>
      <td>
        <span className="name" onClick={handleClick}>
          {name}
        </span>
      </td>
      <td>{note}</td>
      <td>
        <div className={styles.root__actionsButtons}>
          <Button variant="linkGray" size="md" href={`/cash-flows?contractors=${contractor.id}`}>
            {t('Cash Flows')}
          </Button>
          <Button variant="linkGray" size="md" href={`/transactions?contractors=${contractor.id}`}>
            {t('Transactions')}
          </Button>
        </div>
      </td>
    </tr>
  );
});
