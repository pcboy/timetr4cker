import Axios from 'axios';
import { DateTime, Interval } from 'luxon';
import { Transformers, type ProjectResponse } from '$lib';
import { PUBLIC_API_URL } from '$env/static/public';

export interface Entry {
  id: string;
  startTime: string;
  endTime: string;
  duration: number;
}

export const computeDuration = (entry: Entry) =>
  entry.endTime
    ? DateTime.fromISO(entry.endTime).diff(DateTime.fromISO(entry.startTime), 'minutes').minutes
    : 0;

export class ProjectStore {
  public project = $state({
    id: '',
    name: '',
    budget: 0,
    timeBudget: 0,
    rate: 0,
    isTimerStarted: false,
    entries: [] as Entry[],
    startDate: '',
    endDate: '',
    createdAt: '',
    updatedAt: '',
    recommendedStopTime: '',
    recommendedHours: ''
  });

  get name() { return this.project.name; }
  get entries() { return this.project.entries; }
  get budget() { return this.project.budget; }
  get rate() { return this.project.rate; }
  get recommendedHours() { return this.project.recommendedHours; }
  get recommendedStopTime() { return this.project.recommendedStopTime; }
  get timeBudget() { return this.project.timeBudget; }
  get isTimerStarted() { return this.project.isTimerStarted; }

  public moniesPercentage = $derived.by(() => {
    if (this.project.budget === 0) return 0;
    if (!this.project.entries) return 0;
    const minutes = this.project.entries
      .map((entry) => entry.duration)
      .reduce((a, b) => a + b, 0);

    return (((minutes / 60.0) * this.project.rate) / this.project.budget) * 100 || 0;
  });

  public currentMinutes = $derived(
    this.project.entries.map((entry) => entry.duration).reduce((a, b) => a + b, 0)
  );

  public progressMinutes = $derived((this.currentMinutes / this.project.timeBudget) * 100);

  public sortedEntries = $derived(
    this.project.entries.slice().sort((a, b) => (a.startTime > b.startTime ? -1 : 1))
  );

  public groupedEntries = $derived(
    this.sortedEntries.reduce((a: { [key: string]: Entry[] }, b) => {
      const date = DateTime.fromISO(b.startTime).toFormat('yyyy/MM/dd');
      a[date] = a[date] || [];
      a[date].push(b);
      return a;
    }, {})
  );

  public subTotals = $derived(
    Object.keys(this.groupedEntries).reduce((acc: { [key: string]: string }, day: string) => {
      acc[day] = (this.groupedEntries[day].reduce((a, b) => a + (b.duration || 0), 0) / 60.0).toFixed(1);
      return acc;
    }, {})
  );

  public fetchProject = (projectName: string) => {
    return Axios.get(PUBLIC_API_URL + `/projects/${projectName}`)
      .then((response) => response.data)
      .then((data) => {
        console.log(data);
        this.project = { ...this.project, ...Transformers.project(data) };
        return this.project;
      });
  }

  set timerStatus(started: boolean) {
    const method = !started ? 'stopTimer' : 'startTimer';
    Axios.post(PUBLIC_API_URL + `/entries/${this.project.name}/${method}`, {
      withCredentials: true
    }).then(() => {
      this.loadEntries(this.project.startDate, this.project.endDate).then(
        () => (this.project.isTimerStarted = !!started)
      );
    });
  }

  public loadEntries = (startDate: string, endDate: string) => {
    return Axios.get(PUBLIC_API_URL + `/entries/${this.project.name}`, {
      params: {
        startTime: DateTime.fromISO(startDate).toMillis(),
        endTime: DateTime.fromISO(endDate).toMillis()
      }
    })
      .then((response) => response.data)
      .then((data) => {
        const entries = data.map((x: Entry) => ({
          id: x.id,
          startTime: x.startTime,
          endTime: x.endTime,
          duration: computeDuration(x)
        }));

        const isTimerStarted = data.length > 0 && data[data.length - 1]?.endTime == null;

        const { stopTime: recommendedStopTime, duration: recommendedHours } = this.getStopTime(
          entries,
          endDate,
          this.project.timeBudget,
          isTimerStarted ? data[data.length - 1]?.startTime : DateTime.now().toISO()
        );

        this.project = {
          ...this.project,
          startDate: startDate,
          endDate: endDate,
          entries: entries,
          isTimerStarted,
          recommendedStopTime,
          recommendedHours
        };

        return this.project;
      });
  }

