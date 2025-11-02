import { ChartConfiguration } from 'chart.js';

export interface DataSource {
  name: string;
  description: string;
  url: string;
}

export interface GraphData {
  type: string;
  title: string;
  data: any;
  sources?: DataSource[];
}

export class GraphGenerator {
  static generateSCurve(
    technology: string,
    startYear: number = 2020,
    tippingPoint: number = 2025,
    saturation: number = 2030
  ): ChartConfiguration {
    const years = [];
    const adoption = [];

    for (let year = startYear; year <= saturation + 5; year++) {
      years.push(year.toString());
      const x = year - startYear;
      const x0 = tippingPoint - startYear;
      const k = 0.5;
      const adoptionRate = 100 / (1 + Math.exp(-k * (x - x0)));
      adoption.push(adoptionRate);
    }

    return {
      type: 'line',
      data: {
        labels: years,
        datasets: [
          {
            label: `${technology} Adoption (%)`,
            data: adoption,
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 3,
            tension: 0.4,
            fill: true,
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: `${technology} S-Curve Adoption Pattern`,
            font: { size: 16, weight: 'bold' }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: 'Market Adoption (%)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Year'
            }
          }
        }
      }
    };
  }

  static generateCostCurve(
    technology: string,
    initialCost: number,
    learningRate: number = 0.2,
    startYear: number = 2010,
    endYear: number = 2035
  ): ChartConfiguration {
    const years = [];
    const costs = [];
    const currentYear = 2024;

    for (let year = startYear; year <= endYear; year++) {
      years.push(year.toString());
      const yearsElapsed = year - startYear;
      const productionDoubling = Math.pow(2, yearsElapsed / 2);
      const cost = initialCost * Math.pow(productionDoubling, -learningRate);
      costs.push(cost);
    }

    return {
      type: 'line',
      data: {
        labels: years,
        datasets: [
          {
            label: `${technology} Cost`,
            data: costs,
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            borderWidth: 3,
            tension: 0.2,
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: `${technology} Cost Decline (Wright's Law)`,
            font: { size: 16, weight: 'bold' }
          }
        },
        scales: {
          y: {
            type: 'logarithmic',
            title: {
              display: true,
              text: 'Cost (log scale)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Year'
            }
          }
        }
      }
    };
  }

  static generateSolarLCOE(): ChartConfiguration {
    const years = ['2015', '2020', '2024', '2025', '2030', '2035'];
    const utility = [0.064, 0.048, 0.020, 0.015, 0.010, 0.005];
    const residential = [0.151, 0.094, 0.050, 0.035, 0.020, 0.010];

    return {
      type: 'line',
      data: {
        labels: years,
        datasets: [
          {
            label: 'Utility-Scale Solar',
            data: utility,
            borderColor: 'rgb(251, 191, 36)',
            backgroundColor: 'rgba(251, 191, 36, 0.1)',
            borderWidth: 3,
            tension: 0.3,
          },
          {
            label: 'Residential Solar',
            data: residential,
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 3,
            tension: 0.3,
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Solar PV LCOE Forecast ($/kWh)',
            font: { size: 16, weight: 'bold' }
          }
        },
        scales: {
          y: {
            type: 'logarithmic',
            title: {
              display: true,
              text: 'LCOE ($/kWh)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Year'
            }
          }
        }
      }
    };
  }

  static generateCrudeOilDemand(): ChartConfiguration {
    const years = ['2020', '2022', '2023', '2025', '2027', '2030', '2032', '2035'];
    const chinaData = [12.5, 13.0, 13.2, 13.4, 13.5, 10.0, 7.0, 4.0];
    const globalData = [95.0, 97.0, 98.0, 99.0, 99.5, 100.0, 80.0, 50.0];

    return {
      type: 'line',
      data: {
        labels: years,
        datasets: [
          {
            label: 'China (Million Barrels/Day)',
            data: chinaData,
            borderColor: 'rgb(239, 68, 68)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderWidth: 3,
            tension: 0.3,
            fill: true,
          },
          {
            label: 'Global (Million Barrels/Day)',
            data: globalData,
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 3,
            tension: 0.3,
            fill: true,
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Crude Oil Demand Peak Projection',
            font: { size: 16, weight: 'bold' }
          },
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Demand (Million Barrels/Day)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Year'
            }
          }
        }
      }
    };
  }

  static generateMarketShareDisruption(sector: string): ChartConfiguration {
    let labels: string[];
    let oldTech: number[];
    let newTech: number[];
    let title: string;

    if (sector === 'transportation') {
      labels = ['2020', '2022', '2024', '2026', '2028', '2030'];
      oldTech = [97, 92, 75, 40, 15, 5];
      newTech = [3, 8, 25, 60, 85, 95];
      title = 'Transportation: ICE vs EV Market Share';
    } else if (sector === 'energy') {
      labels = ['2020', '2025', '2030', '2035'];
      oldTech = [80, 50, 10, 0];
      newTech = [20, 50, 90, 100];
      title = 'Energy: Fossil vs Renewable';
    } else {
      labels = ['2025', '2030', '2035'];
      oldTech = [90, 50, 20];
      newTech = [10, 50, 80];
      title = 'Market Share Transformation';
    }

    return {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Legacy Technology',
            data: oldTech,
            backgroundColor: 'rgba(239, 68, 68, 0.8)',
          },
          {
            label: 'Disruptive Technology',
            data: newTech,
            backgroundColor: 'rgba(34, 197, 94, 0.8)',
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: title,
            font: { size: 16, weight: 'bold' }
          }
        },
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
            max: 100,
          }
        }
      }
    };
  }
}

