---
title: Delete Client Assigned Token Endpoint
description: Delete client assigned token endpoint.
---

# {% $markdoc.frontmatter.title %}
## `/clientAssignedTokens/deleteToken` — `delete`
**Request Parameter Pathnames** — No extra pathnames present

**Request Queries** — No queries present

**Request Headers**
| Field | Type | Required | Description |
| - | - | - | - |
|`Authorization`|`string`|Required|Access token.|
|`Content-Type`|`string`|Required|HTTP JSON request content type.|

**Request Body Type** — `application/json`

`DeleteClientAssignedTokenEndpointParams`
| Field | Type | Required | Description |
| - | - | - | - |
|`tokenId`|`string`|Not required|Resource ID.|
|`onReferenced`|`boolean`|Not required|Whether to perform action on the token used to authorize the API call when performing actions on tokens and a token ID or provided resource ID is not provided.|
|`providedResourceId`|`string`|Not required|Resource ID provided by you.|
|`workspaceId`|`string`|Not required|Workspace ID. Will default to using workspace ID from client and program tokens if not provided.|

**200  —  Response Headers**
| Field | Type | Description |
| - | - | - |
|`Content-Type`|`string`|HTTP JSON response content type.|
|`Content-Length`|`string`|HTTP response content length in bytes.|

**200  —  Response Body Type** — `application/json`

`EmptyEndpointSuccessResult`
| Field | Type | Description |
| - | - | - |

**4XX or 5XX  —  Response Headers**
| Field | Type | Description |
| - | - | - |
|`Content-Type`|`string`|HTTP JSON response content type.|
|`Content-Length`|`string`|HTTP response content length in bytes.|

**4XX or 5XX  —  Response Body Type** — `application/json`

`EndpointErrorResult`
| Field | Type | Description |
| - | - | - |
|`errors`|`array` of `object`|See below for `OperationError`'s object fields. Endpoint call response errors. undefined|

`OperationError`
| Field | Type | Description |
| - | - | - |
|`name`|`string`|Error name.|
|`message`|`string`|Error message.|
|`field`|`string` or `undefined`|Invalid field failing validation when error is ValidationError.|

