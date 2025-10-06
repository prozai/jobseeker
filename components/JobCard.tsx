import React from 'react';
import { Job } from '../types';
import { BuildingOfficeIcon, MapPinIcon, ArrowTopRightOnSquareIcon } from './Icons';
import { useTheme } from '../contexts/ThemeContext';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const { theme } = useTheme();

  return (
    <div className={`bg-slate-800/70 border border-slate-600 rounded-lg p-4 transition-all ${theme.accent.borderHover} ${theme.accent.shadowHover}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-slate-100">{job.title}</h3>
          <div className="flex items-center text-sm text-slate-400 mt-1">
            <BuildingOfficeIcon className="h-4 w-4 mr-1.5" />
            {job.company}
          </div>
          <div className="flex items-center text-sm text-slate-400 mt-1">
            <MapPinIcon className="h-4 w-4 mr-1.5" />
            {job.location}
          </div>
        </div>
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center text-sm font-medium ${theme.accent.text} ${theme.accent.textHover} transition-colors bg-slate-700/50 px-3 py-1.5 rounded-md`}
        >
          Apply
          <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1.5" />
        </a>
      </div>
      {job.description && (
        <p className="text-sm text-slate-300 mt-3 pt-3 border-t border-slate-700">
          {job.description}
        </p>
      )}
    </div>
  );
};

export default JobCard;