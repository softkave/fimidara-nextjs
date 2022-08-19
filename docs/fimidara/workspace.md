# Workspace

## What is a workspace

A workspace is the root of all resources and operations in Fimidara. You can also think of a workspace as a special (root) folder identified by the rootname. But a workspace is not just for files and folders, it is also a collection of collaborators, tokens (program access and client assigned), permission groups, and other resources. To have others work with you in your workspace, you need to send a collaboration request. You do this by providing their email and Fimidara will send them a request to join your workspace. Should they accept the request, they will be added to your workspace. Another necessary part of the collaboration request process is assigning permission groups that will be assigned to the recipient if the request is accepted. This is needed because everything in Fimidara is permission-based so even if they accept the collaboration request, they will not be able to access your workspace unless they are assigned a permission group that gives them access to your workspace's resources. You can also do this after the request is sent, or assign them permission groups after they accept the request. By default, three permission groups are created for you:

- `public` - for unauthenticated requests, basically, the internet's permission group
- `collaborators` - intended for collaborators
- `admins` - workspace admins
