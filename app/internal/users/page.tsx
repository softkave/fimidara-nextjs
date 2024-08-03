"use client";

import { usePageAuthRequired } from "@/components/hooks/usePageAuthRequired.tsx";
import FimidaraUsers from "@/components/internal/users/FimidaraUsers";
import type { NextPage } from "next";

export interface IUsersPageProps {}

const UsersPage: NextPage<IUsersPageProps> = () => {
  return usePageAuthRequired({
    render: () => <FimidaraUsers />,
  });
};

export default UsersPage;
