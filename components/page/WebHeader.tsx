import { Typography } from "antd";
import Link from "next/link";

export default function WebHeader() {
  return (
    <div>
      <Link href="/">
        <Typography.Title level={5}>Shops</Typography.Title>
      </Link>
    </div>
  );
}
