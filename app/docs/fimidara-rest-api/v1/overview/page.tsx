"use client";

import RestApiIndex from "@/components/docs/RestApiIndex";
import { NextPage } from "next";

interface FimidaraRestApiIndexDocPageProps {}

const FimidaraRestApiIndexDocPage: NextPage<
  FimidaraRestApiIndexDocPageProps
> = (props) => {
  return <RestApiIndex />;
};

export default FimidaraRestApiIndexDocPage;
