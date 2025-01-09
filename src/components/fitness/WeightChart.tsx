import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';
import { useFitnessStore } from '../../store/fitnessStore';
import { useCalorieStore } from '../../store/calorieStore';
import { 
  startOfWeek, 
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  eachDayOfInterval,
  format,
  isSameDay
} from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  annotationPlugin
);

interface Props {
  dateRange: 'week' | 'month' | 'year';
}

export function WeightChart({ dateRange }: Props) {
  const { entries, targetWeight, weightUnit } = useFitnessStore();
  const { entries: calorieEntries, dailyGoal } = useCalorieStore();

  const chartData = useMemo(() => {
    const now = new Date();
    let start: Date, end: Date;

    switch (dateRange) {
      case 'week':
        start = startOfWeek(now);
        end = endOfWeek(now);
        break;
      case 'month':
        start = startOfMonth(now);
        end = endOfMonth(now);
        break;
      case 'year':
        start = startOfYear(now);
        end = endOfYear(now);
        break;
    }

    const days = eachDayOfInterval({ start, end });
    
    // Weight data
    const weightData = days.map(day => {
      const entry = entries.find(e => isSameDay(new Date(e.date), day));
      return entry?.weight || null;
    });

    // Calorie data
    const calorieData = days.map(day => {
      const dayEntries = calorieEntries.filter(e => 
        isSameDay(new Date(e.timestamp), day)
      );
      return dayEntries.reduce((sum, entry) => sum + entry.calories, 0) || null;
    });

    return {
      labels: days.map(day => format(day, 'MMM d')),
      datasets: [
        {
          label: `Weight (${weightUnit})`,
          data: weightData,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true,
          yAxisID: 'y'
        },
        {
          label: 'Calories',
          data: calorieData,
          borderColor: 'rgb(234, 88, 12)',
          backgroundColor: 'rgba(234, 88, 12, 0.1)',
          tension: 0.4,
          fill: true,
          yAxisID: 'y1'
        }
      ]
    };
  }, [entries, calorieEntries, dateRange, weightUnit]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      annotation: {
        annotations: {
          targetWeight: {
            type: 'line',
            yMin: targetWeight,
            yMax: targetWeight,
            borderColor: 'rgb(34, 197, 94)',
            borderWidth: 2,
            borderDash: [5, 5],
            yScaleID: 'y',
            label: {
              content: 'Target Weight',
              enabled: true,
              position: 'start'
            }
          },
          calorieGoal: {
            type: 'line',
            yMin: dailyGoal,
            yMax: dailyGoal,
            borderColor: 'rgb(234, 88, 12)',
            borderWidth: 2,
            borderDash: [5, 5],
            yScaleID: 'y1',
            label: {
              content: 'Calorie Goal',
              enabled: true,
              position: 'end'
            }
          }
        }
      },
      legend: {
        position: 'top' as const,
        labels: {
          padding: 20,
          font: {
            size: 13
          }
        }
      },
      tooltip: {
        padding: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 13
        }
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        beginAtZero: false,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          padding: 8,
          font: {
            size: 12
          },
          callback: (value: number) => `${value} ${weightUnit}`
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        beginAtZero: true,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          padding: 8,
          font: {
            size: 12
          },
          callback: (value: number) => `${value} cal`
        }
      },
      x: {
        ticks: {
          padding: 8,
          font: {
            size: 12
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        }
      }
    }
  };

  return (
    <div className="w-full h-[250px] sm:h-[500px] p-4">
      <Line data={chartData} options={options} />
    </div>
  );
}
