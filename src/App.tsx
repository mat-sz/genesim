import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

import './App.scss';
import { init, Mutation, next, Settings } from './simulation';

const defaultSettings: Settings = {
  startOrganismCount: 50,
  mutationRate: 0.15,
  inactiveBaseSurvivalRate: 1.0,
  activeBaseSurvivalRate: 1.0,
  inactiveBaseSurvivalRateChange: -0.065,
  activeBaseSurvivalRateChange: -0.055,
  inactiveBaseReproductionRate: 0.5,
  activeBaseReproductionRate: 0.5,
  inactiveBaseReproductionRateChange: 0.01,
  activeBaseReproductionRateChange: 0.01,
};

interface Stats {
  time: number;
  mutationNone: number;
  mutationOne: number;
  mutationBoth: number;
  total: number;
}

export const App: React.FC = () => {
  const [state, setState] = useState(init(defaultSettings));
  const [time, setTime] = useState(0);
  const [history, setHistory] = useState<Stats[]>([]);

  const reset = useCallback(() => {
    setState(init(defaultSettings));
    setTime(0);
    setHistory([]);
  }, [setState, setTime, setHistory]);

  const step = useCallback(() => {
    setState(state => next(state, defaultSettings));
    setTime(time => time + 1);
  }, [setState, setTime]);

  const stats: Stats = useMemo(() => {
    let mutationNone = 0;
    let mutationOne = 0;
    let mutationBoth = 0;
    let total = 0;

    for (const organism of state.organisms) {
      total++;

      switch (organism.mutation) {
        case Mutation.NONE:
          mutationNone++;
          break;
        case Mutation.ONE:
          mutationOne++;
          break;
        case Mutation.BOTH:
          mutationBoth++;
          break;
      }
    }

    return {
      time,
      mutationNone,
      mutationOne,
      mutationBoth,
      total,
    };
  }, [state, time]);

  useEffect(() => {
    setHistory(history =>
      [...history, stats].slice(history.length > 15 ? history.length - 15 : 0)
    );
  }, [stats, setHistory]);

  return (
    <div>
      <div className="main">
        <div className="simulation">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1">
            {state.organisms.map(organism => (
              <circle
                key={organism.id}
                cx={organism.x}
                cy={organism.y}
                r={0.005}
                fill={
                  organism.mutation === Mutation.NONE
                    ? '#8884d8'
                    : organism.mutation === Mutation.BOTH
                    ? '#ffc658'
                    : '#82ca9d'
                }
              ></circle>
            ))}
          </svg>
        </div>
        <div className="chart">
          <AreaChart width={500} height={400} data={history}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="mutationNone"
              stackId="1"
              stroke="#8884d8"
              fill="#8884d8"
            />
            <Area
              type="monotone"
              dataKey="mutationOne"
              stackId="1"
              stroke="#82ca9d"
              fill="#82ca9d"
            />
            <Area
              type="monotone"
              dataKey="mutationBoth"
              stackId="1"
              stroke="#ffc658"
              fill="#ffc658"
            />
          </AreaChart>
        </div>
      </div>
      <div className="controls">
        <div>Time: {time}</div>
        <div>
          None: {stats.mutationNone} (
          {Math.round((stats.mutationNone / stats.total) * 100)}%), one:{' '}
          {stats.mutationOne} (
          {Math.round((stats.mutationOne / stats.total) * 100)}%), both:{' '}
          {stats.mutationBoth} (
          {Math.round((stats.mutationBoth / stats.total) * 100)}%), total:{' '}
          {stats.total}
        </div>
        <div>
          <button onClick={step}>Step</button>
          <button onClick={reset}>Reset</button>
        </div>
      </div>
    </div>
  );
};
