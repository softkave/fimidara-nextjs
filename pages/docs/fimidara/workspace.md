---
title: Workspace
description: A quick introduction to workspaces in fimidara
---

# {% $markdoc.frontmatter.title %}

## What is a workspace?

The workspace is the root of all resources and operations in fimidara. You can also think of a workspace as a special (root) folder identified by the workspace **rootname**. It isn't just for files and folders though, it is also a collection of collaborators, agent tokens, permission groups, and other resources. Besides being a collection, it also facilitates collaboration. In a workspace, you can send invites to others to collaborate with you. Should they accept your invitation, you can then assign them permissions or permission groups as needed. A necessary part of the collaboration request/invitation process is assigning permissions to the invitee on accepting the request. This is needed because everything in fimidara is permission-based so even if they accept the invitation, they will not be able to access your workspace besides reading the details of the workspace. By default, three permission groups are automatically created upon creating a workspace:

- `public` - for unauthenticated requests, basically, everyone on the internet. Starts with no permissions, so, to allow public read of a file, you'll have to grant it read permission to said file.
- `collaborator` - intended for collaborators who've accepted your collaboration request. Comes with mostly read permissions, and the ability to create, read, and update folders and files, but not delete them.
- `admin` - workspace admins. This is the permission automatically assigned to the workspace creator, and it allows access to every resource in the workspace.

## Files and folder

Seeing fimidara's main offering is it's file storage service with fine-grained access control, to make it easier to manage said files and their permissions, fimidara offers **folders**. With folders, you can group together similar files and other folders, and grant/deny access to the whole. Folders and files in fimidara are identified by their path which is a unique, slash-separated list of names with the workspace's rootname coming first, then the folder names, then lastly the file name. Example, `/workspace-rootname/web/images/funny-image.png`.

Another thing of note is that we currently have an individual file limit of `200Mb` which we plan to in the future increase. If you do need a large file limit, please reach out to `abayomi@softkave.com`.

## Usage records

fimidara is a paid service, following the pay-for-what-you-use model. So, fimidara records usage in the following categories:

- `storage` - for files stored, in bytes.
- `bandwidth-in` - for data transferred into fimidara, in bytes.
- `bandwidth-out` - for data transferred out of fimidara, in bytes.
- `total` - for total usage, in USD,

We would add other categories in the future, but these are currently sufficient. **Each usage category is reported monthly and is calculated from the 26th of the previous month to the 25th of the current month**. For example, the `storage` usage for the month of January is calculated from the 26th of December to the 25th of January.

Though fimidara is a paid service, but due to the scale of the features needed and our engineering capacity, we have not built the billing system. Meaning, fimidara currently only offers the free tier, for now. The total usage of the free tier is 30 USD per workspace per month. 30 USD per workspace is ample though. With it, you can store upto 600Gb of storage, or upto 200Gb of bandwidth in and out, in a month. **But should you need an increase to the free tier, you can reach out to `abayomi@softkave.com`.** Within a reporting month, if you exceed your usage limit, you will be notified via email and your workspace will be locked until the next reporting period, to avoid overcharge when we eventually implement billing. You can also check your usage in the dashboard. For locked workspaces, subsequent requests will be dropped and summed up into the `dropped` usage record group for the reporting period. You can also check these in the dashboard. Usage records come in two fulfillment states:

- `fulfilled` - for usage that is within the usage limit and was fulfilled.
- `dropped` - for usage outside the usage limit and was dropped.

**Regarding billing, upon launch, we guarantee that it would be cheaper than AWS S3 and similar file backend offerings.**
