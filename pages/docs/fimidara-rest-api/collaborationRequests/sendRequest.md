---
title: Add Collaboration Request Endpoint
description: Add collaboration request endpoint.
---

# {% $markdoc.frontmatter.title %}
## `/collaborationRequests/sendRequest` — `post`
**Request Parameter Pathnames** — No extra pathnames present

**Request Queries** — No queries present

**Request Headers**
| Field | Type | Required | Description |
| - | - | - | - |
|`Authorization`|`string`|Required|Access token.|
|`Content-Type`|`string`|Required|HTTP JSON request content type.|

**Request Body Type** — `application/json`

`SendCollaborationRequestEndpointParams`
| Field | Type | Required | Description |
| - | - | - | - |
|`workspaceId`|`string`|Not required|Workspace ID. Will default to using workspace ID from client and program tokens if not provided.|
|`request`|`object`|Not required|See below for `NewCollaborationRequestInput`'s object fields. |

`NewCollaborationRequestInput`
| Field | Type | Required | Description |
| - | - | - | - |
|`recipientEmail`|`string`|Not required|Recipient's email address.|
|`message`|`string`|Not required|Message to recipient.|
|`permissionGroupsOnAccept`|`array` of `object`|Not required|See below for `AssignPermissionGroupInput`'s object fields.  undefined|

`AssignPermissionGroupInput`
| Field | Type | Required | Description |
| - | - | - | - |
|`permissionGroupId`|`string`|Not required|Resource ID.|
|`order`|`number`|Not required||

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

**200  —  Response Headers**
| Field | Type | Description |
| - | - | - |
|`Content-Type`|`string`|HTTP JSON response content type.|
|`Content-Length`|`string`|HTTP response content length in bytes.|

**200  —  Response Body Type** — `application/json`

`SendCollaborationRequestEndpointSuccessResult`
| Field | Type | Description |
| - | - | - |
|`request`|`object`|See below for `CollaborationRequest`'s object fields. |

`CollaborationRequest`
| Field | Type | Description |
| - | - | - |
|`recipientEmail`|`string`|Recipient's email address.|
|`message`|`string`|Message to recipient.|
|`resourceId`|`string`|Resource ID.|
|`createdBy`|`object`|See below for `Agent`'s object fields. |
|`createdAt`|`string`|Date string.|
|`expiresAt`|`undefined` or `iso date string`|Expiration date.|
|`workspaceName`|`string`|Workspace name.|
|`workspaceId`|`string`|Workspace ID.|
|`lastUpdatedBy`|`object`|See below for `Agent`'s object fields. |
|`lastUpdatedAt`|`string`|Date string.|
|`readAt`|`undefined` or `string`|Date string.|
|`statusHistory`|`array` of `object`|See below for `NewCollaborationRequestInput`'s object fields.  undefined|
|`permissionGroupsOnAccept`|`array` of `object`|See below for `AssignPermissionGroupInput`'s object fields.  undefined|

`Agent`
| Field | Type | Description |
| - | - | - |
|`agentId`|`string`|Agent ID.|
|`agentType`|`string`|Agent type|

`NewCollaborationRequestInput`
| Field | Type | Description |
| - | - | - |
|`status`|`string`|Collaboration request status.|
|`date`|`string`|Date string.|

`AssignPermissionGroupInput`
| Field | Type | Description |
| - | - | - |
|`permissionGroupId`|`string`|Resource ID.|
|`order`|`number`||

