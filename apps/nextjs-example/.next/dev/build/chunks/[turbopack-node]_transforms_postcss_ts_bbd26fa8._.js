module.exports = [
"[turbopack-node]/transforms/postcss.ts { CONFIG => \"[project]/apps/nextjs-example/postcss.config.mjs [postcss] (ecmascript)\" } [postcss] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "chunks/12d83_b326af20._.js",
  "chunks/[root-of-the-server]__be0df023._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[turbopack-node]/transforms/postcss.ts { CONFIG => \"[project]/apps/nextjs-example/postcss.config.mjs [postcss] (ecmascript)\" } [postcss] (ecmascript)");
    });
});
}),
];