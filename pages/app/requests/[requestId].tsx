import { GetServerSideProps } from "next";
import UserCollaborationRequest, {
  IUserCollaborationRequestProps,
} from "../../../components/app/requests/UserCollaborationRequest";

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