  public saveEntry = (entry: Entry) => {
    if (!entry.id) {
      return Axios.post(PUBLIC_API_URL + '/entries', {
        startTime: DateTime.fromISO(entry.startTime).toMillis(),
        endTime: DateTime.fromISO(entry.endTime).toMillis()
      }).then((response) => response.data);
    }
    return Axios.put(`${PUBLIC_API_URL}/entries/${entry.id}`, {
      startTime: DateTime.fromISO(entry.startTime).toMillis(),
      endTime: DateTime.fromISO(entry.endTime).toMillis()
    }).then((response) => response.data);
  }

  public deleteEntry = (entry: Entry) => {
    return Axios.delete(PUBLIC_API_URL + `/entries/${entry.id}`).then(
      () => (this.project.entries = this.project.entries.filter((x) => x.id != entry.id))
    );
  }

  public updateProject = (projectResp: ProjectResponse) => {
    return Axios.post(PUBLIC_API_URL + `/projects/${projectResp.id}`, {
      budget: projectResp.budget,
      timeBudget: projectResp.timeBudget,
      rate: projectResp.rate
    }).then(() => {
      this.project.budget = projectResp.budget;
      this.project.timeBudget = projectResp.timeBudget;
      this.project.rate = projectResp.rate;
    });
  }

  public setRate = (rate: number) => {
    this.project.rate = rate;
    this.updateProject({
      id: this.project.id,
      name: this.project.name,
      budget: this.project.budget,
      timeBudget: this.project.timeBudget,
      rate: this.project.rate,
      createdAt: this.project.createdAt,
      updatedAt: this.project.updatedAt
    });
  }

  public setBudget = (budget: number) => {
    this.project.budget = budget;
    this.updateProject({
      id: this.project.id,
      name: this.project.name,
      budget: this.project.budget,
      timeBudget: this.project.timeBudget,
      rate: this.project.rate,
      createdAt: this.project.createdAt,
      updatedAt: this.project.updatedAt
    });
  }

  public setTimeBudget = (timeBudget: number) => {
    this.project.timeBudget = timeBudget;
    this.updateProject({
      id: this.project.id,
      name: this.project.name,
      budget: this.project.budget,
      timeBudget: this.project.timeBudget,
      rate: this.project.rate,
      createdAt: this.project.createdAt,
      updatedAt: this.project.updatedAt
    });
  }

  public setStartDate = (startDate: string) => {
    this.project.startDate = startDate;
  }

  public setEndDate = (endDate: string) => {
    this.project.endDate = endDate;
  }

  public getStopTime(
    entries: Entry[],
    endDate: string,
    timeBudget: number,
    currentDate: string
  ) {
    const currentDateTime = DateTime.fromISO(currentDate);

    const isWorkDay = (date: DateTime) => {
      const dayOfWeek = date.weekday;
      return dayOfWeek <= 5;
    };
    const getWorkingDaysInInterval = (start: DateTime, end: DateTime) =>
      Interval.fromDateTimes(start.startOf('day'), end.endOf('day'))
        .splitBy({ day: 1 })
        .filter((x) => (x.start ? isWorkDay(x.start) : false)).length;
    const daysLeft = getWorkingDaysInInterval(
      DateTime.now(),
      DateTime.fromISO(endDate)
    );

    const totalMinutes = timeBudget;

    const minutesWorkedThisMonth = entries
      .map((entry) => entry.duration)
      .reduce((a, b) => a + b, 0);

    const remainingMinutes = totalMinutes - minutesWorkedThisMonth;
    const minutesPerDay = remainingMinutes / daysLeft;

    const minutesWorkedToday = entries
      .filter((entry) => {
        const entryDate = DateTime.fromISO(entry.startTime);
        return entryDate.day === currentDateTime.day && entryDate.month === currentDateTime.month;
      })
      .map((entry) => entry.duration)
      .reduce((a, b) => a + b, 0);

    const minutesLeftToday = minutesPerDay - minutesWorkedToday;
    const stopTime = currentDateTime.plus({ minutes: minutesLeftToday });

    return {
      stopTime: stopTime.toFormat('HH:mm'),
      duration: stopTime.diff(currentDateTime).as('hours').toFixed(1)
    };
  }
}

export const projectStore = new ProjectStore();
