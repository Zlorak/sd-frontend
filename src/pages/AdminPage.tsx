import React, { useState, useRef } from 'react';
import { MakeManager } from '@/components/admin/MakeManager';
import { ModelManager, ModelManagerRef } from '@/components/admin/ModelManager';
import { MakeModelCategory } from '@/types/inventory';

type TabType = 'computers' | 'peripherals' | 'printers';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('computers');
  const modelManagerRef = useRef<ModelManagerRef>(null);

  const handleMakeAdded = () => {
    modelManagerRef.current?.refreshMakes();
  };

  const getCategoryForTab = (tab: TabType): MakeModelCategory => {
    switch (tab) {
      case 'computers':
        return 'computer';
      case 'peripherals':
        return 'peripheral';
      case 'printers':
        return 'printer';
      default:
        return 'computer';
    }
  };

  const tabs = [
    { id: 'computers', label: 'Computers', category: 'computer' as MakeModelCategory },
    { id: 'peripherals', label: 'Peripherals', category: 'peripheral' as MakeModelCategory },
    { id: 'printers', label: 'Printers', category: 'printer' as MakeModelCategory },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Admin - Make & Model Management
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Manage the available makes and models for inventory items.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-8">
        <MakeManager 
          category={getCategoryForTab(activeTab)}
          onMakeAdded={handleMakeAdded}
        />
        <ModelManager 
          ref={modelManagerRef}
          category={getCategoryForTab(activeTab)}
        />
      </div>
    </div>
  );
};