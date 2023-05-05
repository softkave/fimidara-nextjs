import UserCollaborationRequest, {
  IUserCollaborationRequestProps,
} from "@/components/app/requests/UserCollaborationRequest";
import { GetServerSideProps } from "next";

export default UserCollaborationRequest;

export const getServerSideProps: GetServerSideProps<
  IUserCollaborationRequestProps,
  { requestId: string }
> = async (context) => {
  const params = context.params || {};
  return {
    props: {
      requestId: context.params!.requestId,
    },
  };
};
