"use client";

import { usePageAuthRequired } from "@/components/hooks/usePageAuthRequired.tsx";
import WaitlistedUsers from "@/components/internal/waitlist/WaitlistedUsers";
import type { NextPage } from "next";

export interface IWaitlistPageProps {}

const WaitlistPage: NextPage<IWaitlistPageProps> = () => {
  return usePageAuthRequired({
    render: () => <WaitlistedUsers />,
  });
};

export default WaitlistPage;
