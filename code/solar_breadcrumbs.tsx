import React from 'react';
import { Breadcrumb } from 'react-bootstrap';

interface Crumb {
  label: string;
  onClick?: () => void;
}

interface BreadcrumbsProps {
  crumbs: Crumb[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ crumbs }) => {
  return (
    <Breadcrumb className="px-3 py-2 bg-light rounded mb-4">
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;
        return (
          <Breadcrumb.Item
            key={index}
            active={isLast}
            onClick={!isLast && crumb.onClick ? crumb.onClick : undefined}
            href={!isLast && crumb.onClick ? "#" : undefined}
          >
            {crumb.label}
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
};