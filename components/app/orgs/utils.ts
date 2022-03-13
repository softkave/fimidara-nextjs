import { GetServerSideProps } from "next";

export type IOrgComponentProps = {
  orgId: string;
};

export const getOrgServerSideProps: GetServerSideProps<
  IOrgComponentProps,
  { orgId: string }
> = async (context) => {
  return {
    props: {
      orgId: context.params!.orgId,
    },
  };
};
