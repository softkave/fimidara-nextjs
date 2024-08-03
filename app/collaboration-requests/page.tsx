"use client";

import UserCollaborationRequestList from "@/components/app/requests/UserCollaborationRequestList";
import { usePageAuthRequired } from "@/components/hooks/usePageAuthRequired.tsx";

function UserCollaborationRequestsPage() {
  return usePageAuthRequired({
    render: () => <UserCollaborationRequestList />,
  });
}

export default UserCollaborationRequestsPage;
