# TODOs

## Now

- [ ] entity assigned permission groups fetch hooks, resolve permissions fetch hooks
- [ ] a refresh system that doesn't show loading screen but notification or inline loading for resource and list
- [ ] write tests for fetch hooks and stores
- [ ] strip data passed to api not part of api def using yup generated?
- [ ] check if user is logged-in and route if in outside routes
- [ ] integrate forgot password into settings when changing password with forgot password instead of routing to outside
- [ ] handle overflow in AppTabs
- [ ] issue with verify email and existing saved token, there'll be same issue with change password with token
- [ ] include last updated by and at in resource pages
- [ ] use shaded page empty for all errors and loading
- [ ] fetch list and count in parallel
- [ ] resource list store last op, and deleted ids, for faster cascade for subscribers removing from fetch stores
- [ ] surface description of or combination types
- [ ] icons for all menus
- [ ] fire and forget with updates when uploading file
- [ ] overlay collaborators without permissions
- [ ] permissions
- [ ] waitlist
- [ ] hide agent token jwt and reveal it
- [ ] error field replacement for update form
- [ ] show actions only if user has permissions

## Later

- [ ] increase SEO
- [ ] Virtualized list for folders and files
- [ ] use new FormAlert and errorMessageNotification functions
- [ ] auto route to app when logged in
- [ ] Multiselect and batch actions in lists like agent tokens
- [ ] Test that people who shouldn't have access can't access the permission groups, also that they can't do what they shouldn't be able to, like removing an admin
- [ ] Add more information to all the pages and lists
- [ ] Call mutate to invalidate lists when item is updated
- [ ] Group and better render permission items
- [ ] Icons
- [ ] Better max file size where you select type and enter number
- [ ] File and folder breadcrumbs
- [ ] Ensure mutations are called after updates
- [ ] remove revalidate on focus for all swr hooks for and look for an alternative
- [ ] animations on mount
- [ ] better way to revalidate data
- [ ] uploaded file size is too big and user avatar is not updated
- [ ] Implement scaling down images
