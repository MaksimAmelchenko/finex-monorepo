import React from 'react';
import {
  Body,
  Cell,
  Footer,
  FooterCell,
  FooterRow,
  Header,
  HeaderCell,
  HeaderRow,
  Row,
  Table,
} from '@table-library/react-table-library/table';
import { CellTree, TreeExpandClickTypes, useTree } from '@table-library/react-table-library/tree';
import { HeaderCellSort, useSort } from '@table-library/react-table-library/sort';
import { add, differenceInMonths, format, formatISO } from 'date-fns';
import { observer } from 'mobx-react-lite';
import { useTheme } from '@table-library/react-table-library/theme';

import { ChevronRightIcon, SortDownIcon, SortIcon, SortUpIcon } from '@finex/ui-kit';
import { DynamicsReportTableNode } from '../../../../types/report';
import { ReportsRepository } from '../../../../stores/reports-store';
import { formatDate, getT, toCurrency } from '../../../../lib/core/i18n';
import { getValue } from '../../get-value';
import { useStore } from '../../../../core/hooks/use-store';

import styles from './DynamicsTable.module.scss';

const t = getT('DynamicsTable');

interface DynamicsTableProps {
  valueType: string;
}

export const DynamicsTable = observer<DynamicsTableProps>(({ valueType }) => {
  const reportsRepository = useStore(ReportsRepository);

  const { dynamicsReport, dynamicsReportFilter: filter } = reportsRepository;

  const rangeLength = differenceInMonths(filter.range[1], filter.range[0]);

  const months: Date[] = [...Array(rangeLength + 1)].map((_, index) => add(filter.range[0], { months: index }));

  const theme = useTheme([
    {
      Table: `
        --data-table-library_grid-template-columns: 32rem repeat(${rangeLength + 1}, 1fr) 1fr;
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

  const tree = useTree(
    dynamicsReport || { nodes: [] },
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
    dynamicsReport || { nodes: [] },
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
        TOTAL: array => array.sort((a, b) => getValue(a.total, valueType) - getValue(b.total, valueType)),
      },
    }
  );

  if (!dynamicsReport) {
    return null;
  }

  return (
    <div className={styles.tableContainer}>
      <Table
        data={dynamicsReport}
        tree={tree}
        theme={theme}
        sort={sort}
        layout={{ custom: true, horizontalScroll: true, fixedHeader: true }}
      >
        {(tableNodes: DynamicsReportTableNode[]) => (
          <>
            <Header>
              <HeaderRow>
                <HeaderCellSort pinLeft sortKey="CATEGORY">
                  {t('Category')}
                </HeaderCellSort>
                {months.map(month => (
                  <HeaderCell key={month.getTime()}>{formatDate(formatISO(month), 'date.format.month')}</HeaderCell>
                ))}
                <HeaderCellSort sortKey="TOTAL">{t('Total')}</HeaderCellSort>
              </HeaderRow>
            </Header>
            <Body>
              {tableNodes.map(tableNode => {
                const total = getValue(tableNode.total, valueType);
                return (
                  <Row item={tableNode} key={tableNode.id}>
                    <CellTree item={tableNode}>{tableNode.category?.name || t('Others')}</CellTree>
                    {months.map(month => {
                      const value = getValue(tableNode[format(month, 'yyyyMM')], valueType);
                      return (
                        <Cell className={styles.cell__textAlignRight} key={month.getTime()}>
                          {value && toCurrency(value, { precision: 0, unit: '' })}
                        </Cell>
                      );
                    })}
                    <Cell className={styles.cell__textAlignRight}>
                      {total && toCurrency(total, { precision: 0, unit: '' })}
                    </Cell>
                  </Row>
                );
              })}
            </Body>
            <Footer>
              <FooterRow>
                <FooterCell>{t('Total')}</FooterCell>
                {months.map(month => {
                  const value = getValue(dynamicsReport.footer[format(month, 'yyyyMM')], valueType);
                  return (
                    <FooterCell className={styles.cell__textAlignRight} key={month.getTime()}>
                      {value && toCurrency(value, { precision: 0, unit: '' })}
                    </FooterCell>
                  );
                })}
                <FooterCell className={styles.cell__textAlignRight}>
                  {toCurrency(getValue(dynamicsReport.footer.total, valueType), { precision: 0, unit: '' })}
                </FooterCell>
              </FooterRow>
            </Footer>
          </>
        )}
      </Table>
    </div>
  );
});
