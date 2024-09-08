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
import {
  appInternalPaths,
  appUserPaths,
  appWorkspacePaths,
} from "../../lib/definitions/system";
import { IRawNavItem, ISomeNavItem } from "../utils/page/side-nav/types.ts";

export function getWorkspaceNavItems(workspaceId: string) {
  const menuItems: IRawNavItem[] = [
    {
      key: appWorkspacePaths.folderList(workspaceId),
      href: appWorkspacePaths.folderList(workspaceId),
      label: "Files",
      icon: <FiFile />,
    },
    {
      key: appWorkspacePaths.agentTokenList(workspaceId),
      href: appWorkspacePaths.agentTokenList(workspaceId),
      label: "Agent Tokens",
      icon: <FiKey />,
    },
    {
      key: appWorkspacePaths.permissionGroupList(workspaceId),
      href: appWorkspacePaths.permissionGroupList(workspaceId),
      label: "Permission Groups",
      icon: <TbLockAccess />,
    },
    {
      key: appWorkspacePaths.collaboratorList(workspaceId),
      href: appWorkspacePaths.collaboratorList(workspaceId),
      label: "Collaborators",
      icon: <FiUsers />,
    },
    {
      key: appWorkspacePaths.requestList(workspaceId),
      href: appWorkspacePaths.requestList(workspaceId),
      label: "Requests",
      icon: <FiUserPlus />,
    },
    {
      key: appWorkspacePaths.usage(workspaceId),
      href: appWorkspacePaths.usage(workspaceId),
      label: "Usage",
      icon: <FiVoicemail />,
    },
    {
      key: appWorkspacePaths.updateWorkspaceForm(workspaceId),
      href: appWorkspacePaths.updateWorkspaceForm(workspaceId),
      label: "Workspace Settings",
      icon: <FiSettings />,
    },
  ];

  return menuItems;
}

export function getUserNavItems(workspaceId?: string) {
  const items: IRawNavItem[] = [
    {
      key: appWorkspacePaths.workspaces,
      href: appWorkspacePaths.workspaces,
      label: "Workspaces",
      icon: <Computer className="w-4 h-4" />,
      children: workspaceId ? getWorkspaceNavItems(workspaceId) : undefined,
    },
    {
      key: appUserPaths.requests,
      href: appUserPaths.requests,
      label: "Collaboration Requests",
      icon: <GitPullRequestArrow className="w-4 h-4" />,
    },
    {
      key: appUserPaths.settings,
      href: appUserPaths.settings,
      label: "User Settings",
      icon: <UserCog className="w-4 h-4" />,
    },
  ];

  return items;
}

export function getInternalMenu() {
  const items: ISomeNavItem[] = [
    {
      key: appInternalPaths.waitlist,
      label: "Waitlist",
      icon: <FiUserPlus />,
    },
    {
      key: appInternalPaths.users,
      label: "Users",
      icon: <FiUsers />,
    },
    {
      key: appInternalPaths.workspaces,
      label: "Workspaces",
      icon: <MdOutlineWorkOutline />,
    },
  ];

  return items;
}

export function getInternalNavItems() {
  const items: IRawNavItem[] = [
    {
      key: appInternalPaths.waitlist,
      href: appInternalPaths.waitlist,
      label: "Waitlist",
      icon: <FiUserPlus />,
    },
    {
      key: appInternalPaths.users,
      href: appInternalPaths.users,
      label: "Users",
      icon: <FiUsers />,
    },
    {
      key: appInternalPaths.workspaces,
      href: appInternalPaths.workspaces,
      label: "Workspaces",
      icon: <MdOutlineWorkOutline />,
    },
  ];

  return items;
}
