import { SimpleGrid, Stack } from "@mantine/core";
import Link from "next/link";
import DashboardNav from "../../../../components/navbar/dashboardNav";
import DomainList from "../../../../components/setting/domainList";
import Theme from "../../../../components/setting/theme";
import { SiteSetting } from "../../../../components/setting/SiteSetting";
import { SiteData } from "../../../../components/setting/siteData";

const Setting = () => {
  return (
    <>
      <SiteData />
      <SiteSetting />
      <Theme />
      <DomainList />
    </>
  );
};

const SettingsWrapper = () => (
  <DashboardNav>
    <Setting />
  </DashboardNav>
);
export default SettingsWrapper;
