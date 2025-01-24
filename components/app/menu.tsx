import { kAppInternalPaths } from "@/lib/definitions/paths/internal.ts";
import { kAppUserPaths } from "@/lib/definitions/paths/user.ts";
import { kAppWorkspacePaths } from "@/lib/definitions/paths/workspace.ts";
import { Computer, GitPullRequestArrow, UserCog } from "lucide-react";
import {
  FiFile,
  FiKey,
  FiSettings,
  FiUserPlus,
  FiUsers,
  FiVoicemail,
} from "react-icons/fi";
import { MdOutlineWorkOutline } from "react-icons/md";
import { TbLockAccess } from "react-icons/tb";
import { IRawNavItem } from "../utils/page/side-nav/types.ts";

export function getWorkspaceNavItems(workspaceId: string) {
  const menuItems: IRawNavItem[] = [
    {
      key: kAppWorkspacePaths.folderList(workspaceId),
      href: kAppWorkspacePaths.folderList(workspaceId),
      label: "Files",
      icon: <FiFile />,
    },
    {
      key: kAppWorkspacePaths.agentTokenList(workspaceId),
      href: kAppWorkspacePaths.agentTokenList(workspaceId),
      label: "Agent Tokens",
      icon: <FiKey />,
    },
    {
      key: kAppWorkspacePaths.permissionGroupList(workspaceId),
      href: kAppWorkspacePaths.permissionGroupList(workspaceId),
      label: "Permission Groups",
      icon: <TbLockAccess />,
    },
    {
      key: kAppWorkspacePaths.collaboratorList(workspaceId),
      href: kAppWorkspacePaths.collaboratorList(workspaceId),
      label: "Collaborators",
      icon: <FiUsers />,
    },
    {
      key: kAppWorkspacePaths.requestList(workspaceId),
      href: kAppWorkspacePaths.requestList(workspaceId),
      label: "Requests",
      icon: <FiUserPlus />,
    },
    {
      key: kAppWorkspacePaths.usage(workspaceId),
      href: kAppWorkspacePaths.usage(workspaceId),
      label: "Usage",
      icon: <FiVoicemail />,
    },
    {
      key: kAppWorkspacePaths.updateWorkspaceForm(workspaceId),
      href: kAppWorkspacePaths.updateWorkspaceForm(workspaceId),
      label: "Workspace Settings",
      icon: <FiSettings />,
    },
  ];

  return menuItems;
}

export function getUserNavItems(workspaceId?: string) {
  const userItems: IRawNavItem[] = [
    {
      key: kAppUserPaths.requests,
      href: kAppUserPaths.requests,
      label: "Collaboration Requests",
      icon: <GitPullRequestArrow className="w-4 h-4" />,
    },
    {
      key: kAppUserPaths.settings,
      href: kAppUserPaths.settings,
      label: "User Settings",
      icon: <UserCog className="w-4 h-4" />,
    },
  ];

  if (workspaceId) {
    const items: IRawNavItem[] = [
      ...getWorkspaceNavItems(workspaceId),
      { isDivider: true, key: "divider-workspace", label: "" },
      ...userItems,
    ];

    return items;
  }

  return [
    {
      key: kAppWorkspacePaths.workspaces,
      href: kAppWorkspacePaths.workspaces,
      label: "Workspaces",
      icon: <Computer className="w-4 h-4" />,
    },
    ...userItems,
  ];
}

export function getInternalNavItems() {
  const items: IRawNavItem[] = [
    {
      key: kAppInternalPaths.waitlist,
      href: kAppInternalPaths.waitlist,
      label: "Waitlist",
      icon: <FiUserPlus />,
    },
    {
      key: kAppInternalPaths.users,
      href: kAppInternalPaths.users,
      label: "Users",
      icon: <FiUsers />,
    },
    {
      key: kAppInternalPaths.workspaces,
      href: kAppInternalPaths.workspaces,
      label: "Workspaces",
      icon: <MdOutlineWorkOutline />,
    },
  ];

  return items;
}