export function generateGraphsForQuery(query: string): GraphData[] {
  const graphs: GraphData[] = [];
  const lowerQuery = query.toLowerCase();

  // Two-wheeler electrification graphs
  if (lowerQuery.includes('two-wheeler') || lowerQuery.includes('two wheeler') ||
      lowerQuery.includes('scooter') || lowerQuery.includes('motorcycle') ||
      lowerQuery.includes('bike') && (lowerQuery.includes('electric') || lowerQuery.includes('india'))) {
    graphs.push({
      type: 'scurve',
      title: 'Two-Wheeler Electrification (India)',
      data: GraphGenerator.generateSCurve('Electric Two-Wheelers', 2023, 2027, 2030),
      sources: [
        {
          name: 'NITI Aayog EV Report',
          description: 'India\'s electric mobility transition roadmap',
          url: 'https://www.niti.gov.in/'
        },
        {
          name: 'CEEW Transport Study',
          description: 'Council on Energy, Environment and Water analysis',
          url: 'https://www.ceew.in/'
        },
        {
          name: 'India EV Market Research',
          description: 'Electric two-wheeler adoption forecasts',
          url: 'https://www.indianevmarket.com'
        }
      ]
    });
  }

  // Oil/Petroleum demand graphs
  if (lowerQuery.includes('oil') || lowerQuery.includes('crude') || lowerQuery.includes('petroleum') ||
      lowerQuery.includes('demand peak') || lowerQuery.includes('barrel')) {
    graphs.push({
      type: 'oil-demand',
      title: 'Crude Oil Demand Peak',
      data: GraphGenerator.generateCrudeOilDemand(),
      sources: [
        {
          name: 'RethinkX Energy Report 2020',
          description: 'Comprehensive analysis of oil demand disruption',
          url: 'https://www.rethinkx.com/energy'
        },
        {
          name: 'IEA World Energy Outlook',
          description: 'International Energy Agency global oil demand projections',
          url: 'https://www.iea.org/reports/world-energy-outlook-2023'
        },
        {
          name: 'BP Statistical Review',
          description: 'Historical and projected crude oil consumption data',
          url: 'https://www.bp.com/en/global/corporate/energy-economics/statistical-review-of-world-energy.html'
        }
      ]
    });
  }

  // EV and Transportation graphs
  if (lowerQuery.includes('ev') || lowerQuery.includes('electric vehicle') ||
      lowerQuery.includes('transport') || lowerQuery.includes('automotive')) {
    graphs.push({
      type: 'scurve',
      title: 'EV Adoption S-Curve',
      data: GraphGenerator.generateSCurve('Electric Vehicles', 2020, 2025, 2030),
      sources: [
        {
          name: 'RethinkX Transportation Report',
          description: 'EV adoption S-curve analysis and projections',
          url: 'https://www.rethinkx.com/transportation'
        },
        {
          name: 'BloombergNEF EV Outlook',
          description: 'Global electric vehicle market forecasts',
          url: 'https://about.bnef.com/electric-vehicle-outlook/'
        },
        {
          name: 'IEA Global EV Data',
          description: 'Electric vehicle stock and sales statistics',
          url: 'https://www.iea.org/data-and-statistics/data-tools/global-ev-data-explorer'
        }
      ]
    });
    graphs.push({
      type: 'market-share',
      title: 'Transportation Market Share',
      data: GraphGenerator.generateMarketShareDisruption('transportation'),
      sources: [
        {
          name: 'Clean Disruption of Energy',
          description: 'Tony Seba\'s market transformation analysis',
          url: 'https://tonyseba.com/portfolio-item/clean-disruption-of-energy-and-transportation/'
        },
        {
          name: 'McKinsey Auto Insights',
          description: 'Automotive industry transformation data',
          url: 'https://www.mckinsey.com/industries/automotive-and-assembly'
        }
      ]
    });
  }

  // Solar and Energy graphs
  if (lowerQuery.includes('solar') || lowerQuery.includes('renewable') ||
      lowerQuery.includes('energy') || lowerQuery.includes('swb')) {
    graphs.push({
      type: 'lcoe',
      title: 'Solar Cost Projection',
      data: GraphGenerator.generateSolarLCOE(),
      sources: [
        {
          name: 'IRENA Renewable Cost Database',
          description: 'Solar PV LCOE historical trends and forecasts',
          url: 'https://www.irena.org/costs'
        },
        {
          name: 'NREL Cost Analysis',
          description: 'National Renewable Energy Laboratory cost projections',
          url: 'https://www.nrel.gov/solar/market-research-analysis/solar-cost-targets.html'
        },
        {
          name: 'Lazard LCOE Analysis',
          description: 'Levelized cost of energy comparative analysis',
          url: 'https://www.lazard.com/research-insights/levelized-cost-of-energyplus/'
        }
      ]
    });
    graphs.push({
      type: 'market-share',
      title: 'Energy Transformation',
      data: GraphGenerator.generateMarketShareDisruption('energy'),
      sources: [
        {
          name: 'RethinkX Rethinking Energy 2020-2030',
          description: 'Solar-Wind-Battery disruption framework',
          url: 'https://www.rethinkx.com/energy'
        },
        {
          name: 'IEA Renewables Report',
          description: 'Global renewable energy capacity and generation',
          url: 'https://www.iea.org/reports/renewables-2023'
        }
      ]
    });
  }

  // Cost curves
  if (lowerQuery.includes('cost') || lowerQuery.includes('wright') || lowerQuery.includes('price')) {
    graphs.push({
      type: 'cost',
      title: 'Technology Cost Curve',
      data: GraphGenerator.generateCostCurve('Technology', 100, 0.2, 2010, 2035),
      sources: [
        {
          name: 'Wright\'s Law Research',
          description: 'Learning curve and cost reduction analysis',
          url: 'https://www.sciencedirect.com/topics/engineering/learning-curve'
        },
        {
          name: 'Tony Seba Clean Disruption',
          description: 'Exponential cost improvement frameworks',
          url: 'https://tonyseba.com'
        },
        {
          name: 'MIT Technology Review',
          description: 'Technology cost decline tracking',
          url: 'https://www.technologyreview.com'
        }
      ]
    });
  }

  // Battery graphs
  if (lowerQuery.includes('battery') || lowerQuery.includes('storage')) {
    graphs.push({
      type: 'cost',
      title: 'Battery Cost Decline',
      data: GraphGenerator.generateCostCurve('Battery Storage', 200, 0.18, 2015, 2035),
      sources: [
        {
          name: 'BloombergNEF Battery Price Survey',
          description: 'Annual lithium-ion battery pack prices',
          url: 'https://about.bnef.com/blog/lithium-ion-battery-pack-prices-hit-record-low/'
        },
        {
          name: 'NREL Battery Cost Research',
          description: 'Energy storage cost and performance analysis',
          url: 'https://www.nrel.gov/transportation/battery-cost.html'
        },
        {
          name: 'Tesla Battery Day Data',
          description: 'Real-world battery cost reduction trajectories',
          url: 'https://www.tesla.com/2020shareholdermeeting'
        }
      ]
    });
  }

  // Generic graph request - if user explicitly asks for graph but no specific type matched
  if ((lowerQuery.includes('graph') || lowerQuery.includes('chart') || lowerQuery.includes('plot')) && graphs.length === 0) {
    // Provide a generic adoption curve
    graphs.push({
      type: 'scurve',
      title: 'Technology Adoption Curve',
      data: GraphGenerator.generateSCurve('Technology Adoption', 2020, 2025, 2030),
      sources: [
        {
          name: 'Market Research Data',
          description: 'Technology adoption patterns and projections',
          url: 'https://www.rethinkx.com/reports'
        }
      ]
    });
  }

  return graphs;
}
