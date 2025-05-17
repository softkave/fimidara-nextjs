import { cn } from "@/lib/utils";

export function WebFeatureItem(props: {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 p-4 rounded-lg bg-white border border-gray-200",
        props.className
      )}
    >
      <div className="flex items-center gap-2 text-muted-foreground">
        {props.icon}
      </div>
      <h3 className="text-md font-bold">{props.title}</h3>
      <p className="text-sm text-muted-foreground">{props.description}</p>
    </div>
  );
}
