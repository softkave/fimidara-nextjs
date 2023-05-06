# DD

- components relying on login use useIsUserLoggedIn which itself doesn't fetch user data
- user session init fetch store
- user init fetch hook
- user mutation hooks
  - mutation hooks use useRequest from ahooks
  - useSignupMutationHook...
  - update user session into user session init fetch hook
