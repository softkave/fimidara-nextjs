import { cn } from "@/lib/utils";
import { kFooterContact, WebFooterContact } from "./web-footer-contact";
import {
  kFooterLinkGroups,
  WebFooterLinkGroupList,
} from "./web-footer-link-group";

export function WebFooter(props: { className?: string }) {
  return (
    <footer className={cn("bg-gray-100", props.className)}>
      <div className="flex flex-col gap-8 md:max-w-4xl mx-auto">
        <WebFooterLinkGroupList groups={kFooterLinkGroups} />
        <WebFooterContact contact={kFooterContact} />
      </div>
    </footer>
  );
}
