import React from "react";

/**
 * Sidebar component with icon-based navigation/actions.
 * - Collapsible on small screens (off-canvas drawer)
 * - Uses accessible aria-labels and button titles
 * - Colors align with CSS variables (primary, secondary, success)
 */
// PUBLIC_INTERFACE
export default function Sidebar({
  isOpen,
  collapsed,
  onToggleOpen,
  onCollapseToggle,
  onSelectFilter,
  activeFilter,
}) {
  /** Render the sidebar with navigation icons and labels. */
  const NavItem = ({ id, label, title, onClick, icon, colorVar }) => (
    <button
      className={`sidebar-item ${activeFilter === id ? "active" : ""}`}
      onClick={onClick}
      aria-label={label}
      title={title}
      style={colorVar ? { "--icon-color": `var(${colorVar})` } : undefined}
    >
      <span className="sidebar-icon" aria-hidden="true">
        {icon}
      </span>
      {!collapsed && <span className="sidebar-label">{label}</span>}
    </button>
  );

  const HomeIcon = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3l9 8h-3v9h-12v-9h-3z" />
    </svg>
  );
  const CompletedIcon = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 16.2l-3.5-3.5-1.4 1.4 4.9 4.9 11-11-1.4-1.4z" />
    </svg>
  );
  const ActiveIcon = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 12a9 9 0 1 1 18 0 9 9 0 0 1-18 0zm9-5v6l4 2" />
    </svg>
  );
  const SettingsIcon = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.14,12.94a7.43,7.43,0,0,0,0-1.88l2.11-1.65a.5.5,0,0,0,.12-.64l-2-3.46a.5.5,0,0,0-.6-.22l-2.49,1a7.21,7.21,0,0,0-1.63-.95l-.38-2.65A.5.5,0,0,0,13.8,2H10.2a.5.5,0,0,0-.49.41L9.33,5.06a7.21,7.21,0,0,0-1.63.95l-2.49-1a.5.5,0,0,0-.6.22l-2,3.46a.5.5,0,0,0,.12.64L4.86,11.06a7.43,7.43,0,0,0,0,1.88L2.73,14.59a.5.5,0,0,0-.12.64l2,3.46a.5.5,0,0,0,.6.22l2.49-1a7.21,7.21,0,0,0,1.63.95l.38,2.65a.5.5,0,0,0,.49.41h3.6a.5.5,0,0,0,.49-.41l.38-2.65a7.21,7.21,0,0,0,1.63-.95l2.49,1a.5.5,0,0,0,.6-.22l2-3.46a.5.5,0,0,0-.12-.64ZM12,15.5A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
    </svg>
  );

  return (
    <>
      <aside
        className={`sidebar ${isOpen ? "open" : ""} ${collapsed ? "collapsed" : ""}`}
        aria-label="Sidebar navigation"
      >
        <div className="sidebar-header">
          <button
            className="sidebar-toggle"
            onClick={onCollapseToggle}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? "»" : "«"}
          </button>
        </div>
        <nav className="sidebar-nav" role="navigation" aria-label="Task Filters">
          <NavItem
            id="all"
            label="All Tasks"
            title="Show all tasks"
            onClick={() => onSelectFilter("all")}
            icon={HomeIcon}
          />
          <NavItem
            id="completed"
            label="Completed"
            title="Show completed tasks"
            onClick={() => onSelectFilter("completed")}
            icon={CompletedIcon}
            colorVar="--success"
          />
          <NavItem
            id="active"
            label="Active"
            title="Show active (incomplete) tasks"
            onClick={() => onSelectFilter("active")}
            icon={ActiveIcon}
            colorVar="--primary"
          />
          <div className="sidebar-sep" role="separator" aria-hidden="true" />
          <NavItem
            id="about"
            label="About"
            title="About / Settings"
            onClick={() => onSelectFilter("about")}
            icon={SettingsIcon}
            colorVar="--secondary"
          />
        </nav>
      </aside>
      {/* Overlay for small screens when drawer is open */}
      <button
        className={`sidebar-overlay ${isOpen ? "visible" : ""}`}
        aria-label="Close sidebar"
        title="Close sidebar"
        onClick={onToggleOpen}
      />
    </>
  );
}
