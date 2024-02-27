import UserCollaborationRequestList from "@/components/app/requests/UserCollaborationRequestList";
import withPageAuthRequiredHOC from "@/components/hoc/withPageAuthRequired";

function UserCollaborationRequestsPage() {
  return <UserCollaborationRequestList />;
}

export default withPageAuthRequiredHOC(UserCollaborationRequestsPage);
