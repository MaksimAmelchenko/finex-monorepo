import React from 'react';
import {
  Body,
  Cell,
  Footer,
  FooterCell,
  FooterRow,
  Header,
  HeaderRow,
  Row,
  Table,
} from '@table-library/react-table-library/table';
import { CellTree, TreeExpandClickTypes, useTree } from '@table-library/react-table-library/tree';
import { HeaderCellSort, useSort } from '@table-library/react-table-library/sort';
import { observer } from 'mobx-react-lite';
import { useTheme } from '@table-library/react-table-library/theme';

import { ChevronRightIcon, SortDownIcon, SortIcon, SortUpIcon } from '@finex/ui-kit';
import { DistributionReportTableNode } from '../../../../types/report';
import { ReportsRepository } from '../../../../stores/reports-store';
import { getT, toCurrency } from '../../../../lib/core/i18n';
import { getValue } from '../../get-value';
import { useStore } from '../../../../core/hooks/use-store';

import styles from './DistributionTable.module.scss';

const t = getT('DistributionTable');

interface DistributionTableProps {
  valueType: string;
}

export const DistributionTable = observer<DistributionTableProps>(({ valueType }) => {
  const reportsRepository = useStore(ReportsRepository);

  const { distributionReport, distributionReportFilter: filter } = reportsRepository;

  const theme = useTheme([
    {
      Table: `
        --data-table-library_grid-template-columns: 32rem 1fr;
      `,
      HeaderRow: `
        border-radius: 1rem 1rem 0 0;
        background-color: #fbfcfe;
      `,
      FooterRow: `
        background-color: #fbfcfe;
      `,
      BaseCell: `
        height: 3.2rem;
        padding: 0.4rem 0.8rem;

        &:not(:last-of-type) {
          border-right: 1px solid #eceef1;
        }

        &:nth-of-type(1) {
          position: sticky;
          left: 0px;
        }
        font-size: 15px;

        .narrow > div {
          display: flex;
        }
      `,
      FooterCell: `
        &:nth-of-type(1) {
          z-index: 2;
        }
      `,
    },
  ]);

  const tree = useTree<DistributionReportTableNode>(
    distributionReport || { nodes: [] },
    {},
    {
      clickType: TreeExpandClickTypes.ButtonClick,
      treeIcon: {
        margin: '0.4rem',
        iconRight: <ChevronRightIcon className={styles.iconRight} />,
        iconDown: <ChevronRightIcon className={styles.iconDown} />,
        noIconMargin: '2.4rem',
        size: '2.4rem',
      },
    }
  );

  const sort = useSort(
    distributionReport || { nodes: [] },
    {
      state: {
        sortKey: 'CATEGORY',
        reverse: false,
      },
    },
    {
      sortIcon: {
        size: '1.6rem',
        iconDefault: <SortIcon />,
        iconUp: <SortUpIcon />,
        iconDown: <SortDownIcon />,
      },
      sortFns: {
        CATEGORY: array => array.sort((a, b) => a.category?.name.localeCompare(b.category?.name)),
        TOTAL: array => array.sort((a, b) => getValue(a.amount, valueType) - getValue(b.amount, valueType)),
      },
    }
  );

  if (!distributionReport) {
    return null;
  }

  return (
    <div className={styles.tableContainer}>
      <Table
        data={distributionReport}
        tree={tree}
        theme={theme}
        sort={sort}
        layout={{ custom: true, horizontalScroll: true, fixedHeader: true }}
      >
        {(tableNodes: DistributionReportTableNode[]) => (
          <>
            <Header>
              <HeaderRow>
                <HeaderCellSort pinLeft sortKey="CATEGORY">
                  {t('Category')}
                </HeaderCellSort>
                <HeaderCellSort sortKey="TOTAL" className={styles.cell__textAlignRight}>
                  {t('Total')}
                </HeaderCellSort>
              </HeaderRow>
            </Header>
            <Body>
              {tableNodes.map(tableNode => {
                const amount = getValue(tableNode.amount, valueType);
                return (
                  <Row item={tableNode} key={tableNode.id}>
                    <CellTree item={tableNode}>{tableNode.category?.name || t('Others')}</CellTree>
                    <Cell className={styles.cell__textAlignRight}>
                      {amount && toCurrency(amount, { precision: 0, unit: '' })}
                    </Cell>
                  </Row>
                );
              })}
            </Body>
            <Footer>
              <FooterRow>
                <FooterCell>{t('Total')}</FooterCell>
                <FooterCell className={styles.cell__textAlignRight}>
                  {toCurrency(getValue(distributionReport.footer.total, valueType), { precision: 0, unit: '' })}
                </FooterCell>
              </FooterRow>
            </Footer>
          </>
        )}
      </Table>
    </div>
  );
});
