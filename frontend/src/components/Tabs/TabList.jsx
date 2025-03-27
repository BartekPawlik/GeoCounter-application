import React from "react";
import Tab from "./Tab"

function TabList({
    tabContents,
    activeTab,
    setActiveTab,
    handleDeleteItem,
    isAddingTab,
  }) {
    return (
      <div className="tab-list">
        {tabContents.map((tab) => (
          <Tab
            key={tab.id}
            tab={tab}
            isActive={activeTab === tab.title}
            handleDeleteItem={handleDeleteItem}
            onClick={() => setActiveTab(tab.title)}
            isAddingTab={isAddingTab}
          />
        ))}
      </div>
    );
  }

  export default TabList