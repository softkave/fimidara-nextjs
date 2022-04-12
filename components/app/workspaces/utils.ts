import { GetServerSideProps } from "next";

export type IWorkspaceComponentProps = {
  workspaceId: string;
};

export const getWorkspaceServerSideProps: GetServerSideProps<
  IWorkspaceComponentProps,
  { workspaceId: string }
> = async (context) => {
  return {
    props: {
      workspaceId: context.params!.workspaceId,
    },
  };
};
