'use client';

import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LogarithmicScale,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { GraphData } from '@/lib/graphs/graph-generator';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface GraphRendererProps {
  graphs: GraphData[];
  className?: string;
}

export default function GraphRenderer({ graphs, className }: GraphRendererProps) {
  const [activeGraphIndex, setActiveGraphIndex] = useState(0);

  const renderGraph = (graphData: GraphData) => {
    if (!graphData?.data) return null;

    const config = graphData.data;

    if (config.type === 'bar') {
      return <Bar data={config.data} options={config.options} />;
    }
    return <Line data={config.data} options={config.options} />;
  };

  if (graphs.length === 0) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="text-center text-gray-500">
          <p>Ask a question to generate graphs</p>
        </div>
      </div>
    );
  }

  const getDataSources = () => {
    const currentGraph = graphs[activeGraphIndex];
    if (currentGraph?.sources && currentGraph.sources.length > 0) {
      return currentGraph.sources;
    }
    // Fallback to general sources if none specified
    return [
      {
        name: 'RethinkX Reports',
        description: 'Technology disruption analysis and forecasts',
        url: 'https://www.rethinkx.com/reports'
      },
      {
        name: "Tony Seba's Research",
        description: 'Clean disruption frameworks and S-curve models',
        url: 'https://tonyseba.com'
      }
    ];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Graph Tile */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="mb-4">
          {renderGraph(graphs[activeGraphIndex])}
        </div>

        {graphs.length > 1 && (
          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-2 gap-2">
              {graphs.map((graph, index) => (
                <button
                  key={index}
                  onClick={() => setActiveGraphIndex(index)}
                  className={`p-2 rounded text-sm transition-all ${
                    index === activeGraphIndex
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {graph.title}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Data Sources Tile */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">database</span>
          Data Sources
        </h3>
        <div className="space-y-3">
          {getDataSources().map((source, index) => (
            <div
              key={index}
              className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{source.name}</h4>
                  <p className="text-xs text-gray-600 mt-1">{source.description}</p>
                </div>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <span className="material-symbols-outlined text-lg">open_in_new</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
