import { useState } from "react";
import HomeView from "@/views/HomeView";

const HomeController = () => {
  const [activeTab, setActiveTab] = useState<"domestic" | "global">("domestic");

  return (
    <HomeView
      activeTab={activeTab}
      onChangeTab={setActiveTab}
    />
  );
};

export default HomeController;


