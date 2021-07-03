[![Netlify Status](https://api.netlify.com/api/v1/badges/81eeb153-4ab3-410e-a6ca-0613ce6d4c3b/deploy-status)](https://app.netlify.com/sites/bgever/deploys)

# Bart Verkoeijen’s blog (bgever.com)

## License

All content by Bart Verkoeijen and under [Creative Commons][content-license] and code under MIT license.

[content-license]: http://creativecommons.org/licenses/by-nc-sa/4.0/

> MIT License
>
> Copyright (c) 2021 Bart Verkoeijen  
> Copyright (c) 2018 Dan Urbanowicz
>
> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all
> copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
> SOFTWARE.

## Local development

### 1. Clone this repository

```
git clone https://github.com/danurbanowicz/eleventy-netlify-boilerplate.git my-blog-name
```

### 2. Navigate to the directory

```
cd my-blog-name
```

Specifically have a look at `.eleventy.js` to see if you want to configure any Eleventy options differently.

### 3. Install dependencies locally

```
npm install @11ty/eleventy
```

### 4. Edit _data/metadata.json

This file contains your site title and author details, and can be used to store any other commonly used site data.

### 5. Run Eleventy (builds the site)

```
npx @11ty/eleventy
```

Or build automatically when a template changes:
```
npx @11ty/eleventy --watch
```

Or build and host locally for local development:
```
npx @11ty/eleventy --serve
```

Or in debug mode:
```
DEBUG=* npx @11ty/eleventy
```

## Template reference

This repo builds upon Dan Urbanowicz’s excellent template:
https://github.com/danurbanowicz/eleventy-netlify-boilerplate
