# DD

## Resource deletion effect on single, paginated, and list fetch stores

- Keep a field for the last remove call, and subscribers to the field should fire immediately. Then use maps for paginated and non-paginated lists in place of array for idList, then just remove using the last remove field on resource list stores.
- Not going to perform any extra compute for single resource fetch store because it should fetch data again which should return not found. Issue could be since server schedules for deletion and doesn't actually delete on call, fetching again could return resource, for single resource, but if server marks deleted as I've added to TODOs and bars operation on items marked deleted, it should be okay.

## Add mutation state changes

- Add resource to list store
- Find params using comparisonFn taking resource, params, state
  - Update state using params, adding the id to the beginning
