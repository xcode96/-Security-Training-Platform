import React, { useState, useRef } from 'react';
import Icon from './Icon';
import type { Module, ModuleStatus } from '../types';

interface ModuleListItemProps {
  module: Module;
  status: ModuleStatus;
  onStart: (subTopic?: string) => void;
  isAdmin: boolean;
  onManage: (subTopic: string) => void;
  onExport: (subTopic: string) => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>, subTopic: string) => void;
  isVisible: boolean;
  onToggleVisibility: () => void;
}

const SubTopicItem: React.FC<{
  topic: string;
  isAdmin: boolean;
  onStart: (topic: string) => void;
  onManage: (topic: string) => void;
  onExport: (topic: string) => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>, topic: string) => void;
}> = ({ topic, isAdmin, onStart, onManage, onExport, onImport }) => {
  const importInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    importInputRef.current?.click();
  };

  return (
    <li className="flex items-center justify-between py-1 px-2 rounded-md hover:bg-indigo-50 transition-colors duration-200 group">
      <div className="flex items-start">
          <span className="text-indigo-400 mr-2 mt-1">&bull;</span>
          <span className="text-sm text-gray-600 group-hover:text-indigo-800">{topic}</span>
      </div>
      <div className="flex items-center gap-2">
        {isAdmin ? (
          <>
            <input
              type="file"
              ref={importInputRef}
              className="hidden"
              accept=".json"
              onChange={(e) => onImport(e, topic)}
            />
            <button onClick={handleImportClick} title={`Import questions for ${topic}`} className="p-1 text-gray-400 hover:text-sky-600 transition-colors">
              <Icon iconName="upload" className="h-4 w-4" />
            </button>
            <button onClick={() => onExport(topic)} title={`Export questions for ${topic}`} className="p-1 text-gray-400 hover:text-pink-600 transition-colors">
              <Icon iconName="download" className="h-4 w-4" />
            </button>
            <button 
              onClick={() => onManage(topic)} 
              className="px-3 py-1 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full hover:bg-purple-200 transition-colors"
              aria-label={`Manage questions for ${topic}`}
            >
              Manage
            </button>
          </>
        ) : (
          <button 
            onClick={() => onStart(topic)} 
            className="px-3 py-1 text-xs font-semibold text-indigo-700 bg-indigo-100 rounded-full hover:bg-indigo-200 transition-colors"
            aria-label={`Start quiz for ${topic}`}
          >
            Start
          </button>
        )}
      </div>
    </li>
  );
};


const ModuleListItem: React.FC<ModuleListItemProps> = ({ module, status, onStart, isAdmin, onManage, onExport, onImport, isVisible, onToggleVisibility }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusBadge = () => {
    if (isAdmin) {
        return <span className="text-xs font-semibold text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">Admin Mode</span>;
    }
    switch (status) {
      case 'completed':
        return <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">Completed</span>;
      case 'in-progress':
        return <span className="text-xs font-semibold text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">In Progress</span>;
      default:
        return <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Not Started</span>;
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 ${isAdmin && !isVisible ? 'opacity-50' : ''}`}>
      <div 
        className="p-4 flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls={`module-content-${module.id}`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsExpanded(!isExpanded); }}
      >
        <div className="flex items-center gap-4">
          {isAdmin && (
              <button
                  onClick={(e) => {
                      e.stopPropagation();
                      onToggleVisibility();
                  }}
                  title={isVisible ? 'Hide module from users' : 'Show module to users'}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800"
              >
                  <Icon iconName={isVisible ? 'eye' : 'eye-slash'} className="h-5 w-5" />
              </button>
          )}
          <div className={`p-3 rounded-lg ${module.color}`}>
            <Icon iconName="folder" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">{module.title}</h3>
            <p className="text-sm text-gray-500">{module.subTopics.length} sub-topics</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {module.id !== 3 && getStatusBadge()}
          {!isAdmin && module.id !== 3 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStart();
              }}
              className={`px-6 py-2 rounded-lg font-semibold text-sm transition-colors duration-300 ${
                status === 'completed' 
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {status === 'completed' ? 'Review' : 'Start'}
            </button>
          )}
          <Icon iconName="chevron-down" className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </div>
      
      {isExpanded && (
        <div id={`module-content-${module.id}`} className="px-6 pb-4 pt-0 border-t border-gray-100">
          <h4 className="text-sm font-semibold text-gray-700 my-3">Sub-Topics Covered:</h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
            {module.subTopics.map((topic, index) => (
              <SubTopicItem
                key={index}
                topic={topic}
                isAdmin={isAdmin}
                onStart={onStart}
                onManage={onManage}
                onExport={onExport}
                onImport={onImport}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ModuleListItem;