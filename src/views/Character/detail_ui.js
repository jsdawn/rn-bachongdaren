// 角色详情 style  注：同步 detail.html css
export const detailHtmlStyle = () => {
  return `
    <style type="text/css">
      html,
      body {
        overflow-x: hidden;
        font-size: 14px;
        color: #333;
        margin: 0;
        padding: 0;
      }
      * {
        box-sizing: border-box;
      }
      ul,
      li {
        list-style: none;
        padding: 0;
      }

      /* 表格 */
      .detail_body table {
        border-collapse: separate;
        border-spacing: 0;
        table-layout: fixed;
        min-width: 100%;
        width: 100%;
        overflow: hidden;
        background: #f5f5f5;
        border-color: #e0dad3;
        border-top: 1px solid #e0dad3;
        border-left: 1px solid #e0dad3;
      }

      .detail_body table th,
      .detail_body table td {
        min-width: 150px;
      }
      .detail_body table td,
      .detail_body table th {
        border-bottom: 1px solid #e0dad3;
        border-right: 1px solid #e0dad3;
        border-left: transparent;
        border-top: transparent;
        border-color: inherit;
        padding: 5px;
        vertical-align: middle;
        box-sizing: border-box;
        position: relative;
        line-height: 1.4;
      }
      .detail_body table th {
        background-color: #f0ece8;
        font-weight: bold;
        text-align: left;
      }

      .detail_body {
        padding: 10px 15px;
        overflow-x: hidden;
        color: #404040;
        font-weight: 400;
      }

      .detail_body h2,
      .detail_body .h2 {
        text-align: center;
        width: 100%;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIwAAABICAYAAAAkuR2cAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAjKADAAQAAAABAAAASAAAAAAE8888AAAC0ElEQVR4Ae3dPU/bUBjF8RuwZaSKIZmapRvKgpQViZWBmc/XoVOlLh06MQAbUjt2RHwAFl6FEI1ClPZGuDrkQg5IRojrvwfyOHlsc38+una8pBPul+l02jn88e3LzdXlzvj29sNkctepP+MVgVpgFopfu9+H12dnB//C0qs/4BWBxwQ6cWbZ//r5NIalrFZCf20QVru9UFTVY/2813KB4v4yNAvLYGMzLJdly0kY/iKBIt6zxIY4s9RhGY/+hJPjo3B9cR7uRqMH2w+3th+ss9IugSLe4MYhx8tQXGJYjn4ehsl4PFvnDwIqsFR/G6rvWeLMQliUiFoFlnQl1vEyxILAUwJJYObvWZ7akPfbKZAEpp0MjPq5AgTmuVL0zQQIDEF4kUAx381zlnkR1lWAGUY1qK0AgbFENKgAgVENaitAYCwRDSpAYFSD2goQGEtEgwoQGNWgtgIExhLRoAIERjWorQCBsUQ0qACBUQ1qK0BgLBENKkBgVIPaChAYS0SDChAY1aC2AgTGEtGgAgRGNaitAIGxRDSoAIFRDWorQGAsEQ0qQGBUg9oKEBhLRIMKEBjVoLYCBMYS0aACBEY1qK0AgbFENKgAgVENaitAYCwRDSpAYFSD2goQGEtEgwoQGNWgtgIExhLRoAIERjWorQCBsUQ0qACBUQ1qK0BgLBENKkBgVIPaChAYS0SDChAY1aC2AgTGEtGgAgRGNaitAIGxRDSoAIFRDWorQGAsEQ0qQGBUg9oKEBhLRIMKEBjVoLYCye8l/d7bXbgRv6e0kCf7D5lhsj/FzQ6QwDTrmf3eCEz2p7jZASaBKaqq2SOwt6wEksCsdntZDZDBNCuQBKa/NgjLZdnsUdhbNgJJYMpqJQw2NkP3Yz9wecrmPDc2kOQ5TNxzDM2n9WFjB2FH+QgkM0w+Q2MkryHwf4ZxT3hf4+Ds8/0JMMO8v3P2pv/xX2zoWcg1Lbj8AAAAAElFTkSuQmCC)
            left center/contain no-repeat,
          url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIwAAABICAYAAAAkuR2cAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAjKADAAQAAAABAAAASAAAAAAE8888AAAC00lEQVR4Ae2dMW/TQBiGz8SWU5UImrBUiLHqyMjAhhg6MbB05f+w8wP6Ayqxdai6IbFGsBQWxFKmFgRVidLI9Cwlas6to0rvwuvnhtTnsz7pfb5Hd2kWZ+/fva0CAwIJgV4vr4q1tfP1Bw/3n7/afZNlWe1JhjAJKaYNAlfSnA5GoxfPdl6P86cvdxoPcAMCl5NJ+H12Gk6+HofzXz+HV0SOqqp6lH378okjCT9uJTCbTsPxxw9hOvkbRo+f7CHMrai6sTA+PFgKmpdlGGwMw+bWdijKfr129uMkfP88Dv37gz/3lp5m0nkC8SiKgsx3lQgkChTH9OJiHWFqFHykBOJRFL+/xBF3nThms8sMYWoUfNxEIH7pTQfCpESYLwjE4ykdCJMSYd5KAGFa8bCYEkCYlAjzVgJ56yqL9gTu+ks/O4y9EtqACKPlaV8NYexbrA2IMFqe9tUQxr7F2oAIo+VpXw1h7FusDYgwWp721RDGvsXagAij5WlfDWHsW6wNiDBanvbVEMa+xdqACKPlaV8NYexbrA2IMFqe9tUQxr7F2oAIo+VpXw1h7FusDYgwWp721RDGvsXagAij5WlfDWHsW6wNiDBanvbVEMa+xdqACKPlaV8NYexbrA2IMFqe9tUQxr7F2oAIo+VpXw1h7FusDYgwWp721RDGvsXagAij5WlfDWHsW6wNiDBanvbVEMa+xdqACKPlaV8NYexbrA2IMFqe9tUQxr7F2oAIo+VpXw1h7FusDYgwWp721RDGvsXagAij5WlfDWHsW6wNyPuStDz/u2rpe6vTAOn7lNhhUkLMWwkgTCseFlMCCJMSYd5KAGFa8XR7MS/LBgCEaSDhxpzAYGM4v1z8RZgFCi6uE+gVRdjc2r5+q77m3+oGkm7fiMdQ3FmiLEXZb8BAmAaSbt1If2dZlZ4jaRUh1pcI5Kt+6Vt6mknnCbDDdF6BuwH4B7d0XKlY4G8yAAAAAElFTkSuQmCC)
            right center/contain no-repeat,
          url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAASKADAAQAAAABAAAASAAAAACQMUbvAAAA+ElEQVR4Ae3ToRGDQABFQWDSfXz6iEOkCQYXlU5gwMMrIHv2ndr7N75fz21wLgWmyyKcAuPvu1rQzRgs6AbnSIAAhUBkCwIUApEtCFAIRLYgQCEQ2YIAhUBkCwIUApEtCFAIRLYgQCEQ2YIAhUBkCwIUApEtCFAIRLYgQCEQ2YIAhUBkCwIUApEtCFAIRLYgQCEQ2YIAhUBkCwIUApEtCFAIRLYgQCEQ2YIAhUBkCwIUApEtCFAIRLYgQCEQ2YIAhUBkCwIUApEtCFAIRLYgQCEQ2YIAhUBkCwIUApEtCFAIRLYgQCEQ2YIAhUDkx/KZ48p/Z18s3n8HQmMJM81QN8AAAAAASUVORK5CYII=)
            center/contain repeat-x;
        font-size: 18px;
        line-height: 1.35;
        padding: 5px 30px;
        margin: 0;
        font-weight: normal;
        min-height: 40px;
      }

      .detail_body h3,
      .detail_body .h3 {
        background-color: #f0ece8;
        font-weight: bold;
        padding: 5px 8px;
        margin: 0;
      }

      .obc-tmpl .obc-tmpl__part {
        position: relative;
        margin-bottom: 30px;
      }
      .obc-tmpl .obc-tmpl__part::after {
        content: '';
        display: block;
        width: 100%;
        height: 100%;
        border: 1px solid #b1968b;
        position: absolute;
        left: 0;
        top: 0;
        box-sizing: border-box;
        border-radius: inherit;
        pointer-events: none;
      }

      .obc-tmpl .obc-tmpl__switch-item {
        margin-top: 30px;
      }

      /* 角色天赋 */
      .obc-tmpl__pre-text {
        white-space: pre-wrap;
        padding: 5px 8px;
      }
      .obc-tmpl__scroll-x-wrapper {
        position: relative;
      }
      .obc-tmpl__scroll-x-box {
        overflow-x: auto;
      }
      .obc-tmpl__scroll-x-box table {
        width: auto !important;
      }

      /* 悬浮 table label ，高度未准确 */
      .obc-tmpl__fixed-table {
        display: none;
        position: absolute;
        width: 150px !important;
        min-width: 0;
        left: 0;
        top: 0;
        bottom: 0;
        background: #f5f5f5;
        z-index: 2;
      }

      /* 命之座 */
      .obc-tmpl .obc-tmpl__part--life table th,
      .obc-tmpl .obc-tmpl__part--life table td {
        min-width: 120px;
      }

      /* 图文单元格 */
      .obc-tmpl .obc-tmpl__icon-text-num {
        display: inline-flex;
        flex-direction: row;
        align-items: center;
      }
      .obc-tmpl .obc-tmpl__icon-text-num .obc-tmpl__icon {
        display: inline-block;
        width: 40px;
        height: 40px;
        margin: 0;
      }
      .obc-tmpl .obc-tmpl__icon-text-num .obc-tmpl__icon-text {
        margin-left: 3px;
      }

      .obc-tmpl__switch-btn-list {
        display: none;
      }
    </style>
  `;
};

// 角色详情 html
export const renderDetailHtml = (title, content) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title}</title>
        ${detailHtmlStyle()}
      </head>
      <body>
        <div class="detail_body">${content || 'Loading...'}</div>
      </body>
    </html>
  `;
};
