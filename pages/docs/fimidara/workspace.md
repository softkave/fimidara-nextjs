---
title: Workspace
description: A quick introduction to workspaces in fimidara
---

# {% $markdoc.frontmatter.title %}

## What is a workspace

A workspace is the root of all resources and operations in Fimidara. You can also think of a workspace as a special (root) folder identified by the rootname. But a workspace is not just for files and folders, it is also a collection of collaborators, agent tokens , permission groups, and other resources. To have others work with you in your workspace, you need to send a collaboration request. You do this by providing their email and Fimidara will send them a request to join your workspace. Should they accept the request, they will be added to your workspace. Another necessary part of the collaboration request process is assigning permission groups that will be assigned to the recipient if the request is accepted. This is needed because everything in Fimidara is permission-based so even if they accept the collaboration request, they will not be able to access your workspace unless they are assigned a permission group that gives them access to your workspace's resources. You can also do this after the request is sent, or assign them permission groups after they accept the request. By default, three permission groups are created for you:

- `public` - for unauthenticated requests, basically, the internet's permission group
- `collaborators` - intended for collaborators
- `admins` - workspace admins

## Files and folder

Seeing Fimidara's main offering is it's file storage service with fine-grained access control, to make it easier to manage files and their permissions, Fimidara offers folders. With folders, you can group together similar files and folders, and then grant access to the whole group. Folders and files in Fimidara are identified by their path which is a slash-separated list of names with the workspace's rootname as the first name and the file or folder's name as the last name.

Another thing of note is that we currently have an individual file limit of `200Mb` but we plan on increasing it in the future of if someone needs it increased urgently. If you do, reach out to `abayomi@softkave.com`.

## Usage records

Fimidara records usage in the following categories:

- `storage` - for files stored in bytes
- `bandwidth-in` - for data transferred into Fimidara in bytes
- `bandwidth-out` - for data transferred out of Fimidara in bytes
- `total` - for total usage in USD

We plan to add more usage categories in the future. Each usage category is reported monthly and is calculated from the 26th of the previous month to the 25th of the current month. For example, the `storage` usage for the month of January is calculated from the 26th of December to the 25th of January. Currently, we don't support billing but it's in the works so we offer a free tier for now. The total usage of the free tier is 5 USD per month. **You can reach out to `abayomi@softkave.com` to request a free tier increase.** Within a reporting month, if you exceed your usage limit, you will be notified via email and your workspace will be locked until the next reporting period. You can also check your usage in the dashboard. Subsequent requests will be dropped and summed up into the `dropped` usage records for the reporting period. You can also check these in the dashboard. So, usage records come in two fulfillment states:

- `fulfilled` - for usage that is within the usage limit and was fulfilled
- `dropped` - for usage outside the usage limit and was dropped
