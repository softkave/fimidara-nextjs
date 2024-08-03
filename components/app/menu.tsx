import {
  FiFile,
  FiGitPullRequest,
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
import { IRawNavItem } from "../utils/page/side-nav/types.ts";
import { AntDMenuItem } from "../utils/types.ts";

export function getWorkspaceMenu(workspaceId: string) {
  const menuItems: AntDMenuItem[] = [
    {
      key: appWorkspacePaths.folderList(workspaceId),
      label: "Files",
      icon: <FiFile />,
    },
    {
      key: appWorkspacePaths.agentTokenList(workspaceId),
      label: "Agent Tokens",
      icon: <FiKey />,
    },
    {
      key: appWorkspacePaths.permissionGroupList(workspaceId),
      label: "Permission Groups",
      icon: <TbLockAccess />,
    },
    {
      key: appWorkspacePaths.collaboratorList(workspaceId),
      label: "Collaborators",
      icon: <FiUsers />,
    },
    {
      key: appWorkspacePaths.requestList(workspaceId),
      label: "Requests",
      icon: <FiUserPlus />,
    },
    {
      key: appWorkspacePaths.usage(workspaceId),
      label: "Usage",
      icon: <FiVoicemail />,
    },
    {
      key: appWorkspacePaths.updateWorkspaceForm(workspaceId),
      label: "Workspace Settings",
      icon: <FiSettings />,
    },
  ];

  return menuItems;
}

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

export function getUserMenu(workspaceId?: string) {
  const items: AntDMenuItem[] = [
    {
      key: appWorkspacePaths.workspaces,
      label: "Workspaces",
      icon: <MdOutlineWorkOutline />,
      children: workspaceId ? getWorkspaceMenu(workspaceId) : undefined,
    },
    {
      key: appUserPaths.requests,
      label: "Collaboration Requests",
      icon: <FiGitPullRequest />,
    },
    {
      key: appUserPaths.settings,
      label: "User Settings",
      icon: <FiSettings />,
    },
  ];

  return items;
}

export function getUserNavItems(workspaceId?: string) {
  const items: IRawNavItem[] = [
    {
      key: appWorkspacePaths.workspaces,
      href: appWorkspacePaths.workspaces,
      label: "Workspaces",
      icon: <MdOutlineWorkOutline />,
      children: workspaceId ? getWorkspaceNavItems(workspaceId) : undefined,
    },
    {
      key: appUserPaths.requests,
      href: appUserPaths.requests,
      label: "Collaboration Requests",
      icon: <FiGitPullRequest />,
    },
    {
      key: appUserPaths.settings,
      href: appUserPaths.settings,
      label: "User Settings",
      icon: <FiSettings />,
    },
  ];

  return items;
}

export function getInternalMenu() {
  const items: AntDMenuItem[] = [
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
