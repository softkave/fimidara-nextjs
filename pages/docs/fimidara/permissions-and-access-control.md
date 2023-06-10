---
title: Permissions and Access Controls
description: A quick introduction to permissions and access control in fimidara
---

# {% $markdoc.frontmatter.title %}

## Permission items

The equivalent of an atom or the cell for fimidara's access control system is the **permission item**. A permission item grants or denies access to a single resource or a resource class (like all files within a folder). Permission items is made up of 5 parts:

- **The permission entity**. This is the resource granted or denied access. This can be a user, an agent token, or a permission group.
- **The permission item target**. This is the resource a permission item effects upon or effects from. For example, a permission item can grant or deny access to a file (i.e effects upon), or to all files in a folder (i.e effects from).
- **The action**. This is the action permitted or denied by the permission item. There currently 5 action types:
  - `create` - for creating a resource
  - `read` - for reading a resource
  - `update` - for mutating a resource
  - `delete` - for deleting a resource
  - `grant-permission` - for granting permissions. Only entities with this permission can grant/deny permission to other entities.
- **The access result**. Indicates whether access is granted or denied.
- Lastly, **the permission applies to**. It indicates whether the permission applies to the target, the target and it's children resources, or only the target's children resources. That is, using a permission item, you can:
  - grant read access to a single folder, allowing an entity to read the details of the folder but not it's children folder.
  - grant read access to the folder and it's children folder, allowing an entity to with one permission read both.
  - or grant delete access to only the children folders, allowing an entity to delete the children folders but not the parent folder.
