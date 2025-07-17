import React, { useState } from 'react';

interface BlogPost {
  id: string;
  title: string;
  author: string;
  date: string;
  content: string;
  excerpt?: string;
  images?: string[];
  slug: string;
}

interface TimelineProps {
  posts: BlogPost[];
  onSelect: (year: string, month: string) => void;
  selected: { year: string; month: string } | null;
}

function groupPostsByYearMonth(posts: BlogPost[]) {
  const grouped: Record<string, Record<string, BlogPost[]>> = {};
  posts.forEach(post => {
    const date = new Date(post.date);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    if (!grouped[year]) grouped[year] = {};
    if (!grouped[year][month]) grouped[year][month] = [];
    grouped[year][month].push(post);
  });
  return grouped;
}

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const Timeline: React.FC<TimelineProps> = ({ posts, onSelect, selected }) => {
  const grouped = groupPostsByYearMonth(posts);
  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

  return (
    <nav className="flex flex-col items-start w-full py-4 px-2 border-l border-gray-200 dark:border-gray-700">
      {years.map(year => (
        <div key={year} className="mb-4 w-full">
          <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2 pl-2">
            {year}
          </div>
          <ul className="ml-4">
            {Object.keys(grouped[year]).sort((a, b) => Number(b) - Number(a)).map(month => (
              <li key={month} className="mb-1">
                <button
                  className={`text-left px-3 py-1 rounded transition-colors w-full
                    ${selected && selected.year === year && selected.month === month
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-bold'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'}
                  `}
                  onClick={() => onSelect(year, month)}
                >
                  {monthNames[Number(month) - 1]}
                  <span className="ml-2 text-xs text-gray-400">({grouped[year][month].length})</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
};

export default Timeline; 