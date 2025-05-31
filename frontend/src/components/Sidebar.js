import React from 'react';

const Sidebar = ({ sections }) => {
  return (
    <nav className="sidebar fixed top-1/2 left-4 transform -translate-y-1/2 bg-brand-purple-mid/30 dark:bg-brand-purple-dark/50 backdrop-blur-md p-3 rounded-lg shadow-xl z-50">
      <ul className="space-y-4">
        {sections.map((section) => {
          const IconComponent = section.icon;
          return (
            <li key={section.id} className="sidebar-item">
              <a
                href={`#${section.id}`}
                title={section.title}
                className="flex items-center justify-center p-2 rounded-full text-accent-teal dark:text-accent-blue hover:bg-accent-magenta/20 dark:hover:bg-accent-teal/20 transition-colors duration-200"
                onClick={(e) => {
                  const targetElement = document.getElementById(section.id);
                  if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <IconComponent className="h-6 w-6" />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Sidebar;
