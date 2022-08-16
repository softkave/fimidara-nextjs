# Introduction to Fimidara

## What is Fimidara?

Fimidara is a file storage service for developers, with access control and other ease-of-use features. Fimidara attempts to solve the "rogue link" problem (where a link is accessible to anyone even if they shouldn't have access, cause they have the link, more on this later) by enforcing access control on files. So, if a file is accessible to anyone, it should only be so because it is public. Fimidara does this not only for files, but for folders, and every other resource in the system. Besides the access control, Fimidara also has other features that make it easier to use files in your applications.

## How does Fimidara work?

I mentioned earlier that Fimidara enforces access control on files, but how does it do that? It does it through tokens, permission groups, and permission items.

In Fimidara, there are 2 types of tokens:

- **Program Access tokens**: These are tokens meant for server-side use. These tokens are used to grant access to the Fimidara to a program.
- **Client Assigned tokens**: These are tokens meant for client-side use. These tokens are used to grant access to the Fimidara to a browser or mobile app.

There is a third type of token: **User tokens** but you won't have to deal with them.

Besides the tokens, a second part of the system is the permission groups. These are groups of permissions that can be assigned to entities. Entities can be users, tokens (both program and client), or permission groups themselves. Permissions can be granted to entities directly, but granting them to permission groups allow you to reuse permissions across entities. There is also a default `public` permission group that is automatically created in every workspace, it's used to grant access to the public. Permission groups assigned to entities carry weight which is used to determine the order in which permissions are evaluated. The higher the weight, the higher the priority. So,if a permission in a permission group denies access to a resource, but another permission in a permission group with a higher weight grants access, the access is granted.

With these two in place, API calls made to Fimidara should include the client's token for authentication and authorization. Seeing we only currently support HTTP, this is done by including the token in the `Authorization` header. Including tokens in requests is not required, and in some cases not feasible, for example, when using Fimidara as a CDN and a client is accessing public files. Fimidara handles requests like so:

- Fimidara decodes the token in the request if one's present and checks if it's valid.
- Fimidara makes a list of all the permissions that the token has (either granted directly or through permission groups). This list will also include the permissions the `public` permission group has. The list is sorted by the weight of the permission groups. The permissions granted to the token itself carry higher weight than the permissions granted to permission groups.
- Fimidara evaluates the permissions in the list against the resource that the request is trying to access to determine if access is granted.
- If access is granted, Fimidara carries out the request. If access is denied, Fimidara returns a 403 Forbidden response.

That in a nutshell is how Fimidara works.

## Usecases

Fimidara can be used for the following usecases:

- **Protecting sensitive files**: Fimidara is used to protect sensitive data.
- **File hosting**: Fimidara can be used as a CDN/file hosting service.

### Protecting sensitive files

Fimidara is useful in combating "Rogue Links" and similar problems. "Rouge Links" is a completely made up term by the way, but it's a common problem that arises when a resource is accessible to anyone, even if they shouldn't have access, because they have the link. Why is this a problem?

First, **security**. Imagine a web application used to share information and sensitive files in an organization. If a anyone has access to the link referencing a file, and there is no access control guarding against unauthorized access, anyone can access the file. Fimidara solves this by requiring tokens with access to the resource for access to be granted when accessing non-public resources.

Another reason is that "rogue links" can lead to lost revenue. Imagine you run a eCommerce site that sells eBooks. If someone buys the product, and you provide them a link to download the eBook, if the link is not protected by access-control, if the link is shared with someone else, they can access the eBook without having to purchase it. With Fimidara, you can protect the link by only granting access to the eBook to the users (client assigned tokens) who have purchased the eBook.

### File hosting

Fimidara can be used as a CDN/file hosting service. This is useful when you want to host files and don't want to host them on your own server. If the files are to be public, you will have to grant access to the files to the `public` permission group.

## Other features

Besides access control, Fimidara has other features that make it easier to use files in your applications, including:

- Resizing images: Fimidara can resize images to a specified width and height.
