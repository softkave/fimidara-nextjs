---
title: Introduction to fimidara
description: A quick introduction to fimidara and how it works
---

# {% $markdoc.frontmatter.title %}

## What is fimidara?

fimidara is a file storage service for developers, providing access control and other easy-to-use features. fimidara attempts to solve the "rogue link" problem, where a link is accessible to anyone even if they shouldn't have access, cause they have the link, by enforcing access control on files. So, if a file is accessible to someone, it should only be by design. fimidara does this not only for files, but for folders and every other resource in the system. Besides the access control, fimidara also has other features that make it easier to use files in your applications.

## How does fimidara work?

I mentioned earlier that fimidara enforces access control on files, but how does it do that? It does it through agent tokens, permission groups, and permission items.

**Agent tokens** are access tokens created for client user access (like your app's customers), and your program's access (like your server applications). There is a third type of agent token, **user tokens** but you won't have to deal with them. They are used internally by fimidara to issue access tokens to it's own users. Besides agent tokens, a second part of the system is the **permission groups**. These groups permissions that can be assigned to **entities**. Entities or permission entities can be users, agent tokens, or other permission groups. The third part of the system are **permission items**. Permission items can be granted directly to entities or inherited through permissions groups, enabling reuse. There is also a default `public` permission group that's automatically created in every workspace. It's used to grant access to the public.

When API requests are made to fimidara (for example, to read a file), seeing it currently only supports HTTP, it checks the `Authorization` HTTP header for a JWT token, then attempts to decode and verify it. Upon authenticating the request (translating the JWT token to it's referenced agent token), it does an authorization check using the agent token's assigned and inherited permission items. It also appends permission items assigned to the public permission group (remember the public permission group houses permission items controlling access for public requests). If a permission item is found granting access, access is granted to the resource/action, and an error is returned otherwise. Public (that is, unauthenticated) requests follow a similar flow, except there is no JWT token or agent token. Only the public permission group permissions apply to them, and if a permission item is not found granting access, access is denied with an error.

## Usecases

fimidara can be used for the following usecases:

- **Protecting sensitive files** using its fine-grained access control systems.
- **File hosting and image resizing**.

### Protecting sensitive files

fimidara shines combating "Rogue links". "Rouge links" is a completely made up term by the way, but it's a common problem that arises when a resource is accessible to anyone, even if they shouldn't have access, because they have the link. Why is this a problem?

First, **security**. Imagine a web application used to share information and sensitive files in an organization, or to grant access to an e-commerce resource, say an e-book. If a anyone has access to the link referencing a file, and there is no access control guarding against unauthorized access, they can access the file. fimidara provides a guard against this seeing access is strictly by design using a combination of agent tokens, permission groups, and permission items.

### File hosting and image resizing

fimidara can also serve as a CDN/file hosting service. This is useful for hosting files and don't want to serve through your own servers. Simply grant the public permission group access to the file(s)/folder(s) you want to be publicly accessible, and that's it.

fimidara can also double as a image modification service. fimidara currently supports image resizing, and conversion from one format to another.
