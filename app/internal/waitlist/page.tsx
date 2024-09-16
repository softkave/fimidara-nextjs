"use client";

import WaitlistedUsers from "@/components/internal/waitlist/WaitlistedUsers";
import type { NextPage } from "next";

export interface IWaitlistPageProps {}

const WaitlistPage: NextPage<IWaitlistPageProps> = () => {
  return <WaitlistedUsers />;
};

export default WaitlistPage;
