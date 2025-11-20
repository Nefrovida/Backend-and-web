import React from 'react';

interface PageHeaderProps {
  title?: string;
  icon?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title = "Citas médicas",
  icon 
}) => {
  return (
    <div className="flex items-center space-x-3">
      {icon && (
        <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
          {icon}
        </div>
      )}
      <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
    </div>
  );
};

export default PageHeader;