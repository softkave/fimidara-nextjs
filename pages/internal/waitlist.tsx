import WaitlistedUsers from "@/components/app/waitlist/WaitlistedUsers";
import withPageAuthRequiredHOC from "@/components/hoc/withPageAuthRequired";
import type { NextPage } from "next";

export interface IWaitlistPageProps {}

const WaitlistPage: NextPage<IWaitlistPageProps> = () => {
  return <WaitlistedUsers />;
};

export default withPageAuthRequiredHOC(WaitlistPage);
