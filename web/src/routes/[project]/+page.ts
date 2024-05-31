import { DateTime } from 'luxon';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ url, params }) => {
  const startDate = url.searchParams.get('startDate') || DateTime.now().startOf('month').toISO();
  const endDate = url.searchParams.get('endDate') || DateTime.now().endOf('month').toISO();

  return { project: params.project, startDate, endDate };
};
