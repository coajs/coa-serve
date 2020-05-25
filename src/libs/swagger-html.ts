import { env } from 'coa-env'

export default (base: string, sep: string, urls: object[]) => `
<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <title>接口文档</title>
    <link rel="icon" type="image/png" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@3.25.4/favicon-32x32.png" sizes="32x32"/>
    <link rel="icon" type="image/png" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@3.25.4/favicon-16x16.png" sizes="16x16"/>
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@3.25.4/swagger-ui.css">
    <style>
        html {
            box-sizing: border-box;
            overflow: -moz-scrollbars-vertical;
            overflow-y: scroll;
            font-size: 14px;
        }

        *,
        *:before,
        *:after {
            box-sizing: inherit;
        }

        body {
            margin: 0;
            background: #fafafa;
        }

        /* 下面是自定义 */

        /* 页面最大宽度 */
        .swagger-container .wrapper {
            max-width: 1080px;
        }
        
        /* 底部距离 */
        .swagger-container {
            margin-bottom: 100px;
        }

        /* 顶部描述文字隐藏，宽度限定 */
        .swagger-ui .topbar .download-url-wrapper .select-label > span {
            visibility: hidden;
            flex: 5;
        }
        
        /* 顶部选择框字体 */
        .swagger-ui .topbar .download-url-wrapper .select-label select {
            font-size: 12px;
        }
        
        /* 大标题下链接字体 */
        .swagger-ui .info .link .url {
            font-size: 12px;
        }
        
        /* 头部上下间距 */
        .swagger-ui .info {
            margin: 35px 0;
        }
        
        /* https大框上下间距 */
        .swagger-ui .scheme-container {
            padding: 20px 0;
        }
        
        /* servers标题隐藏 */
        .swagger-ui .servers-title {
            display: none;
        }

        /* servers框对齐 */
        .swagger-ui .scheme-container .schemes {
            align-items: center;
        }
        
        /* 隐藏地址第一个字母 */
        .swagger-ui .opblock-summary .opblock-summary-path a:first-letter ,.swagger-ui .opblock-summary .opblock-summary-path__deprecated a:first-letter{
            font-size: ${sep === '/' ? 'inherit' : 0};
        }
              
        /* 接口标题上下间距 */
        .swagger-ui .opblock-tag {
            padding: 5px 20px 5px 10px;
            margin-bottom: 0;
        }
        
        /* 接口标题上下间距 */
        .opblock-tag-section > div {
            margin-top: 15px !important;
        }
        
        /* 大标题字体 */
        .swagger-ui .info .title {
            font-size: 28px;
        }

        /* 大标题描述字体 */
        .swagger-ui .info .description p, .swagger-ui .info .link {
            font-size: 15px;
        }
        
        /* 接口标题字体 */
        .swagger-ui .opblock .opblock-summary-method, .swagger-ui .opblock .opblock-summary-path,.swagger-ui .opblock .opblock-summary-path__deprecated, .swagger-ui .opblock .opblock-summary-description {
            font-size: 14px;
        }

        /* 模块标题字体 */
        .swagger-ui .opblock-tag, .swagger-ui .opblock-tag small {
            font-size: 16px;
        }
        
        /* 参数字体 */
        .swagger-ui .parameters-col_description {
            font-size: 13px;
        }
        
        /* 隐藏response栏 */
        .swagger-ui .response-controls{
            display: none;
        }
        
        /* response栏不显示curl框 */
        .swagger-ui .responses-inner > div > div > div:first-child {
            display: none;
        }
        
        /* response栏默认显示 */
        .swagger-ui .response-col_description {
            font-size: 12px;
        }
        
        /* 修复response栏对齐 */
        .swagger-ui table tbody tr td{
            padding: inherit;
        }
        
        /* 修复response的links对齐 */
        .swagger-ui .response-col_links{
            padding-top: 10px;
        }

    </style>
</head>
<body>
<div id="swagger-ui"></div>
<script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@3.25.4/swagger-ui-bundle.js"></script>
<script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@3.25.4/swagger-ui-standalone-preset.js"></script>
<script>
    window.onload = function () {

        window.ui = SwaggerUIBundle({

            urls: ${JSON.stringify(urls)},

            dom_id: '#swagger-ui',

            deepLinking: true,
            
            filter: ${env.docs.filter},

            validatorUrl: null,

            docExpansion: '${env.docs.expansion}',

            defaultModelsExpandDepth: 10,
            defaultModelExpandDepth : 10,
            displayRequestDuration  : true,

            presets: [
                SwaggerUIBundle.presets.apis,
                SwaggerUIStandalonePreset,
            ],
            plugins: [
                SwaggerUIBundle.plugins.DownloadUrl,
            ],
            layout : 'StandaloneLayout',
        });
    };
</script>
</body>
</html>
`
