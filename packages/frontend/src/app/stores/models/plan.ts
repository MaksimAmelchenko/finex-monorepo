import { IPlan } from '../../types/plan';
import { TDate } from '../../types';
import { Tag } from './tag';
import { User } from './user';
import { format, parseISO } from 'date-fns';
import { getT } from '../../lib/core/i18n';

export class Plan implements IPlan {
  id: string;
  startDate: TDate;
  reportPeriod: TDate;
  repetitionType: number;
  repetitionDays: number[] | null;
  terminationType: number | null;
  repetitionCount: number | null;
  endDate: TDate | null;
  note: string;
  operationNote: string;
  operationTags: Tag[];
  markerColor: string | null;
  user: User;

  constructor({
    id,
    startDate,
    reportPeriod,
    repetitionType,
    repetitionDays,
    terminationType,
    repetitionCount,
    endDate,
    note,
    operationNote,
    operationTags,
    markerColor,
    user,
  }: IPlan) {
    this.id = id;
    this.startDate = startDate;
    this.reportPeriod = reportPeriod;
    this.repetitionType = repetitionType;
    this.repetitionDays = repetitionDays;
    this.terminationType = terminationType;
    this.repetitionCount = repetitionCount;
    this.endDate = endDate;
    this.note = note;
    this.operationNote = operationNote;
    this.operationTags = operationTags;
    this.markerColor = markerColor;
    this.user = user;
  }

  get schedule(): string {
    const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

    let result = '';
    const month = parseISO(this.startDate).getMonth() + 1;
    switch (this.repetitionType) {
      case 1: {
        result = this.repetitionDays
          ? `Еженедельно в <strong>${this.repetitionDays?.map(day => days[day - 1]).join(', ')}</strong>.`
          : '';
        break;
      }
      case 2: {
        result = this.repetitionDays ? `Ежемесячно <strong>${this.repetitionDays.join(', ')}</strong> числа.` : '';
        break;
      }
      case 3: {
        result = `Ежеквартально <strong>${format(parseISO(this.startDate), 'dd')}</strong> числа <strong>${
          month - Math.trunc((month - 1) / 3) * 3
        }-го</strong> месяца.`;
        break;
      }
      case 4: {
        result = `Ежегодно <strong>${format(parseISO(this.startDate), 'dd MMMM')}</strong>.`;
        break;
      }
    }
    switch (this.terminationType) {
      case 1: {
        result += `<br>Закончить после <strong>${this.repetitionCount}</strong> выполнений.`;
        break;
      }
      case 2: {
        result += this.endDate
          ? `<br>Закончить <strong> ${format(parseISO(this.endDate), 'dd.MM.yyyy')} </strong>`
          : '';
        break;
      }
    }

    return result;
  }
}
