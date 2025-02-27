import { useMemo, useEffect, useState } from 'react';
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
  isSameDay,
  differenceInDays,
  isAfter,
  isBefore,
  isWithinInterval
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

export function WeightChart({ dateRange, customStartDate, customEndDate }) {
  const { entries, targetWeight, weightUnit } = useFitnessStore();
  const { entries: calorieEntries, dailyGoal } = useCalorieStore();
  const [isMobile, setIsMobile] = useState(false);

  // Check if the device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const chartData = useMemo(() => {
    const now = new Date();
    let start, end;

    if (dateRange === 'custom' && customStartDate && customEndDate) {
      start = new Date(customStartDate);
      end = new Date(customEndDate);
      
      // Ensure start date is before end date
      if (isAfter(start, end)) {
        [start, end] = [end, start];
      }
    } else {
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
        default:
          start = startOfWeek(now);
          end = endOfWeek(now);
      }
    }

    // Calculate days between dates
    const daysDiff = differenceInDays(end, start);
    
    // For very large ranges, we might want to sample data points
    // to avoid performance issues and overcrowded charts
    let interval = 1; // Default: show every day
    if (daysDiff > 365) {
      interval = 7; // For ranges > 1 year, show weekly data
    } else if (daysDiff > 90) {
      interval = 3; // For ranges > 3 months, show every 3 days
    }
    
    // Generate days array with appropriate interval
    const allDays = eachDayOfInterval({ start, end });
    const days = interval === 1 ? allDays : allDays.filter((_, i) => i % interval === 0);
    
    // Ensure we always include the start and end dates
    if (interval > 1 && days.length > 2) {
      if (!isSameDay(days[0], start)) {
        days[0] = start;
      }
      if (!isSameDay(days[days.length - 1], end)) {
        days[days.length - 1] = end;
      }
    }

    // Filter entries to only include those within the date range
    const filteredWeightEntries = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return isWithinInterval(entryDate, { start, end });
    });

    const filteredCalorieEntries = calorieEntries.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      return isWithinInterval(entryDate, { start, end });
    });
    
    // Weight data
    const weightData = days.map(day => {
      const entry = filteredWeightEntries.find(e => isSameDay(new Date(e.date), day));
      return entry?.weight || null;
    });

    // Calorie data
    const calorieData = days.map(day => {
      const dayEntries = filteredCalorieEntries.filter(e => 
        isSameDay(new Date(e.timestamp), day)
      );
      return dayEntries.reduce((sum, entry) => sum + entry.calories, 0) || null;
    });

    // Adjust point and line sizes based on device and data density
    const pointRadius = isMobile ? 6 : 5;
    const pointHoverRadius = isMobile ? 9 : 7;
    const borderWidth = isMobile ? 4 : 3;

    // Adjust label format based on date range length
    let labelFormat = 'MMM d';
    if (daysDiff > 365) {
      labelFormat = 'MMM yyyy';
    } else if (daysDiff > 60) {
      labelFormat = 'MMM d';
    }

    return {
      labels: days.map(day => format(day, labelFormat)),
      datasets: [
        {
          label: `Weight (${weightUnit})`,
          data: weightData,
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: borderWidth,
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          tension: 0.4,
          fill: true,
          yAxisID: 'y',
          pointBackgroundColor: 'rgb(59, 130, 246)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: pointRadius,
          pointHoverRadius: pointHoverRadius,
          spanGaps: true, // This ensures the line connects even with missing data points
        },
        {
          label: 'Calories',
          data: calorieData,
          borderColor: 'rgb(234, 88, 12)',
          borderWidth: borderWidth,
          backgroundColor: 'rgba(234, 88, 12, 0.2)',
          tension: 0.4,
          fill: true,
          yAxisID: 'y1',
          pointBackgroundColor: 'rgb(234, 88, 12)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: pointRadius,
          pointHoverRadius: pointHoverRadius,
          spanGaps: true, // This ensures the line connects even with missing data points
        }
      ]
    };
  }, [entries, calorieEntries, dateRange, weightUnit, isMobile, customStartDate, customEndDate]);

  const options = useMemo(() => {
    // Adjust font sizes based on device
    const titleFontSize = isMobile ? 16 : 14;
    const labelFontSize = isMobile ? 14 : 12;
    const tickFontSize = isMobile ? 14 : 12;
    
    // Calculate days between dates for custom range
    let daysDiff = 7; // Default for week
    if (dateRange === 'custom' && customStartDate && customEndDate) {
      daysDiff = differenceInDays(
        new Date(customEndDate), 
        new Date(customStartDate)
      );
      // Ensure positive value
      daysDiff = Math.abs(daysDiff);
    } else if (dateRange === 'month') {
      daysDiff = 30;
    } else if (dateRange === 'year') {
      daysDiff = 365;
    }
    
    // Adjust maxTicksLimit based on date range
    let xAxisMaxTicksLimit;
    if (daysDiff > 90) {
      xAxisMaxTicksLimit = isMobile ? 6 : 12; // Year-like
    } else if (daysDiff > 14) {
      xAxisMaxTicksLimit = isMobile ? 5 : 10; // Month-like
    } else {
      xAxisMaxTicksLimit = isMobile ? 4 : 7; // Week-like
    }
    
    // Add custom title for custom date range
    let chartTitle = '';
    if (dateRange === 'custom' && customStartDate && customEndDate) {
      const startFormatted = format(new Date(customStartDate), 'MMM d, yyyy');
      const endFormatted = format(new Date(customEndDate), 'MMM d, yyyy');
      chartTitle = `${startFormatted} to ${endFormatted}`;
    }
    
    return {
      responsive: true,
      maintainAspectRatio: false,
      devicePixelRatio: 2,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        title: {
          display: dateRange === 'custom',
          text: chartTitle,
          font: {
            size: titleFontSize,
            weight: 'bold'
          },
          padding: {
            top: 10,
            bottom: 10
          }
        },
        annotation: {
          annotations: {
            targetWeight: {
              type: 'line',
              yMin: targetWeight || 0,
              yMax: targetWeight || 0,
              borderColor: 'rgb(34, 197, 94)',
              borderWidth: isMobile ? 3 : 2,
              borderDash: [6, 6],
              yScaleID: 'y',
              label: {
                content: 'Target Weight',
                enabled: true,
                position: 'start',
                backgroundColor: 'rgb(34, 197, 94)',
                color: 'white',
                padding: isMobile ? 8 : 6,
                borderRadius: 4,
                font: {
                  weight: 'bold',
                  size: labelFontSize
                }
              }
            },
            calorieGoal: {
              type: 'line',
              yMin: dailyGoal || 0,
              yMax: dailyGoal || 0,
              borderColor: 'rgb(234, 88, 12)',
              borderWidth: isMobile ? 3 : 2,
              borderDash: [6, 6],
              yScaleID: 'y1',
              label: {
                content: 'Calorie Goal',
                enabled: true,
                position: 'end',
                backgroundColor: 'rgb(234, 88, 12)',
                color: 'white',
                padding: isMobile ? 8 : 6,
                borderRadius: 4,
                font: {
                  weight: 'bold',
                  size: labelFontSize
                }
              }
            }
          }
        },
        legend: {
          position: 'top',
          labels: {
            padding: isMobile ? 25 : 20,
            usePointStyle: true,
            pointStyle: 'circle',
            font: {
              size: titleFontSize,
              weight: 'bold'
            }
          }
        },
        tooltip: {
          padding: isMobile ? 15 : 12,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleFont: {
            size: titleFontSize,
            weight: 'bold'
          },
          bodyFont: {
            size: labelFontSize
          },
          cornerRadius: 8,
          displayColors: true,
          boxPadding: isMobile ? 8 : 6,
          usePointStyle: true,
          callbacks: {
            label: function(context) {
              const label = context.dataset.label || '';
              const value = context.parsed.y;
              return `${label}: ${value}`;
            }
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
            display: true
          },
          border: {
            display: false
          },
          ticks: {
            padding: isMobile ? 8 : 6,
            font: {
              size: tickFontSize,
              weight: 'bold'
            },
            callback: function(value) {
              return `${value} ${weightUnit}`;
            },
            maxTicksLimit: isMobile ? 5 : 8
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          beginAtZero: true,
          grid: {
            drawOnChartArea: false,
            display: true
          },
          border: {
            display: false
          },
          ticks: {
            padding: isMobile ? 8 : 6,
            font: {
              size: tickFontSize,
              weight: 'bold'
            },
            callback: function(value) {
              return `${value} cal`;
            },
            maxTicksLimit: isMobile ? 5 : 8
          }
        },
        x: {
          ticks: {
            padding: isMobile ? 8 : 6,
            font: {
              size: tickFontSize,
              weight: 'bold'
            },
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: xAxisMaxTicksLimit
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
            display: true
          },
          border: {
            display: false
          }
        }
      },
      elements: {
        line: {
          borderWidth: isMobile ? 4 : 3,
          tension: 0.4,
        },
        point: {
          radius: isMobile ? 6 : 5,
          hoverRadius: isMobile ? 9 : 7,
          borderWidth: 2,
          hoverBorderWidth: 3,
        }
      },
      layout: {
        padding: {
          top: isMobile ? 10 : 8,
          right: isMobile ? 10 : 8,
          bottom: isMobile ? 10 : 8,
          left: isMobile ? 10 : 8
        }
      }
    };
  }, [isMobile, targetWeight, dailyGoal, weightUnit, dateRange, customStartDate, customEndDate]);

  return (
    <div className="w-full h-[400px] sm:h-[450px] md:h-[500px] bg-white dark:bg-gray-800 rounded-xl shadow-md sm:shadow-lg overflow-hidden">
      <div className="w-full h-full">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
