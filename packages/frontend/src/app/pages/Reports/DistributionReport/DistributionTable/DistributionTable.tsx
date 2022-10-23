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

import { ArrowForwardIcon, SortIcon } from '../../../../../../../ui-kit/src';
import { ReportsRepository } from '../../../../stores/reports-store';
import { getT, toCurrency } from '../../../../lib/core/i18n';
import { getValue } from '../../get-value';
import { useStore } from '../../../../core/hooks/use-store';
import { useTheme } from '@table-library/react-table-library/theme';

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

  const tree = useTree(
    distributionReport || { nodes: [] },
    {},
    {
      clickType: TreeExpandClickTypes.ButtonClick,
      treeIcon: {
        margin: '0',
        iconRight: <ArrowForwardIcon />,
        iconDown: <ArrowForwardIcon style={{ transform: 'rotate(90deg)' }} />,
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
        size: '2rem',
        iconDefault: <SortIcon />,
        iconUp: <ArrowForwardIcon style={{ transform: 'rotate(270deg)' }} />,
        iconDown: <ArrowForwardIcon style={{ transform: 'rotate(90deg)' }} />,
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
        {tableList => (
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
              {tableList.map(item => {
                const amount = getValue(item.amount, valueType);
                return (
                  <Row item={item} key={item.id}>
                    <CellTree item={item}>{item.category?.name || t('Others')}</CellTree>
                    <Cell className={styles.cell__textAlignRight}>
                      {amount && toCurrency(amount, (filter.money?.precision ?? 2) - 2)}
                    </Cell>
                  </Row>
                );
              })}
            </Body>
            <Footer>
              <FooterRow>
                <FooterCell>{t('Total')}</FooterCell>
                <FooterCell className={styles.cell__textAlignRight}>
                  {toCurrency(getValue(distributionReport.footer.total, valueType), (filter.money?.precision ?? 2) - 2)}
                </FooterCell>
              </FooterRow>
            </Footer>
          </>
        )}
      </Table>
    </div>
  );
});
