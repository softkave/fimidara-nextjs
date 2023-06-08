---
title: Permissions and Access Controls
description: A quick introduction to permissions and access control in fimidara
---

# {% $markdoc.frontmatter.title %}

The equivalent of an atom or the cell for Fimidara's access control system is the permission item. A permission item is a permission entity's permission to access a resource or resource type. A permission item is made up of five parts:

- The permission entity - this is resource that is being granted access to a resource or resource type. This can be a user, a agent token, or a permission group. A permission group is a collection of permission entities. A permission group can be assigned to a permission entity.
- The permission item container - this is the resource that owns the permission item. This can be a workspace, or a folder. If the permission container is a workspace, the permission item applies to all resources in the workspace. If the permission container is a folder, the permission item applies to all resources in the folder and its subfolders.
- The resource type and resource ID (optional) - this is the resource or resource type that the permission entity is being granted access to. If only the resource type is specified, the permission item applies to all resources of that type. If the resource ID is specified, the permission item applies to the resource with the specified ID.
- The action - this is the action permitted or denied by the permission item. There currently five types of actions:
  - `create` - for creating a resource or resource type
  - `read` - for reading a resource or resource type
  - `update` - for updating a resource or resource type
  - `delete` - for deleting a resource or resource type
  - `grant-permission` - for granting permission to a resource or resource type. Only entities with this permission can grant permission to other entities.
- A field indicating whether the permission item is allowed or denied

To grant permission to a resource, click on the menu button on the resource and select `Grant permission`. This will open a dialog where you can select the permission entity you will like to grant access to.
