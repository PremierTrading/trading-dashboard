import React, { useState } from "react";

export function Tabs({ children, defaultValue }) {
  const [active, setActive] = useState(defaultValue);

  return React.Children.map(children, (child) =>
    child.type.name === "TabsList"
      ? React.cloneElement(child, { active, setActive })
      : child.type.name === "TabsContent" && child.props.value === active
      ? child
      : null
  );
}

export function TabsList({ children, active, setActive, className }) {
  return (
    <div className={`flex gap-2 ${className}`}>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { active, setActive })
      )}
    </div>
  );
}

export function TabsTrigger({ value, children, active, setActive }) {
  const isActive = active === value;
  return (
    <button
      onClick={() => setActive(value)}
      className={`px-4 py-2 rounded ${
        isActive ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
      }`}
    >
      {children}
    </button>
  );
}

export function TabsContent({ children }) {
  return <div className="mt-4">{children}</div>;
}
