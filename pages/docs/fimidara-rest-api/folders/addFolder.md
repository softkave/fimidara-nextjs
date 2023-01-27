---
title: Add Folder Endpoint
description: Add folder endpoint.
---

# {% $markdoc.frontmatter.title %}
## `/folders/addFolder` — `post`
**Request Parameter Pathnames** — No extra pathnames present

**Request Queries** — No queries present

**Request Headers**
| Field | Type | Required | Description |
| - | - | - | - |
|`Authorization`|`string`|Required|Access token.|
|`Content-Type`|`string`|Required|HTTP JSON request content type.|

**Request Body Type** — `application/json`

`AddFolderEndpointParams`
| Field | Type | Required | Description |
| - | - | - | - |
|`folder`|`object`|Not required|See below for `NewFolderInput`'s object fields. |

`NewFolderInput`
| Field | Type | Required | Description |
| - | - | - | - |
|`description`|`string`|Not required|Description|
|`folderpath`|`string`|Required|Folder path.|
|`publicAccessOps`|`array` of `object`|Not required|See below for `PublicAccessOpInput`'s object fields.  undefined|

`PublicAccessOpInput`
| Field | Type | Required | Description |
| - | - | - | - |
|`action`|`string`|Required|Action|
|`resourceType`|`string`|Required|Resource type this public access permission applies.|
|`appliesTo`|`string`|Required|Whether this permission applies to both the containing folder and it's children, just the container, or just the children.|

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

`AddFolderEndpointSuccessResult`
| Field | Type | Description |
| - | - | - |
|`folder`|`object`|See below for `Folder`'s object fields. |

`Folder`
| Field | Type | Description |
| - | - | - |
|`resourceId`|`string`||
|`createdBy`|`object`|See below for `Agent`'s object fields. |
|`createdAt`|`string`|Date string.|
|`lastUpdatedBy`|`object`|See below for `Agent`'s object fields. |
|`lastUpdatedAt`|`string`|Date string.|
|`name`|`string`|Name|
|`description`|`undefined` or `string`|Description|
|`workspaceId`|`string`|Workspace ID.|
|`idPath`|`array` of `string`|List of parent folder IDs. Folder ID.|
|`namePath`|`array` of `string`|List of parent folder names. Folder name.|
|`parentId`|`undefined` or `string`|Folder ID.|

`Agent`
| Field | Type | Description |
| - | - | - |
|`agentId`|`string`|Agent ID.|
|`agentType`|`string`|Agent type|

