"use client";

import FimidaraUsers from "@/components/internal/users/FimidaraUsers";
import type { NextPage } from "next";

export interface IUsersPageProps {}

const UsersPage: NextPage<IUsersPageProps> = () => {
  return <FimidaraUsers />;
};

export default UsersPage;
