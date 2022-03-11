import { GetServerSideProps } from "next";

export interface IOrgComponentProps {
  orgId: string;
}

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
