---
title: Files
description: Files REST API
---

# {% $markdoc.frontmatter.title %}

## uploadFile

## updateFile

## getFile

```
export interface IImageTransformationParams {
  width?: number;
  height?: number;
}

export interface IGetFileEndpointParams extends IFileMatcher {
  imageTranformation?: IImageTransformationParams;
}

export interface IGetFileEndpointResult {
  stream: NodeJS.ReadableStream;
  mimetype?: string;
  contentLength?: number;
}
```

## getFileDetails

## deleteFile

Method - POST
Request Body

```
{
  filepath?: string;
  fileId?: string;
}
```
