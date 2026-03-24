<span id="9cdfb8b4"></span>

# About Free Tokens Only mode

Free Tokens Only mode is an experience mode provided by the ModelArk platform that allows you to try model inference services at no cost.
In this mode, calls to the inference API consume only the 500k free tokens granted by the platform. When the free quota is nearly exhausted, the service will be automatically paused to prevent any additional charges.
:::warning
The free quota applies only to offset tokens consumed by model inference and cannot be used to cover fees incurred from using plugins.
:::
<span id="411c88f0"></span>

# How it works

Free Tokens Only mode is configured at the account level and applies to all models under the account that support this mode.

- When enabled: Online inference calls consume only the free quota. Once the free quota is exhausted, the service is automatically paused.
- When disabled: Online inference calls first consume the free quota. After the free quota is used up, usage is billed based on actual token consumption.

:::warning

- If you wish to continue making calls after the service has been paused, you must disable it.
  **Note:** Once disabled, Free Tokens Only mode cannot be re-enabled.
- By default, Free Tokens Only mode is disabled. If needed, see [Function entrance](/docs/ModelArk/1465347#34d3c92e) for how to enable.

:::
<span id="41b0c2d6"></span>

# Scope

- **Accounts**: Accounts that have not activated model services and have never enabled or disabled Free Token Only mode (including both identity-verified personal accounts and enterprise accounts) are eligible to enable this mode.
- **Models**: All models are supported except for Multimodal embedding (vectorization) models and Simultaneous interpretation models
- **Billing behavior**:
  - Charges avoided: Online inference billed on a postpaid, token-based basis.
  - Charges not avoided: Fees incurred from using plugins and other auxiliary services.

**Note**: If you need to purchase model units or enable inference caching, you must disable Free Tokens Only in advance.
<span id="34d3c92e"></span>

# Tutorial

<span id="64c1252b"></span>

## Enable Free Tokens Only mode

Option 1: Enter the [Model activation page](https://console.byteplus.com/ark/region:ark+ap-southeast-1/openManagement?LLM=%7B%7D&OpenTokenDrawer=false), click the switch on the "Free Tokens Only Mode" banner above the model list.
![Image](<https://p9-arcosite.byteimg.com/tos-cn-i-goo7wpa0wc/9094f8b400164d47b4369592f54eb5ba~tplv-goo7wpa0wc-image.image> =1183x)
Option 2: Check the Free Tokens Only mode when activating a model. Free Token Only mode will be enabled when the model is activated.
<span id="1647fda1"></span>

## Disable Free Tokens Only mode

Enter the [Model activation page](https://console.byteplus.com/ark/region:ark+ap-southeast-1/openManagement?LLM=%7B%7D&OpenTokenDrawer=false), click the switch on the "Free Tokens Only Mode" banner to turn it off.
![Image](<https://p9-arcosite.byteimg.com/tos-cn-i-goo7wpa0wc/739315044434431aa774be10c867b881~tplv-goo7wpa0wc-image.image> =2266x)
<span id="b0493e61"></span>

## View the status of Free Tokens Only mode

- On the [Model activation page](https://console.byteplus.com/ark/region:ark+ap-southeast-1/openManagement?LLM=%7B%7D&OpenTokenDrawer=false), you can view whether the corresponding model is in Free Tokens Only mode.
  An icon will be displayed in the "free reasoning quota" column if Free Tokens Only mode is on.
- After the free tokens are used up, the service pauses automatically. Disable Free Tokens Only mode to continue.
- You can also view the status of Free Tokens Only mode at the inference API entry points (such as Quick API Access, Online Inference, and the Experience Center).

<span id="af51ad2e"></span>

## API call error code

Service will be automatically suspended when the free quota is exceeded. The following error code and information will be returned:

| | | | | | \

| HTTP Error Code | Type            | Code             | Message                                                                                                                                                                                                                               | Description                                                                                                                                                                                                             |
| --------------- | --------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
|                 |                 |                  |                                                                                                                                                                                                                                       |                                                                                                                                                                                                                         | \   |
| 429             | TooManyRequests | \                |
|                 |                 | SetLimitExceeded | \                                                                                                                                                                                                                                     |
|                 |                 |                  | Your account [%s] has reached the set inference limit for the [%s] model, and the model service has been paused. To continue using this model, please visit the Model Activation page to adjust or close the "Free Tokens Only Mode". | \                                                                                                                                                                                                                       |
|                 |                 |                  | Request ID: {id}                                                                                                                                                                                                                      | The current account% s' inference quota for% s model has been consumed. If you want to continue calling, please go to the ModelArk console to open the management page and turn off the "Free Tokens Only Mode" option. |

<span id="743d5c23"></span>

# FAQs

<span id="43702da4"></span>

### Q: When will the service be paused after Free Token Only mode is enabled?

A: When the platform-granted 500k free tokens are fully consumed, the service will be automatically paused. You can view the details in the model list on the Service Management page.
<span id="4261e2b8"></span>

### Q: Can Free Token Only mode be re-enabled after it is disabled?

A: No. Free Token Only mode is designed exclusively for new users to experience the free quota. Once it is disabled, it cannot be re-enabled. Please proceed with caution.
<span id="80206653"></span>

### Q: How can I continue using the service after the free quota is exhausted?

A: Go to the model activation management page and disable Free Token Only mode. Any usage beyond the free quota will then be billed based on actual token consumption.
<span id="8ef5a018"></span>

### Q: Why does the activated model list page show remaining free inference quota, but the service is already paused?

A: If Free Token Only mode is enabled, the model service will be paused once the 500k free tokens granted by the platform are fully consumed.
The “Free Inference Quota” shown on the Activation Management page reflects the total free resource packages available under the account for that model. Additionally, data in the billing center may have an hour-level delay compared to actual API usage.
Therefore, under Free Token Only mode, whether the free quota has been exhausted should be determined by the API response and the model status in the model list.
<span id="cd4d2d0b"></span>

### Q: Why could I see the Free Token Only mode option before, but cannot find it now?

A: Free Token Only mode is designed to help new users who have not yet activated any model services experience free inference more easily. Once you activate any model service without enabling Free Token Only mode, your account no longer meets the eligibility conditions, and the option will no longer be displayed.

<span id="05025535"></span>

## Feature overview

<span id="8dacf369"></span>

### Introduction

Function calling (FC) is a key feature that connects large language models (LLMs) with external tools and APIs. Acting as a "translator" between natural languages and information interfaces, it intelligently converts the natural language requests of users into calls to certain tools or APIs, thereby efficiently fulfilling specific user needs.

- **Key benefits**: Facilitates seamless interaction between LLMs and external tools, empowering LLMs to leverage external tools to handle complex tasks, such as real-time data retrieval and task execution, and driving the application of LLMs in real-world industries.
- **How it works**: Developers describe the functionalities and definitions of tools in natural languages to models. During conversations, models autonomously determine whether to call these tools. When a call is needed, the model returns the valid function name and input parameters. The developer then calls the tool and backfills the results to the model so that the model can summarize the content or continue planning subtasks.

<span id="8fafb8b7"></span>

### Scenarios

Function calling is suitable for the following scenarios, where collaborations between LLMs and external tools are needed:

| | | | | \

| **Scenario**                    | **Characteristics**                                                          | **Key Benefits**                                                  | **Example Applications**                                                                                                                                                  |
| ------------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
|                                 |                                                                              |                                                                   |                                                                                                                                                                           | \   |
| Real-time data interaction      | Collaboration between LLMs and external tools to process dynamic information | Queries dynamic information.                                      | Real-time status queries for weather, stocks, and flights, database searches, and API data calls                                                                          |
|                                 |                                                                              |                                                                   |                                                                                                                                                                           | \   |
| Task automation                 | A single tool call to complete the operation                                 | Boosts operational efficiency.                                    | Automatic email/message sending, and device control instruction execution (such as turning smart appliances on or off)                                                    |
|                                 |                                                                              |                                                                   |                                                                                                                                                                           | \   |
| Complex workflow orchestration  | Tool calls in sequence or in parallel                                        | Passes parameters across tools, and manages subtask dependencies. | Checking the weather first and then sending a notification                                                                                                                |
|                                 |                                                                              |                                                                   |                                                                                                                                                                           | \   |
| Intelligence system integration | Deep coupling with business systems                                          | Achieves intelligent linkages between systems.                    | Intelligent, linked multi-device control within a cockpit, and enterprise-level Bot workflows (such as from Lark meeting creation to group management to task generation) |

<span id="ad9643bb"></span>

### Example usecase

User: What's the weather like in Beijing today? What kind of clothes should I wear?
Thinking process of the model:

1. Needs to call the weather tool to retrieve real-time data, where the location should be Beijing and the unit should be Celsius.
2. The weather data should include temperature and weather conditions (such as sunny or rainy), which need to be considered together to offer appropriate clothing suggestions.
   Tool call return:
   Beijing is sunny today, with temperatures ranging from 18°C to 25°C, a north wind at level 3, and a humidity level of 45%.
   Model response:
   Beijing is sunny today, with temperatures ranging from 18°C to 25°C. You might consider wearing a light long-sleeve shirt or a T-shirt, plus a thin jacket for cooler morning and evening hours.
   <span id="a5108937"></span>

### Workflow

<img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHdpZHRoPSI3NjVweCIgaGVpZ2h0PSI0NDVweCIgdmlld0JveD0iLTAuNSAtMC41IDc2NSA0NDUiPjxkZWZzLz48Zz48cmVjdCB4PSIyIiB5PSIyIiB3aWR0aD0iMjQwIiBoZWlnaHQ9IjQ0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2UtZGFzaGFycmF5PSIzIDMiIHBvaW50ZXItZXZlbnRzPSJhbGwiLz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMC41IC0wLjUpIj48Zm9yZWlnbk9iamVjdCBzdHlsZT0ib3ZlcmZsb3c6IHZpc2libGU7IHRleHQtYWxpZ246IGxlZnQ7IiBwb2ludGVyLWV2ZW50cz0ibm9uZSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSI+PGRpdiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCIgc3R5bGU9ImRpc3BsYXk6IGZsZXg7IGFsaWduLWl0ZW1zOiB1bnNhZmUgZmxleC1zdGFydDsganVzdGlmeS1jb250ZW50OiB1bnNhZmUgY2VudGVyOyB3aWR0aDogMjM4cHg7IGhlaWdodDogMXB4OyBwYWRkaW5nLXRvcDogOXB4OyBtYXJnaW4tbGVmdDogM3B4OyI+PGRpdiBzdHlsZT0iYm94LXNpemluZzogYm9yZGVyLWJveDsgZm9udC1zaXplOiAwOyB0ZXh0LWFsaWduOiBjZW50ZXI7ICI+PGRpdiBzdHlsZT0iZGlzcGxheTogaW5saW5lLWJsb2NrOyBmb250LXNpemU6IDEycHg7IGZvbnQtZmFtaWx5OiBIZWx2ZXRpY2E7IGNvbG9yOiAjMDAwMDAwOyBsaW5lLWhlaWdodDogMS4yOyBwb2ludGVyLWV2ZW50czogYWxsOyB3aGl0ZS1zcGFjZTogbm9ybWFsOyB3b3JkLXdyYXA6IG5vcm1hbDsgIj5Ub29sczxoMyBzdHlsZT0iLXdlYmtpdC1mb250LXNtb290aGluZzphbnRpYWxpYXNlZDtib3gtc2l6aW5nOmJvcmRlci1ib3g7LXdlYmtpdC10YXAtaGlnaGxpZ2h0LWNvbG9yOnJnYmEoMCwgMCwgMCwgMCk7Ym9yZGVyOjBweCBzb2xpZDttYXJnaW4tcmlnaHQ6MHB4O21hcmdpbi1sZWZ0OjBweDtwYWRkaW5nLXRvcDowcHg7cGFkZGluZy1yaWdodDowcHg7cGFkZGluZy1sZWZ0OjBweDtsaW5lLWhlaWdodDoyOHB4O292ZXJmbG93LWFuY2hvcjphdXRvO2ZvbnQtZmFtaWx5OkludGVyLCAtYXBwbGUtc3lzdGVtLCAmcXVvdDtzeXN0ZW0tdWkmcXVvdDssICZxdW90O1NlZ29lIFVJJnF1b3Q7LCAmcXVvdDtTRiBQcm8gU0MmcXVvdDssICZxdW90O1NGIFBybyBEaXNwbGF5JnF1b3Q7LCAmcXVvdDtTRiBQcm8gSWNvbnMmcXVvdDssICZxdW90O1BpbmdGYW5nIFNDJnF1b3Q7LCAmcXVvdDtIaXJhZ2lubyBTYW5zIEdCJnF1b3Q7LCAmcXVvdDtNaWNyb3NvZnQgWWFIZWkmcXVvdDssICZxdW90O0hlbHZldGljYSBOZXVlJnF1b3Q7LCBIZWx2ZXRpY2EsIEFyaWFsLCBzYW5zLXNlcmlmO3RleHQtYWxpZ246c3RhcnQ7YmFja2dyb3VuZC1jb2xvcjpyZ2IoMjU1LCAyNTUsIDI1NSk7bWFyZ2luLXRvcDowcHggIWltcG9ydGFudDttYXJnaW4tYm90dG9tOjEycHggIWltcG9ydGFudDtwYWRkaW5nLWJvdHRvbTowcHggIWltcG9ydGFudCI+PC9oMz48L2Rpdj48L2Rpdj48L2Rpdj48L2ZvcmVpZ25PYmplY3Q+PC9nPjxyZWN0IHg9IjI2MiIgeT0iMiIgd2lkdGg9IjI0MCIgaGVpZ2h0PSI0NDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLWRhc2hhcnJheT0iMyAzIiBwb2ludGVyLWV2ZW50cz0iYWxsIi8+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTAuNSAtMC41KSI+PGZvcmVpZ25PYmplY3Qgc3R5bGU9Im92ZXJmbG93OiB2aXNpYmxlOyB0ZXh0LWFsaWduOiBsZWZ0OyIgcG9pbnRlci1ldmVudHM9Im5vbmUiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkaXYgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWwiIHN0eWxlPSJkaXNwbGF5OiBmbGV4OyBhbGlnbi1pdGVtczogdW5zYWZlIGZsZXgtc3RhcnQ7IGp1c3RpZnktY29udGVudDogdW5zYWZlIGNlbnRlcjsgd2lkdGg6IDIzOHB4OyBoZWlnaHQ6IDFweDsgcGFkZGluZy10b3A6IDlweDsgbWFyZ2luLWxlZnQ6IDI2M3B4OyI+PGRpdiBzdHlsZT0iYm94LXNpemluZzogYm9yZGVyLWJveDsgZm9udC1zaXplOiAwOyB0ZXh0LWFsaWduOiBjZW50ZXI7ICI+PGRpdiBzdHlsZT0iZGlzcGxheTogaW5saW5lLWJsb2NrOyBmb250LXNpemU6IDEycHg7IGZvbnQtZmFtaWx5OiBIZWx2ZXRpY2E7IGNvbG9yOiAjMDAwMDAwOyBsaW5lLWhlaWdodDogMS4yOyBwb2ludGVyLWV2ZW50czogYWxsOyB3aGl0ZS1zcGFjZTogbm9ybWFsOyB3b3JkLXdyYXA6IG5vcm1hbDsgIj5Qcm9ncmFtPGgzIHN0eWxlPSItd2Via2l0LWZvbnQtc21vb3RoaW5nOmFudGlhbGlhc2VkO2JveC1zaXppbmc6Ym9yZGVyLWJveDstd2Via2l0LXRhcC1oaWdobGlnaHQtY29sb3I6cmdiYSgwLCAwLCAwLCAwKTtib3JkZXI6MHB4IHNvbGlkO21hcmdpbi10b3A6MjhweDttYXJnaW4tcmlnaHQ6MHB4O21hcmdpbi1sZWZ0OjBweDtwYWRkaW5nLXRvcDowcHg7cGFkZGluZy1yaWdodDowcHg7cGFkZGluZy1sZWZ0OjBweDtmb250LXNpemU6MThweDtsaW5lLWhlaWdodDoyOHB4O292ZXJmbG93LWFuY2hvcjphdXRvO2ZvbnQtZmFtaWx5OkludGVyLCAtYXBwbGUtc3lzdGVtLCAmcXVvdDtzeXN0ZW0tdWkmcXVvdDssICZxdW90O1NlZ29lIFVJJnF1b3Q7LCAmcXVvdDtTRiBQcm8gU0MmcXVvdDssICZxdW90O1NGIFBybyBEaXNwbGF5JnF1b3Q7LCAmcXVvdDtTRiBQcm8gSWNvbnMmcXVvdDssICZxdW90O1BpbmdGYW5nIFNDJnF1b3Q7LCAmcXVvdDtIaXJhZ2lubyBTYW5zIEdCJnF1b3Q7LCAmcXVvdDtNaWNyb3NvZnQgWWFIZWkmcXVvdDssICZxdW90O0hlbHZldGljYSBOZXVlJnF1b3Q7LCBIZWx2ZXRpY2EsIEFyaWFsLCBzYW5zLXNlcmlmO3RleHQtYWxpZ246c3RhcnQ7YmFja2dyb3VuZC1jb2xvcjpyZ2IoMjU1LCAyNTUsIDI1NSk7bWFyZ2luLWJvdHRvbToxMnB4ICFpbXBvcnRhbnQ7cGFkZGluZy1ib3R0b206MHB4ICFpbXBvcnRhbnQiPjwvaDM+PGgzIHN0eWxlPSItd2Via2l0LWZvbnQtc21vb3RoaW5nOmFudGlhbGlhc2VkO2JveC1zaXppbmc6Ym9yZGVyLWJveDstd2Via2l0LXRhcC1oaWdobGlnaHQtY29sb3I6cmdiYSgwLCAwLCAwLCAwKTtib3JkZXI6MHB4IHNvbGlkO21hcmdpbi10b3A6MjhweDttYXJnaW4tcmlnaHQ6MHB4O21hcmdpbi1sZWZ0OjBweDtwYWRkaW5nLXRvcDowcHg7cGFkZGluZy1yaWdodDowcHg7cGFkZGluZy1sZWZ0OjBweDtmb250LXNpemU6MThweDtsaW5lLWhlaWdodDoyOHB4O292ZXJmbG93LWFuY2hvcjphdXRvO2ZvbnQtZmFtaWx5OkludGVyLCAtYXBwbGUtc3lzdGVtLCAmcXVvdDtzeXN0ZW0tdWkmcXVvdDssICZxdW90O1NlZ29lIFVJJnF1b3Q7LCAmcXVvdDtTRiBQcm8gU0MmcXVvdDssICZxdW90O1NGIFBybyBEaXNwbGF5JnF1b3Q7LCAmcXVvdDtTRiBQcm8gSWNvbnMmcXVvdDssICZxdW90O1BpbmdGYW5nIFNDJnF1b3Q7LCAmcXVvdDtIaXJhZ2lubyBTYW5zIEdCJnF1b3Q7LCAmcXVvdDtNaWNyb3NvZnQgWWFIZWkmcXVvdDssICZxdW90O0hlbHZldGljYSBOZXVlJnF1b3Q7LCBIZWx2ZXRpY2EsIEFyaWFsLCBzYW5zLXNlcmlmO3RleHQtYWxpZ246c3RhcnQ7YmFja2dyb3VuZC1jb2xvcjpyZ2IoMjU1LCAyNTUsIDI1NSk7bWFyZ2luLWJvdHRvbToxMnB4ICFpbXBvcnRhbnQ7cGFkZGluZy1ib3R0b206MHB4ICFpbXBvcnRhbnQiPjwvaDM+PC9kaXY+PC9kaXY+PC9kaXY+PC9mb3JlaWduT2JqZWN0PjwvZz48cmVjdCB4PSI1MjIiIHk9IjIiIHdpZHRoPSIyNDAiIGhlaWdodD0iNDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS1kYXNoYXJyYXk9IjMgMyIgcG9pbnRlci1ldmVudHM9ImFsbCIvPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0wLjUgLTAuNSkiPjxmb3JlaWduT2JqZWN0IHN0eWxlPSJvdmVyZmxvdzogdmlzaWJsZTsgdGV4dC1hbGlnbjogbGVmdDsiIHBvaW50ZXItZXZlbnRzPSJub25lIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIj48ZGl2IHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sIiBzdHlsZT0iZGlzcGxheTogZmxleDsgYWxpZ24taXRlbXM6IHVuc2FmZSBmbGV4LXN0YXJ0OyBqdXN0aWZ5LWNvbnRlbnQ6IHVuc2FmZSBjZW50ZXI7IHdpZHRoOiAyMzhweDsgaGVpZ2h0OiAxcHg7IHBhZGRpbmctdG9wOiA5cHg7IG1hcmdpbi1sZWZ0OiA1MjNweDsiPjxkaXYgc3R5bGU9ImJveC1zaXppbmc6IGJvcmRlci1ib3g7IGZvbnQtc2l6ZTogMDsgdGV4dC1hbGlnbjogY2VudGVyOyAiPjxkaXYgc3R5bGU9ImRpc3BsYXk6IGlubGluZS1ibG9jazsgZm9udC1zaXplOiAxMnB4OyBmb250LWZhbWlseTogSGVsdmV0aWNhOyBjb2xvcjogIzAwMDAwMDsgbGluZS1oZWlnaHQ6IDEuMjsgcG9pbnRlci1ldmVudHM6IGFsbDsgd2hpdGUtc3BhY2U6IG5vcm1hbDsgd29yZC13cmFwOiBub3JtYWw7ICI+TW9kZWw8L2Rpdj48L2Rpdj48L2Rpdj48L2ZvcmVpZ25PYmplY3Q+PC9nPjxwYXRoIGQ9Ik0gMzgyIDgyIEwgMzgyIDEwMiBMIDM4MiA4MiBMIDM4MiA5NS42MyIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHBvaW50ZXItZXZlbnRzPSJzdHJva2UiLz48cGF0aCBkPSJNIDM4MiAxMDAuODggTCAzNzguNSA5My44OCBMIDM4MiA5NS42MyBMIDM4NS41IDkzLjg4IFoiIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBwb2ludGVyLWV2ZW50cz0iYWxsIi8+PHJlY3QgeD0iMzAyIiB5PSI0MiIgd2lkdGg9IjE2MCIgaGVpZ2h0PSI0MCIgcng9IjIwIiByeT0iMjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMDAwMCIgcG9pbnRlci1ldmVudHM9ImFsbCIvPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0wLjUgLTAuNSkiPjxmb3JlaWduT2JqZWN0IHN0eWxlPSJvdmVyZmxvdzogdmlzaWJsZTsgdGV4dC1hbGlnbjogbGVmdDsiIHBvaW50ZXItZXZlbnRzPSJub25lIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIj48ZGl2IHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sIiBzdHlsZT0iZGlzcGxheTogZmxleDsgYWxpZ24taXRlbXM6IHVuc2FmZSBjZW50ZXI7IGp1c3RpZnktY29udGVudDogdW5zYWZlIGNlbnRlcjsgd2lkdGg6IDE1OHB4OyBoZWlnaHQ6IDFweDsgcGFkZGluZy10b3A6IDYycHg7IG1hcmdpbi1sZWZ0OiAzMDNweDsiPjxkaXYgc3R5bGU9ImJveC1zaXppbmc6IGJvcmRlci1ib3g7IGZvbnQtc2l6ZTogMDsgdGV4dC1hbGlnbjogY2VudGVyOyAiPjxkaXYgc3R5bGU9ImRpc3BsYXk6IGlubGluZS1ibG9jazsgZm9udC1zaXplOiAxMnB4OyBmb250LWZhbWlseTogSGVsdmV0aWNhOyBjb2xvcjogIzAwMDAwMDsgbGluZS1oZWlnaHQ6IDEuMjsgcG9pbnRlci1ldmVudHM6IGFsbDsgd2hpdGUtc3BhY2U6IG5vcm1hbDsgd29yZC13cmFwOiBub3JtYWw7ICI+UmVjZWl2ZSBVc2VyJ3MgUXVlc3Rpb248L2Rpdj48L2Rpdj48L2Rpdj48L2ZvcmVpZ25PYmplY3Q+PC9nPjxwYXRoIGQ9Ik0gNDYyIDEyNyBMIDQ2MiAxMjIgTCA1MTIgMTIyIEwgNTEyIDEyNyBMIDU1NS42MyAxMjciIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBwb2ludGVyLWV2ZW50cz0ic3Ryb2tlIi8+PHBhdGggZD0iTSA1NjAuODggMTI3IEwgNTUzLjg4IDEzMC41IEwgNTU1LjYzIDEyNyBMIDU1My44OCAxMjMuNSBaIiBmaWxsPSIjMDAwMDAwIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgcG9pbnRlci1ldmVudHM9ImFsbCIvPjxyZWN0IHg9IjMwMiIgeT0iMTAyIiB3aWR0aD0iMTYwIiBoZWlnaHQ9IjUwIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHBvaW50ZXItZXZlbnRzPSJhbGwiLz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMC41IC0wLjUpIj48Zm9yZWlnbk9iamVjdCBzdHlsZT0ib3ZlcmZsb3c6IHZpc2libGU7IHRleHQtYWxpZ246IGxlZnQ7IiBwb2ludGVyLWV2ZW50cz0ibm9uZSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSI+PGRpdiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCIgc3R5bGU9ImRpc3BsYXk6IGZsZXg7IGFsaWduLWl0ZW1zOiB1bnNhZmUgY2VudGVyOyBqdXN0aWZ5LWNvbnRlbnQ6IHVuc2FmZSBjZW50ZXI7IHdpZHRoOiAxNThweDsgaGVpZ2h0OiAxcHg7IHBhZGRpbmctdG9wOiAxMjdweDsgbWFyZ2luLWxlZnQ6IDMwM3B4OyI+PGRpdiBzdHlsZT0iYm94LXNpemluZzogYm9yZGVyLWJveDsgZm9udC1zaXplOiAwOyB0ZXh0LWFsaWduOiBjZW50ZXI7ICI+PGRpdiBzdHlsZT0iZGlzcGxheTogaW5saW5lLWJsb2NrOyBmb250LXNpemU6IDEycHg7IGZvbnQtZmFtaWx5OiBIZWx2ZXRpY2E7IGNvbG9yOiAjMDAwMDAwOyBsaW5lLWhlaWdodDogMS4yOyBwb2ludGVyLWV2ZW50czogYWxsOyB3aGl0ZS1zcGFjZTogbm9ybWFsOyB3b3JkLXdyYXA6IG5vcm1hbDsgIj7CoEluaXRpYXRlIE1vZGVsIENhbGwgKFRvb2xzIGZpZWxkICsgb3JpZ2luYWwgdXNlciBxdWVzdGlvbinCoDwvZGl2PjwvZGl2PjwvZGl2PjwvZm9yZWlnbk9iamVjdD48L2c+PHBhdGggZD0iTSA2NDIgMTQ3IEwgNjQyIDE2NyBMIDY0MiAxNjIgTCA2NDIgMTc1LjYzIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgcG9pbnRlci1ldmVudHM9InN0cm9rZSIvPjxwYXRoIGQ9Ik0gNjQyIDE4MC44OCBMIDYzOC41IDE3My44OCBMIDY0MiAxNzUuNjMgTCA2NDUuNSAxNzMuODggWiIgZmlsbD0iIzAwMDAwMCIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHBvaW50ZXItZXZlbnRzPSJhbGwiLz48cGF0aCBkPSJNIDcyMiAxMjcgTCA3NDIgMTI3IEwgNzQyIDM2MiBMIDcyOC4zNyAzNjIiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBwb2ludGVyLWV2ZW50cz0ic3Ryb2tlIi8+PHBhdGggZD0iTSA3MjMuMTIgMzYyIEwgNzMwLjEyIDM1OC41IEwgNzI4LjM3IDM2MiBMIDczMC4xMiAzNjUuNSBaIiBmaWxsPSIjMDAwMDAwIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgcG9pbnRlci1ldmVudHM9ImFsbCIvPjxwYXRoIGQ9Ik0gNjQyIDEwNyBMIDcyMiAxMjcgTCA2NDIgMTQ3IEwgNTYyIDEyNyBaIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgcG9pbnRlci1ldmVudHM9ImFsbCIvPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0wLjUgLTAuNSkiPjxmb3JlaWduT2JqZWN0IHN0eWxlPSJvdmVyZmxvdzogdmlzaWJsZTsgdGV4dC1hbGlnbjogbGVmdDsiIHBvaW50ZXItZXZlbnRzPSJub25lIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIj48ZGl2IHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sIiBzdHlsZT0iZGlzcGxheTogZmxleDsgYWxpZ24taXRlbXM6IHVuc2FmZSBjZW50ZXI7IGp1c3RpZnktY29udGVudDogdW5zYWZlIGNlbnRlcjsgd2lkdGg6IDE1OHB4OyBoZWlnaHQ6IDFweDsgcGFkZGluZy10b3A6IDEyN3B4OyBtYXJnaW4tbGVmdDogNTYzcHg7Ij48ZGl2IHN0eWxlPSJib3gtc2l6aW5nOiBib3JkZXItYm94OyBmb250LXNpemU6IDA7IHRleHQtYWxpZ246IGNlbnRlcjsgIj48ZGl2IHN0eWxlPSJkaXNwbGF5OiBpbmxpbmUtYmxvY2s7IGZvbnQtc2l6ZTogMTJweDsgZm9udC1mYW1pbHk6IEhlbHZldGljYTsgY29sb3I6ICMwMDAwMDA7IGxpbmUtaGVpZ2h0OiAxLjI7IHBvaW50ZXItZXZlbnRzOiBhbGw7IHdoaXRlLXNwYWNlOiBub3JtYWw7IHdvcmQtd3JhcDogbm9ybWFsOyAiPldoZXRoZXIgdG8gQ2FsbCBhIFRvb2zCoDwvZGl2PjwvZGl2PjwvZGl2PjwvZm9yZWlnbk9iamVjdD48L2c+PHBhdGggZD0iTSA1NjIgMjAyIEwgNTEyIDIwMiBMIDUxMiAyMjIgTCA0NjguMzcgMjIyIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgcG9pbnRlci1ldmVudHM9InN0cm9rZSIvPjxwYXRoIGQ9Ik0gNDYzLjEyIDIyMiBMIDQ3MC4xMiAyMTguNSBMIDQ2OC4zNyAyMjIgTCA0NzAuMTIgMjI1LjUgWiIgZmlsbD0iIzAwMDAwMCIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHBvaW50ZXItZXZlbnRzPSJhbGwiLz48cmVjdCB4PSI1NjIiIHk9IjE4MiIgd2lkdGg9IjE2MCIgaGVpZ2h0PSI0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwMDAwIiBwb2ludGVyLWV2ZW50cz0iYWxsIi8+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTAuNSAtMC41KSI+PGZvcmVpZ25PYmplY3Qgc3R5bGU9Im92ZXJmbG93OiB2aXNpYmxlOyB0ZXh0LWFsaWduOiBsZWZ0OyIgcG9pbnRlci1ldmVudHM9Im5vbmUiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkaXYgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWwiIHN0eWxlPSJkaXNwbGF5OiBmbGV4OyBhbGlnbi1pdGVtczogdW5zYWZlIGNlbnRlcjsganVzdGlmeS1jb250ZW50OiB1bnNhZmUgY2VudGVyOyB3aWR0aDogMTU4cHg7IGhlaWdodDogMXB4OyBwYWRkaW5nLXRvcDogMjAycHg7IG1hcmdpbi1sZWZ0OiA1NjNweDsiPjxkaXYgc3R5bGU9ImJveC1zaXppbmc6IGJvcmRlci1ib3g7IGZvbnQtc2l6ZTogMDsgdGV4dC1hbGlnbjogY2VudGVyOyAiPjxkaXYgc3R5bGU9ImRpc3BsYXk6IGlubGluZS1ibG9jazsgZm9udC1zaXplOiAxMnB4OyBmb250LWZhbWlseTogSGVsdmV0aWNhOyBjb2xvcjogIzAwMDAwMDsgbGluZS1oZWlnaHQ6IDEuMjsgcG9pbnRlci1ldmVudHM6IGFsbDsgd2hpdGUtc3BhY2U6IG5vcm1hbDsgd29yZC13cmFwOiBub3JtYWw7ICI+T3V0cHV0IFRvb2wgTmFtZSBhbmQgUGFyYW1ldGVyczwvZGl2PjwvZGl2PjwvZGl2PjwvZm9yZWlnbk9iamVjdD48L2c+PHJlY3QgeD0iNjQyIiB5PSIxNjMiIHdpZHRoPSI0MCIgaGVpZ2h0PSIyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJub25lIiBwb2ludGVyLWV2ZW50cz0iYWxsIi8+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTAuNSAtMC41KSI+PGZvcmVpZ25PYmplY3Qgc3R5bGU9Im92ZXJmbG93OiB2aXNpYmxlOyB0ZXh0LWFsaWduOiBsZWZ0OyIgcG9pbnRlci1ldmVudHM9Im5vbmUiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkaXYgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWwiIHN0eWxlPSJkaXNwbGF5OiBmbGV4OyBhbGlnbi1pdGVtczogdW5zYWZlIGNlbnRlcjsganVzdGlmeS1jb250ZW50OiB1bnNhZmUgY2VudGVyOyB3aWR0aDogMXB4OyBoZWlnaHQ6IDFweDsgcGFkZGluZy10b3A6IDE3M3B4OyBtYXJnaW4tbGVmdDogNjYycHg7Ij48ZGl2IHN0eWxlPSJib3gtc2l6aW5nOiBib3JkZXItYm94OyBmb250LXNpemU6IDA7IHRleHQtYWxpZ246IGNlbnRlcjsgIj48ZGl2IHN0eWxlPSJkaXNwbGF5OiBpbmxpbmUtYmxvY2s7IGZvbnQtc2l6ZTogMTJweDsgZm9udC1mYW1pbHk6IEhlbHZldGljYTsgY29sb3I6ICMwMDAwMDA7IGxpbmUtaGVpZ2h0OiAxLjI7IHBvaW50ZXItZXZlbnRzOiBhbGw7IHdoaXRlLXNwYWNlOiBub3dyYXA7ICI+WWVzPC9kaXY+PC9kaXY+PC9kaXY+PC9mb3JlaWduT2JqZWN0PjwvZz48cGF0aCBkPSJNIDY0MiAzODIgTCA2NDIgNDAyIEwgNDY4LjM3IDQwMiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHBvaW50ZXItZXZlbnRzPSJzdHJva2UiLz48cGF0aCBkPSJNIDQ2My4xMiA0MDIgTCA0NzAuMTIgMzk4LjUgTCA0NjguMzcgNDAyIEwgNDcwLjEyIDQwNS41IFoiIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBwb2ludGVyLWV2ZW50cz0iYWxsIi8+PHJlY3QgeD0iNTYyIiB5PSIzNDIiIHdpZHRoPSIxNjAiIGhlaWdodD0iNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMDAwMCIgcG9pbnRlci1ldmVudHM9ImFsbCIvPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0wLjUgLTAuNSkiPjxmb3JlaWduT2JqZWN0IHN0eWxlPSJvdmVyZmxvdzogdmlzaWJsZTsgdGV4dC1hbGlnbjogbGVmdDsiIHBvaW50ZXItZXZlbnRzPSJub25lIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIj48ZGl2IHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sIiBzdHlsZT0iZGlzcGxheTogZmxleDsgYWxpZ24taXRlbXM6IHVuc2FmZSBjZW50ZXI7IGp1c3RpZnktY29udGVudDogdW5zYWZlIGNlbnRlcjsgd2lkdGg6IDE1OHB4OyBoZWlnaHQ6IDFweDsgcGFkZGluZy10b3A6IDM2MnB4OyBtYXJnaW4tbGVmdDogNTYzcHg7Ij48ZGl2IHN0eWxlPSJib3gtc2l6aW5nOiBib3JkZXItYm94OyBmb250LXNpemU6IDA7IHRleHQtYWxpZ246IGNlbnRlcjsgIj48ZGl2IHN0eWxlPSJkaXNwbGF5OiBpbmxpbmUtYmxvY2s7IGZvbnQtc2l6ZTogMTJweDsgZm9udC1mYW1pbHk6IEhlbHZldGljYTsgY29sb3I6ICMwMDAwMDA7IGxpbmUtaGVpZ2h0OiAxLjI7IHBvaW50ZXItZXZlbnRzOiBhbGw7IHdoaXRlLXNwYWNlOiBub3JtYWw7IHdvcmQtd3JhcDogbm9ybWFsOyAiPkdlbmVyYXRlIFF1ZXN0aW9uIEFuc3dlcjwvZGl2PjwvZGl2PjwvZGl2PjwvZm9yZWlnbk9iamVjdD48L2c+PHBhdGggZD0iTSAzMDIgMjIyIEwgMjUyIDIyMiBMIDI1MiAyNDIgTCAyMDguMzcgMjQyIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgcG9pbnRlci1ldmVudHM9InN0cm9rZSIvPjxwYXRoIGQ9Ik0gMjAzLjEyIDI0MiBMIDIxMC4xMiAyMzguNSBMIDIwOC4zNyAyNDIgTCAyMTAuMTIgMjQ1LjUgWiIgZmlsbD0iIzAwMDAwMCIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHBvaW50ZXItZXZlbnRzPSJhbGwiLz48cmVjdCB4PSIzMDIiIHk9IjIwMiIgd2lkdGg9IjE2MCIgaGVpZ2h0PSI0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwMDAwIiBwb2ludGVyLWV2ZW50cz0iYWxsIi8+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTAuNSAtMC41KSI+PGZvcmVpZ25PYmplY3Qgc3R5bGU9Im92ZXJmbG93OiB2aXNpYmxlOyB0ZXh0LWFsaWduOiBsZWZ0OyIgcG9pbnRlci1ldmVudHM9Im5vbmUiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkaXYgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWwiIHN0eWxlPSJkaXNwbGF5OiBmbGV4OyBhbGlnbi1pdGVtczogdW5zYWZlIGNlbnRlcjsganVzdGlmeS1jb250ZW50OiB1bnNhZmUgY2VudGVyOyB3aWR0aDogMTU4cHg7IGhlaWdodDogMXB4OyBwYWRkaW5nLXRvcDogMjIycHg7IG1hcmdpbi1sZWZ0OiAzMDNweDsiPjxkaXYgc3R5bGU9ImJveC1zaXppbmc6IGJvcmRlci1ib3g7IGZvbnQtc2l6ZTogMDsgdGV4dC1hbGlnbjogY2VudGVyOyAiPjxkaXYgc3R5bGU9ImRpc3BsYXk6IGlubGluZS1ibG9jazsgZm9udC1zaXplOiAxMnB4OyBmb250LWZhbWlseTogSGVsdmV0aWNhOyBjb2xvcjogIzAwMDAwMDsgbGluZS1oZWlnaHQ6IDEuMjsgcG9pbnRlci1ldmVudHM6IGFsbDsgd2hpdGUtc3BhY2U6IG5vcm1hbDsgd29yZC13cmFwOiBub3JtYWw7ICI+UGFyc2UgUmV0dXJuZWQgSW5mb3JtYXRpb24gYW5kIEluaXRpYXRlIFRvb2wgQ2FsbMKgPC9kaXY+PC9kaXY+PC9kaXY+PC9mb3JlaWduT2JqZWN0PjwvZz48cGF0aCBkPSJNIDEyMiAyNjIgTCAxMjIgMzAyIEwgMjk1LjYzIDMwMiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHBvaW50ZXItZXZlbnRzPSJzdHJva2UiLz48cGF0aCBkPSJNIDMwMC44OCAzMDIgTCAyOTMuODggMzA1LjUgTCAyOTUuNjMgMzAyIEwgMjkzLjg4IDI5OC41IFoiIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBwb2ludGVyLWV2ZW50cz0iYWxsIi8+PHJlY3QgeD0iNDIiIHk9IjIyMiIgd2lkdGg9IjE2MCIgaGVpZ2h0PSI0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwMDAwIiBwb2ludGVyLWV2ZW50cz0iYWxsIi8+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTAuNSAtMC41KSI+PGZvcmVpZ25PYmplY3Qgc3R5bGU9Im92ZXJmbG93OiB2aXNpYmxlOyB0ZXh0LWFsaWduOiBsZWZ0OyIgcG9pbnRlci1ldmVudHM9Im5vbmUiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkaXYgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWwiIHN0eWxlPSJkaXNwbGF5OiBmbGV4OyBhbGlnbi1pdGVtczogdW5zYWZlIGNlbnRlcjsganVzdGlmeS1jb250ZW50OiB1bnNhZmUgY2VudGVyOyB3aWR0aDogMTU4cHg7IGhlaWdodDogMXB4OyBwYWRkaW5nLXRvcDogMjQycHg7IG1hcmdpbi1sZWZ0OiA0M3B4OyI+PGRpdiBzdHlsZT0iYm94LXNpemluZzogYm9yZGVyLWJveDsgZm9udC1zaXplOiAwOyB0ZXh0LWFsaWduOiBjZW50ZXI7ICI+PGRpdiBzdHlsZT0iZGlzcGxheTogaW5saW5lLWJsb2NrOyBmb250LXNpemU6IDEycHg7IGZvbnQtZmFtaWx5OiBIZWx2ZXRpY2E7IGNvbG9yOiAjMDAwMDAwOyBsaW5lLWhlaWdodDogMS4yOyBwb2ludGVyLWV2ZW50czogYWxsOyB3aGl0ZS1zcGFjZTogbm9ybWFsOyB3b3JkLXdyYXA6IG5vcm1hbDsgIj5Db21wbGV0ZSBSZXF1ZXN0IGFuZCBSZXR1cm4gSW5mb3JtYXRpb248L2Rpdj48L2Rpdj48L2Rpdj48L2ZvcmVpZ25PYmplY3Q+PC9nPjxwYXRoIGQ9Ik0gNDYyIDMwMiBMIDU1NS42MyAzMDIiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBwb2ludGVyLWV2ZW50cz0ic3Ryb2tlIi8+PHBhdGggZD0iTSA1NjAuODggMzAyIEwgNTUzLjg4IDMwNS41IEwgNTU1LjYzIDMwMiBMIDU1My44OCAyOTguNSBaIiBmaWxsPSIjMDAwMDAwIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgcG9pbnRlci1ldmVudHM9ImFsbCIvPjxyZWN0IHg9IjMwMiIgeT0iMjcyIiB3aWR0aD0iMTYwIiBoZWlnaHQ9IjYwIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHBvaW50ZXItZXZlbnRzPSJhbGwiLz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMC41IC0wLjUpIj48Zm9yZWlnbk9iamVjdCBzdHlsZT0ib3ZlcmZsb3c6IHZpc2libGU7IHRleHQtYWxpZ246IGxlZnQ7IiBwb2ludGVyLWV2ZW50cz0ibm9uZSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSI+PGRpdiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCIgc3R5bGU9ImRpc3BsYXk6IGZsZXg7IGFsaWduLWl0ZW1zOiB1bnNhZmUgY2VudGVyOyBqdXN0aWZ5LWNvbnRlbnQ6IHVuc2FmZSBjZW50ZXI7IHdpZHRoOiAxNThweDsgaGVpZ2h0OiAxcHg7IHBhZGRpbmctdG9wOiAzMDJweDsgbWFyZ2luLWxlZnQ6IDMwM3B4OyI+PGRpdiBzdHlsZT0iYm94LXNpemluZzogYm9yZGVyLWJveDsgZm9udC1zaXplOiAwOyB0ZXh0LWFsaWduOiBjZW50ZXI7ICI+PGRpdiBzdHlsZT0iZGlzcGxheTogaW5saW5lLWJsb2NrOyBmb250LXNpemU6IDEycHg7IGZvbnQtZmFtaWx5OiBIZWx2ZXRpY2E7IGNvbG9yOiAjMDAwMDAwOyBsaW5lLWhlaWdodDogMS4yOyBwb2ludGVyLWV2ZW50czogYWxsOyB3aGl0ZS1zcGFjZTogbm9ybWFsOyB3b3JkLXdyYXA6IG5vcm1hbDsgIj5Jbml0aWF0ZSBNb2RlbCBDYWxsIChvcmlnaW5hbCB1c2VyIHF1ZXN0aW9uICsgdG9vbCByZXR1cm4gcmVzdWx0KcKgPC9kaXY+PC9kaXY+PC9kaXY+PC9mb3JlaWduT2JqZWN0PjwvZz48cmVjdCB4PSIzMDIiIHk9IjM4MiIgd2lkdGg9IjE2MCIgaGVpZ2h0PSI0MCIgcng9IjIwIiByeT0iMjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMDAwMCIgcG9pbnRlci1ldmVudHM9ImFsbCIvPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0wLjUgLTAuNSkiPjxmb3JlaWduT2JqZWN0IHN0eWxlPSJvdmVyZmxvdzogdmlzaWJsZTsgdGV4dC1hbGlnbjogbGVmdDsiIHBvaW50ZXItZXZlbnRzPSJub25lIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIj48ZGl2IHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sIiBzdHlsZT0iZGlzcGxheTogZmxleDsgYWxpZ24taXRlbXM6IHVuc2FmZSBjZW50ZXI7IGp1c3RpZnktY29udGVudDogdW5zYWZlIGNlbnRlcjsgd2lkdGg6IDE1OHB4OyBoZWlnaHQ6IDFweDsgcGFkZGluZy10b3A6IDQwMnB4OyBtYXJnaW4tbGVmdDogMzAzcHg7Ij48ZGl2IHN0eWxlPSJib3gtc2l6aW5nOiBib3JkZXItYm94OyBmb250LXNpemU6IDA7IHRleHQtYWxpZ246IGNlbnRlcjsgIj48ZGl2IHN0eWxlPSJkaXNwbGF5OiBpbmxpbmUtYmxvY2s7IGZvbnQtc2l6ZTogMTJweDsgZm9udC1mYW1pbHk6IEhlbHZldGljYTsgY29sb3I6ICMwMDAwMDA7IGxpbmUtaGVpZ2h0OiAxLjI7IHBvaW50ZXItZXZlbnRzOiBhbGw7IHdoaXRlLXNwYWNlOiBub3JtYWw7IHdvcmQtd3JhcDogbm9ybWFsOyAiPlJldHVybiBNb2RlbCdzIEFuc3dlcjwvZGl2PjwvZGl2PjwvZGl2PjwvZm9yZWlnbk9iamVjdD48L2c+PHBhdGggZD0iTSAxODYgMTAyIEwgMjUyIDEwMiBMIDI1MiAxMjcgTCAyOTUuNjMgMTI3IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgcG9pbnRlci1ldmVudHM9InN0cm9rZSIvPjxwYXRoIGQ9Ik0gMzAwLjg4IDEyNyBMIDI5My44OCAxMzAuNSBMIDI5NS42MyAxMjcgTCAyOTMuODggMTIzLjUgWiIgZmlsbD0iIzAwMDAwMCIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHBvaW50ZXItZXZlbnRzPSJhbGwiLz48cGF0aCBkPSJNIDQyIDEyMiBMIDc0IDgyIEwgMjAyIDgyIEwgMTcwIDEyMiBaIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgcG9pbnRlci1ldmVudHM9ImFsbCIvPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0wLjUgLTAuNSkiPjxmb3JlaWduT2JqZWN0IHN0eWxlPSJvdmVyZmxvdzogdmlzaWJsZTsgdGV4dC1hbGlnbjogbGVmdDsiIHBvaW50ZXItZXZlbnRzPSJub25lIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIj48ZGl2IHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sIiBzdHlsZT0iZGlzcGxheTogZmxleDsgYWxpZ24taXRlbXM6IHVuc2FmZSBjZW50ZXI7IGp1c3RpZnktY29udGVudDogdW5zYWZlIGNlbnRlcjsgd2lkdGg6IDE1OHB4OyBoZWlnaHQ6IDFweDsgcGFkZGluZy10b3A6IDEwMnB4OyBtYXJnaW4tbGVmdDogNDNweDsiPjxkaXYgc3R5bGU9ImJveC1zaXppbmc6IGJvcmRlci1ib3g7IGZvbnQtc2l6ZTogMDsgdGV4dC1hbGlnbjogY2VudGVyOyAiPjxkaXYgc3R5bGU9ImRpc3BsYXk6IGlubGluZS1ibG9jazsgZm9udC1zaXplOiAxMnB4OyBmb250LWZhbWlseTogSGVsdmV0aWNhOyBjb2xvcjogIzAwMDAwMDsgbGluZS1oZWlnaHQ6IDEuMjsgcG9pbnRlci1ldmVudHM6IGFsbDsgd2hpdGUtc3BhY2U6IG5vcm1hbDsgd29yZC13cmFwOiBub3JtYWw7ICI+VG9vbCBJbmZvcm1hdGlvbjwvZGl2PjwvZGl2PjwvZGl2PjwvZm9yZWlnbk9iamVjdD48L2c+PHBhdGggZD0iTSA2NDIgMjgyIEwgNjQyIDIyOC4zNyIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHBvaW50ZXItZXZlbnRzPSJzdHJva2UiLz48cGF0aCBkPSJNIDY0MiAyMjMuMTIgTCA2NDUuNSAyMzAuMTIgTCA2NDIgMjI4LjM3IEwgNjM4LjUgMjMwLjEyIFoiIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBwb2ludGVyLWV2ZW50cz0iYWxsIi8+PHBhdGggZD0iTSA3MjIgMzAyIEwgNzQyIDMwMiBMIDc0MiAzNjIgTCA3MjguMzcgMzYyIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgcG9pbnRlci1ldmVudHM9InN0cm9rZSIvPjxwYXRoIGQ9Ik0gNzIzLjEyIDM2MiBMIDczMC4xMiAzNTguNSBMIDcyOC4zNyAzNjIgTCA3MzAuMTIgMzY1LjUgWiIgZmlsbD0iIzAwMDAwMCIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHBvaW50ZXItZXZlbnRzPSJhbGwiLz48cGF0aCBkPSJNIDY0MiAyODIgTCA3MjIgMzAyIEwgNjQyIDMyMiBMIDU2MiAzMDIgWiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHBvaW50ZXItZXZlbnRzPSJhbGwiLz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMC41IC0wLjUpIj48Zm9yZWlnbk9iamVjdCBzdHlsZT0ib3ZlcmZsb3c6IHZpc2libGU7IHRleHQtYWxpZ246IGxlZnQ7IiBwb2ludGVyLWV2ZW50cz0ibm9uZSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSI+PGRpdiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCIgc3R5bGU9ImRpc3BsYXk6IGZsZXg7IGFsaWduLWl0ZW1zOiB1bnNhZmUgY2VudGVyOyBqdXN0aWZ5LWNvbnRlbnQ6IHVuc2FmZSBjZW50ZXI7IHdpZHRoOiAxNThweDsgaGVpZ2h0OiAxcHg7IHBhZGRpbmctdG9wOiAzMDJweDsgbWFyZ2luLWxlZnQ6IDU2M3B4OyI+PGRpdiBzdHlsZT0iYm94LXNpemluZzogYm9yZGVyLWJveDsgZm9udC1zaXplOiAwOyB0ZXh0LWFsaWduOiBjZW50ZXI7ICI+PGRpdiBzdHlsZT0iZGlzcGxheTogaW5saW5lLWJsb2NrOyBmb250LXNpemU6IDEycHg7IGZvbnQtZmFtaWx5OiBIZWx2ZXRpY2E7IGNvbG9yOiAjMDAwMDAwOyBsaW5lLWhlaWdodDogMS4yOyBwb2ludGVyLWV2ZW50czogYWxsOyB3aGl0ZS1zcGFjZTogbm9ybWFsOyB3b3JkLXdyYXA6IG5vcm1hbDsgIj5XaGV0aGVyIHRvIENhbGwgYSBUb29sPC9kaXY+PC9kaXY+PC9kaXY+PC9mb3JlaWduT2JqZWN0PjwvZz48cmVjdCB4PSI2NDIiIHk9IjI0MiIgd2lkdGg9IjQwIiBoZWlnaHQ9IjIwIiBmaWxsPSJub25lIiBzdHJva2U9Im5vbmUiIHBvaW50ZXItZXZlbnRzPSJhbGwiLz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMC41IC0wLjUpIj48Zm9yZWlnbk9iamVjdCBzdHlsZT0ib3ZlcmZsb3c6IHZpc2libGU7IHRleHQtYWxpZ246IGxlZnQ7IiBwb2ludGVyLWV2ZW50cz0ibm9uZSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSI+PGRpdiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCIgc3R5bGU9ImRpc3BsYXk6IGZsZXg7IGFsaWduLWl0ZW1zOiB1bnNhZmUgY2VudGVyOyBqdXN0aWZ5LWNvbnRlbnQ6IHVuc2FmZSBjZW50ZXI7IHdpZHRoOiAxcHg7IGhlaWdodDogMXB4OyBwYWRkaW5nLXRvcDogMjUycHg7IG1hcmdpbi1sZWZ0OiA2NjJweDsiPjxkaXYgc3R5bGU9ImJveC1zaXppbmc6IGJvcmRlci1ib3g7IGZvbnQtc2l6ZTogMDsgdGV4dC1hbGlnbjogY2VudGVyOyAiPjxkaXYgc3R5bGU9ImRpc3BsYXk6IGlubGluZS1ibG9jazsgZm9udC1zaXplOiAxMnB4OyBmb250LWZhbWlseTogSGVsdmV0aWNhOyBjb2xvcjogIzAwMDAwMDsgbGluZS1oZWlnaHQ6IDEuMjsgcG9pbnRlci1ldmVudHM6IGFsbDsgd2hpdGUtc3BhY2U6IG5vd3JhcDsgIj5ZZXM8L2Rpdj48L2Rpdj48L2Rpdj48L2ZvcmVpZ25PYmplY3Q+PC9nPjxyZWN0IHg9IjcxMiIgeT0iMTIyIiB3aWR0aD0iNDAiIGhlaWdodD0iMjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0ibm9uZSIgcG9pbnRlci1ldmVudHM9ImFsbCIvPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0wLjUgLTAuNSkiPjxmb3JlaWduT2JqZWN0IHN0eWxlPSJvdmVyZmxvdzogdmlzaWJsZTsgdGV4dC1hbGlnbjogbGVmdDsiIHBvaW50ZXItZXZlbnRzPSJub25lIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIj48ZGl2IHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sIiBzdHlsZT0iZGlzcGxheTogZmxleDsgYWxpZ24taXRlbXM6IHVuc2FmZSBjZW50ZXI7IGp1c3RpZnktY29udGVudDogdW5zYWZlIGNlbnRlcjsgd2lkdGg6IDFweDsgaGVpZ2h0OiAxcHg7IHBhZGRpbmctdG9wOiAxMzJweDsgbWFyZ2luLWxlZnQ6IDczMnB4OyI+PGRpdiBzdHlsZT0iYm94LXNpemluZzogYm9yZGVyLWJveDsgZm9udC1zaXplOiAwOyB0ZXh0LWFsaWduOiBjZW50ZXI7ICI+PGRpdiBzdHlsZT0iZGlzcGxheTogaW5saW5lLWJsb2NrOyBmb250LXNpemU6IDEycHg7IGZvbnQtZmFtaWx5OiBIZWx2ZXRpY2E7IGNvbG9yOiAjMDAwMDAwOyBsaW5lLWhlaWdodDogMS4yOyBwb2ludGVyLWV2ZW50czogYWxsOyB3aGl0ZS1zcGFjZTogbm93cmFwOyAiPk5vPC9kaXY+PC9kaXY+PC9kaXY+PC9mb3JlaWduT2JqZWN0PjwvZz48cmVjdCB4PSI3MDIiIHk9IjI3MiIgd2lkdGg9IjQwIiBoZWlnaHQ9IjIwIiBmaWxsPSJub25lIiBzdHJva2U9Im5vbmUiIHBvaW50ZXItZXZlbnRzPSJhbGwiLz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMC41IC0wLjUpIj48Zm9yZWlnbk9iamVjdCBzdHlsZT0ib3ZlcmZsb3c6IHZpc2libGU7IHRleHQtYWxpZ246IGxlZnQ7IiBwb2ludGVyLWV2ZW50cz0ibm9uZSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSI+PGRpdiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCIgc3R5bGU9ImRpc3BsYXk6IGZsZXg7IGFsaWduLWl0ZW1zOiB1bnNhZmUgY2VudGVyOyBqdXN0aWZ5LWNvbnRlbnQ6IHVuc2FmZSBjZW50ZXI7IHdpZHRoOiAxcHg7IGhlaWdodDogMXB4OyBwYWRkaW5nLXRvcDogMjgycHg7IG1hcmdpbi1sZWZ0OiA3MjJweDsiPjxkaXYgc3R5bGU9ImJveC1zaXppbmc6IGJvcmRlci1ib3g7IGZvbnQtc2l6ZTogMDsgdGV4dC1hbGlnbjogY2VudGVyOyAiPjxkaXYgc3R5bGU9ImRpc3BsYXk6IGlubGluZS1ibG9jazsgZm9udC1zaXplOiAxMnB4OyBmb250LWZhbWlseTogSGVsdmV0aWNhOyBjb2xvcjogIzAwMDAwMDsgbGluZS1oZWlnaHQ6IDEuMjsgcG9pbnRlci1ldmVudHM6IGFsbDsgd2hpdGUtc3BhY2U6IG5vd3JhcDsgIj5ObzwvZGl2PjwvZGl2PjwvZGl2PjwvZm9yZWlnbk9iamVjdD48L2c+PC9nPjwvc3ZnPg==" from="flow-chart" payload="{&quot;data&quot;:{&quot;mxGraphModel&quot;:{&quot;dx&quot;:&quot;2066&quot;,&quot;dy&quot;:&quot;1157&quot;,&quot;grid&quot;:&quot;1&quot;,&quot;gridSize&quot;:&quot;10&quot;,&quot;guides&quot;:&quot;1&quot;,&quot;tooltips&quot;:&quot;1&quot;,&quot;connect&quot;:&quot;1&quot;,&quot;arrows&quot;:&quot;1&quot;,&quot;fold&quot;:&quot;1&quot;,&quot;page&quot;:&quot;1&quot;,&quot;pageScale&quot;:&quot;1&quot;,&quot;pageWidth&quot;:&quot;827&quot;,&quot;pageHeight&quot;:&quot;1169&quot;},&quot;mxCellMap&quot;:{&quot;qjiNImIL&quot;:{&quot;id&quot;:&quot;qjiNImIL&quot;},&quot;JshK4DVV&quot;:{&quot;id&quot;:&quot;JshK4DVV&quot;,&quot;parent&quot;:&quot;qjiNImIL&quot;},&quot;ALwC5ZBF&quot;:{&quot;id&quot;:&quot;ALwC5ZBF&quot;,&quot;value&quot;:&quot;Tools<h3 style=\&quot;-webkit-font-smoothing:antialiased;box-sizing:border-box;-webkit-tap-highlight-color:rgba(0, 0, 0, 0);border:0px solid;margin-right:0px;margin-left:0px;padding-top:0px;padding-right:0px;padding-left:0px;line-height:28px;overflow-anchor:auto;font-family:Inter, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, &quot;SF Pro SC&quot;, &quot;SF Pro Display&quot;, &quot;SF Pro Icons&quot;, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;text-align:start;background-color:rgb(255, 255, 255);margin-top:0px !important;margin-bottom:12px !important;padding-bottom:0px !important\&quot;></h3>&quot;,&quot;style&quot;:&quot;rounded=0;whiteSpace=wrap;html=1;verticalAlign=top;fillColor=none;dashed=1;&quot;,&quot;parent&quot;:&quot;JshK4DVV&quot;,&quot;vertex&quot;:&quot;1&quot;,&quot;diagramName&quot;:&quot;Rectangle&quot;,&quot;diagramCategory&quot;:&quot;general&quot;,&quot;-0-mxGeometry&quot;:{&quot;x&quot;:&quot;60&quot;,&quot;y&quot;:&quot;120&quot;,&quot;width&quot;:&quot;240&quot;,&quot;height&quot;:&quot;440&quot;,&quot;as&quot;:&quot;geometry&quot;}},&quot;JJvTNGGv&quot;:{&quot;id&quot;:&quot;JJvTNGGv&quot;,&quot;value&quot;:&quot;Program<h3 style=\&quot;-webkit-font-smoothing:antialiased;box-sizing:border-box;-webkit-tap-highlight-color:rgba(0, 0, 0, 0);border:0px solid;margin-top:28px;margin-right:0px;margin-left:0px;padding-top:0px;padding-right:0px;padding-left:0px;font-size:18px;line-height:28px;overflow-anchor:auto;font-family:Inter, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, &quot;SF Pro SC&quot;, &quot;SF Pro Display&quot;, &quot;SF Pro Icons&quot;, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;text-align:start;background-color:rgb(255, 255, 255);margin-bottom:12px !important;padding-bottom:0px !important\&quot;></h3><h3 style=\&quot;-webkit-font-smoothing:antialiased;box-sizing:border-box;-webkit-tap-highlight-color:rgba(0, 0, 0, 0);border:0px solid;margin-top:28px;margin-right:0px;margin-left:0px;padding-top:0px;padding-right:0px;padding-left:0px;font-size:18px;line-height:28px;overflow-anchor:auto;font-family:Inter, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, &quot;SF Pro SC&quot;, &quot;SF Pro Display&quot;, &quot;SF Pro Icons&quot;, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;text-align:start;background-color:rgb(255, 255, 255);margin-bottom:12px !important;padding-bottom:0px !important\&quot;></h3>&quot;,&quot;style&quot;:&quot;rounded=0;whiteSpace=wrap;html=1;verticalAlign=top;fillColor=none;dashed=1;&quot;,&quot;parent&quot;:&quot;JshK4DVV&quot;,&quot;vertex&quot;:&quot;1&quot;,&quot;diagramName&quot;:&quot;Rectangle&quot;,&quot;diagramCategory&quot;:&quot;general&quot;,&quot;-0-mxGeometry&quot;:{&quot;x&quot;:&quot;320&quot;,&quot;y&quot;:&quot;120&quot;,&quot;width&quot;:&quot;240&quot;,&quot;height&quot;:&quot;440&quot;,&quot;as&quot;:&quot;geometry&quot;}},&quot;HerNl4Am&quot;:{&quot;id&quot;:&quot;HerNl4Am&quot;,&quot;value&quot;:&quot;Model&quot;,&quot;style&quot;:&quot;rounded=0;whiteSpace=wrap;html=1;verticalAlign=top;fillColor=none;dashed=1;&quot;,&quot;parent&quot;:&quot;JshK4DVV&quot;,&quot;vertex&quot;:&quot;1&quot;,&quot;diagramName&quot;:&quot;Rectangle&quot;,&quot;diagramCategory&quot;:&quot;general&quot;,&quot;-0-mxGeometry&quot;:{&quot;x&quot;:&quot;580&quot;,&quot;y&quot;:&quot;120&quot;,&quot;width&quot;:&quot;240&quot;,&quot;height&quot;:&quot;440&quot;,&quot;as&quot;:&quot;geometry&quot;}},&quot;AzImFBqq&quot;:{&quot;id&quot;:&quot;AzImFBqq&quot;,&quot;style&quot;:&quot;edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;&quot;,&quot;parent&quot;:&quot;JshK4DVV&quot;,&quot;source&quot;:&quot;1tnUQpLf&quot;,&quot;target&quot;:&quot;a4ttJ9li&quot;,&quot;edge&quot;:&quot;1&quot;,&quot;-0-mxGeometry&quot;:{&quot;relative&quot;:&quot;1&quot;,&quot;as&quot;:&quot;geometry&quot;}},&quot;1tnUQpLf&quot;:{&quot;id&quot;:&quot;1tnUQpLf&quot;,&quot;value&quot;:&quot;Receive User's Question&quot;,&quot;style&quot;:&quot;rounded=1;whiteSpace=wrap;html=1;fillColor=none;arcSize=50;&quot;,&quot;parent&quot;:&quot;JshK4DVV&quot;,&quot;vertex&quot;:&quot;1&quot;,&quot;diagramName&quot;:&quot;RoundedRectangle&quot;,&quot;diagramCategory&quot;:&quot;general&quot;,&quot;-0-mxGeometry&quot;:{&quot;x&quot;:&quot;360&quot;,&quot;y&quot;:&quot;160&quot;,&quot;width&quot;:&quot;160&quot;,&quot;height&quot;:&quot;40&quot;,&quot;as&quot;:&quot;geometry&quot;}},&quot;Rz0Vnx00&quot;:{&quot;id&quot;:&quot;Rz0Vnx00&quot;,&quot;style&quot;:&quot;edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;entryX=0;entryY=0.5;entryDx=0;entryDy=0;exitX=1;exitY=0.5;exitDx=0;exitDy=0;&quot;,&quot;parent&quot;:&quot;JshK4DVV&quot;,&quot;source&quot;:&quot;a4ttJ9li&quot;,&quot;target&quot;:&quot;kQtnq2G9&quot;,&quot;edge&quot;:&quot;1&quot;,&quot;-0-mxGeometry&quot;:{&quot;relative&quot;:&quot;1&quot;,&quot;as&quot;:&quot;geometry&quot;,&quot;-0-mxPoint&quot;:{&quot;x&quot;:&quot;620&quot;,&quot;y&quot;:&quot;260&quot;,&quot;as&quot;:&quot;targetPoint&quot;},&quot;-1-Array&quot;:{&quot;as&quot;:&quot;points&quot;,&quot;-0-mxPoint&quot;:{&quot;x&quot;:&quot;520&quot;,&quot;y&quot;:&quot;240&quot;},&quot;-1-mxPoint&quot;:{&quot;x&quot;:&quot;570&quot;,&quot;y&quot;:&quot;240&quot;},&quot;-2-mxPoint&quot;:{&quot;x&quot;:&quot;570&quot;,&quot;y&quot;:&quot;245&quot;}}}},&quot;a4ttJ9li&quot;:{&quot;id&quot;:&quot;a4ttJ9li&quot;,&quot;value&quot;:&quot; Initiate Model Call (Tools field + original user question) &quot;,&quot;style&quot;:&quot;rounded=1;whiteSpace=wrap;html=1;fillColor=none;arcSize=0;&quot;,&quot;parent&quot;:&quot;JshK4DVV&quot;,&quot;vertex&quot;:&quot;1&quot;,&quot;diagramName&quot;:&quot;RoundedRectangle&quot;,&quot;diagramCategory&quot;:&quot;general&quot;,&quot;-0-mxGeometry&quot;:{&quot;x&quot;:&quot;360&quot;,&quot;y&quot;:&quot;220&quot;,&quot;width&quot;:&quot;160&quot;,&quot;height&quot;:&quot;50&quot;,&quot;as&quot;:&quot;geometry&quot;}},&quot;ipVMooqw&quot;:{&quot;id&quot;:&quot;ipVMooqw&quot;,&quot;value&quot;:&quot;&quot;,&quot;style&quot;:&quot;edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;entryX=0.5;entryY=0;entryDx=0;entryDy=0;&quot;,&quot;parent&quot;:&quot;JshK4DVV&quot;,&quot;source&quot;:&quot;kQtnq2G9&quot;,&quot;target&quot;:&quot;V80viOhd&quot;,&quot;edge&quot;:&quot;1&quot;,&quot;-0-mxGeometry&quot;:{&quot;relative&quot;:&quot;1&quot;,&quot;as&quot;:&quot;geometry&quot;,&quot;-0-mxPoint&quot;:{&quot;x&quot;:&quot;700&quot;,&quot;y&quot;:&quot;400&quot;,&quot;as&quot;:&quot;targetPoint&quot;}}},&quot;egs1h4iP&quot;:{&quot;id&quot;:&quot;egs1h4iP&quot;,&quot;style&quot;:&quot;edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;entryX=1;entryY=0.5;entryDx=0;entryDy=0;exitX=1;exitY=0.5;exitDx=0;exitDy=0;&quot;,&quot;parent&quot;:&quot;JshK4DVV&quot;,&quot;source&quot;:&quot;kQtnq2G9&quot;,&quot;target&quot;:&quot;SnIyUNHO&quot;,&quot;edge&quot;:&quot;1&quot;,&quot;-0-mxGeometry&quot;:{&quot;relative&quot;:&quot;1&quot;,&quot;as&quot;:&quot;geometry&quot;}},&quot;kQtnq2G9&quot;:{&quot;id&quot;:&quot;kQtnq2G9&quot;,&quot;value&quot;:&quot;Whether to Call a Tool &quot;,&quot;style&quot;:&quot;rhombus;whiteSpace=wrap;html=1;fillColor=none;&quot;,&quot;parent&quot;:&quot;JshK4DVV&quot;,&quot;vertex&quot;:&quot;1&quot;,&quot;diagramName&quot;:&quot;Diamond&quot;,&quot;diagramCategory&quot;:&quot;general&quot;,&quot;-0-mxGeometry&quot;:{&quot;x&quot;:&quot;620&quot;,&quot;y&quot;:&quot;225&quot;,&quot;width&quot;:&quot;160&quot;,&quot;height&quot;:&quot;40&quot;,&quot;as&quot;:&quot;geometry&quot;}},&quot;3fGUT9DD&quot;:{&quot;id&quot;:&quot;3fGUT9DD&quot;,&quot;style&quot;:&quot;edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;entryX=1;entryY=0.5;entryDx=0;entryDy=0;&quot;,&quot;parent&quot;:&quot;JshK4DVV&quot;,&quot;source&quot;:&quot;V80viOhd&quot;,&quot;target&quot;:&quot;jc1g9pHF&quot;,&quot;edge&quot;:&quot;1&quot;,&quot;-0-mxGeometry&quot;:{&quot;relative&quot;:&quot;1&quot;,&quot;as&quot;:&quot;geometry&quot;}},&quot;V80viOhd&quot;:{&quot;id&quot;:&quot;V80viOhd&quot;,&quot;value&quot;:&quot;Output Tool Name and Parameters&quot;,&quot;style&quot;:&quot;rounded=1;whiteSpace=wrap;html=1;fillColor=none;arcSize=0;&quot;,&quot;parent&quot;:&quot;JshK4DVV&quot;,&quot;vertex&quot;:&quot;1&quot;,&quot;diagramName&quot;:&quot;RoundedRectangle&quot;,&quot;diagramCategory&quot;:&quot;general&quot;,&quot;-0-mxGeometry&quot;:{&quot;x&quot;:&quot;620&quot;,&quot;y&quot;:&quot;300&quot;,&quot;width&quot;:&quot;160&quot;,&quot;height&quot;:&quot;40&quot;,&quot;as&quot;:&quot;geometry&quot;}},&quot;adkWaAlq&quot;:{&quot;id&quot;:&quot;adkWaAlq&quot;,&quot;value&quot;:&quot;Yes&quot;,&quot;style&quot;:&quot;text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;&quot;,&quot;parent&quot;:&quot;JshK4DVV&quot;,&quot;vertex&quot;:&quot;1&quot;,&quot;-0-mxGeometry&quot;:{&quot;x&quot;:&quot;700&quot;,&quot;y&quot;:&quot;281&quot;,&quot;width&quot;:&quot;40&quot;,&quot;height&quot;:&quot;20&quot;,&quot;as&quot;:&quot;geometry&quot;}},&quot;txJ7EXgl&quot;:{&quot;id&quot;:&quot;txJ7EXgl&quot;,&quot;style&quot;:&quot;edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;entryX=1;entryY=0.5;entryDx=0;entryDy=0;exitX=0.5;exitY=1;exitDx=0;exitDy=0;&quot;,&quot;parent&quot;:&quot;JshK4DVV&quot;,&quot;source&quot;:&quot;SnIyUNHO&quot;,&quot;target&quot;:&quot;jqaGcsh4&quot;,&quot;edge&quot;:&quot;1&quot;,&quot;-0-mxGeometry&quot;:{&quot;relative&quot;:&quot;1&quot;,&quot;as&quot;:&quot;geometry&quot;}},&quot;SnIyUNHO&quot;:{&quot;id&quot;:&quot;SnIyUNHO&quot;,&quot;value&quot;:&quot;Generate Question Answer&quot;,&quot;style&quot;:&quot;rounded=1;whiteSpace=wrap;html=1;fillColor=none;arcSize=0;&quot;,&quot;parent&quot;:&quot;JshK4DVV&quot;,&quot;vertex&quot;:&quot;1&quot;,&quot;diagramName&quot;:&quot;RoundedRectangle&quot;,&quot;diagramCategory&quot;:&quot;general&quot;,&quot;-0-mxGeometry&quot;:{&quot;x&quot;:&quot;620&quot;,&quot;y&quot;:&quot;460&quot;,&quot;width&quot;:&quot;160&quot;,&quot;height&quot;:&quot;40&quot;,&quot;as&quot;:&quot;geometry&quot;}},&quot;dcianNJl&quot;:{&quot;id&quot;:&quot;dcianNJl&quot;,&quot;style&quot;:&quot;edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;entryX=1;entryY=0.5;entryDx=0;entryDy=0;&quot;,&quot;parent&quot;:&quot;JshK4DVV&quot;,&quot;source&quot;:&quot;jc1g9pHF&quot;,&quot;target&quot;:&quot;yump7Jj5&quot;,&quot;edge&quot;:&quot;1&quot;,&quot;-0-mxGeometry&quot;:{&quot;relative&quot;:&quot;1&quot;,&quot;as&quot;:&quot;geometry&quot;}},&quot;jc1g9pHF&quot;:{&quot;id&quot;:&quot;jc1g9pHF&quot;,&quot;value&quot;:&quot;Parse Returned Information and Initiate Tool Call &quot;,&quot;style&quot;:&quot;rounded=1;whiteSpace=wrap;html=1;fillColor=none;arcSize=0;&quot;,&quot;parent&quot;:&quot;JshK4DVV&quot;,&quot;vertex&quot;:&quot;1&quot;,&quot;diagramName&quot;:&quot;RoundedRectangle&quot;,&quot;diagramCategory&quot;:&quot;general&quot;,&quot;-0-mxGeometry&quot;:{&quot;x&quot;:&quot;360&quot;,&quot;y&quot;:&quot;320&quot;,&quot;width&quot;:&quot;160&quot;,&quot;height&quot;:&quot;40&quot;,&quot;as&quot;:&quot;geometry&quot;}},&quot;QRs31Xv7&quot;:{&quot;id&quot;:&quot;QRs31Xv7&quot;,&quot;style&quot;:&quot;edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;entryX=0;entryY=0.5;entryDx=0;entryDy=0;exitX=0.5;exitY=1;exitDx=0;exitDy=0;&quot;,&quot;parent&quot;:&quot;JshK4DVV&quot;,&quot;source&quot;:&quot;yump7Jj5&quot;,&quot;target&quot;:&quot;MikdKlim&quot;,&quot;edge&quot;:&quot;1&quot;,&quot;-0-mxGeometry&quot;:{&quot;relative&quot;:&quot;1&quot;,&quot;as&quot;:&quot;geometry&quot;}},&quot;yump7Jj5&quot;:{&quot;id&quot;:&quot;yump7Jj5&quot;,&quot;value&quot;:&quot;Complete Request and Return Information&quot;,&quot;style&quot;:&quot;rounded=1;whiteSpace=wrap;html=1;fillColor=none;arcSize=0;&quot;,&quot;parent&quot;:&quot;JshK4DVV&quot;,&quot;vertex&quot;:&quot;1&quot;,&quot;diagramName&quot;:&quot;RoundedRectangle&quot;,&quot;diagramCategory&quot;:&quot;general&quot;,&quot;-0-mxGeometry&quot;:{&quot;x&quot;:&quot;100&quot;,&quot;y&quot;:&quot;340&quot;,&quot;width&quot;:&quot;160&quot;,&quot;height&quot;:&quot;40&quot;,&quot;as&quot;:&quot;geometry&quot;}},&quot;pvM7y1Qi&quot;:{&quot;id&quot;:&quot;pvM7y1Qi&quot;,&quot;style&quot;:&quot;edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;entryX=0;entryY=0.5;entryDx=0;entryDy=0;exitX=1;exitY=0.5;exitDx=0;exitDy=0;&quot;,&quot;parent&quot;:&quot;JshK4DVV&quot;,&quot;source&quot;:&quot;MikdKlim&quot;,&quot;target&quot;:&quot;P1lA33A0&quot;,&quot;edge&quot;:&quot;1&quot;,&quot;-0-mxGeometry&quot;:{&quot;relative&quot;:&quot;1&quot;,&quot;as&quot;:&quot;geometry&quot;}},&quot;MikdKlim&quot;:{&quot;id&quot;:&quot;MikdKlim&quot;,&quot;value&quot;:&quot;Initiate Model Call (original user question + tool return result) &quot;,&quot;style&quot;:&quot;rounded=1;whiteSpace=wrap;html=1;fillColor=none;arcSize=0;&quot;,&quot;parent&quot;:&quot;JshK4DVV&quot;,&quot;vertex&quot;:&quot;1&quot;,&quot;diagramName&quot;:&quot;RoundedRectangle&quot;,&quot;diagramCategory&quot;:&quot;general&quot;,&quot;-0-mxGeometry&quot;:{&quot;x&quot;:&quot;360&quot;,&quot;y&quot;:&quot;390&quot;,&quot;width&quot;:&quot;160&quot;,&quot;height&quot;:&quot;60&quot;,&quot;as&quot;:&quot;geometry&quot;}},&quot;jqaGcsh4&quot;:{&quot;id&quot;:&quot;jqaGcsh4&quot;,&quot;value&quot;:&quot;Return Model's Answer&quot;,&quot;style&quot;:&quot;rounded=1;whiteSpace=wrap;html=1;fillColor=none;arcSize=50;&quot;,&quot;parent&quot;:&quot;JshK4DVV&quot;,&quot;vertex&quot;:&quot;1&quot;,&quot;diagramName&quot;:&quot;RoundedRectangle&quot;,&quot;diagramCategory&quot;:&quot;general&quot;,&quot;-0-mxGeometry&quot;:{&quot;x&quot;:&quot;360&quot;,&quot;y&quot;:&quot;500&quot;,&quot;width&quot;:&quot;160&quot;,&quot;height&quot;:&quot;40&quot;,&quot;as&quot;:&quot;geometry&quot;}},&quot;pbEfD5m8&quot;:{&quot;id&quot;:&quot;pbEfD5m8&quot;,&quot;style&quot;:&quot;edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;entryX=0;entryY=0.5;entryDx=0;entryDy=0;&quot;,&quot;parent&quot;:&quot;JshK4DVV&quot;,&quot;source&quot;:&quot;xunMzPAw&quot;,&quot;target&quot;:&quot;a4ttJ9li&quot;,&quot;edge&quot;:&quot;1&quot;,&quot;-0-mxGeometry&quot;:{&quot;relative&quot;:&quot;1&quot;,&quot;as&quot;:&quot;geometry&quot;}},&quot;xunMzPAw&quot;:{&quot;id&quot;:&quot;xunMzPAw&quot;,&quot;value&quot;:&quot;Tool Information&quot;,&quot;style&quot;:&quot;shape=parallelogram;perimeter=parallelogramPerimeter;whiteSpace=wrap;html=1;fillColor=none;&quot;,&quot;parent&quot;:&quot;JshK4DVV&quot;,&quot;vertex&quot;:&quot;1&quot;,&quot;diagramName&quot;:&quot;Parallelogram&quot;,&quot;diagramCategory&quot;:&quot;general&quot;,&quot;-0-mxGeometry&quot;:{&quot;x&quot;:&quot;100&quot;,&quot;y&quot;:&quot;200&quot;,&quot;width&quot;:&quot;160&quot;,&quot;height&quot;:&quot;40&quot;,&quot;as&quot;:&quot;geometry&quot;}},&quot;6p0yqPY1&quot;:{&quot;id&quot;:&quot;6p0yqPY1&quot;,&quot;style&quot;:&quot;edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;entryX=0.5;entryY=1;entryDx=0;entryDy=0;&quot;,&quot;parent&quot;:&quot;JshK4DVV&quot;,&quot;source&quot;:&quot;P1lA33A0&quot;,&quot;target&quot;:&quot;V80viOhd&quot;,&quot;edge&quot;:&quot;1&quot;,&quot;-0-mxGeometry&quot;:{&quot;relative&quot;:&quot;1&quot;,&quot;as&quot;:&quot;geometry&quot;}},&quot;jyyqNEWR&quot;:{&quot;id&quot;:&quot;jyyqNEWR&quot;,&quot;style&quot;:&quot;edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;entryX=1;entryY=0.5;entryDx=0;entryDy=0;exitX=1;exitY=0.5;exitDx=0;exitDy=0;&quot;,&quot;parent&quot;:&quot;JshK4DVV&quot;,&quot;source&quot;:&quot;P1lA33A0&quot;,&quot;target&quot;:&quot;SnIyUNHO&quot;,&quot;edge&quot;:&quot;1&quot;,&quot;-0-mxGeometry&quot;:{&quot;relative&quot;:&quot;1&quot;,&quot;as&quot;:&quot;geometry&quot;}},&quot;P1lA33A0&quot;:{&quot;id&quot;:&quot;P1lA33A0&quot;,&quot;value&quot;:&quot;Whether to Call a Tool&quot;,&quot;style&quot;:&quot;rhombus;whiteSpace=wrap;html=1;fillColor=none;&quot;,&quot;parent&quot;:&quot;JshK4DVV&quot;,&quot;vertex&quot;:&quot;1&quot;,&quot;diagramName&quot;:&quot;Diamond&quot;,&quot;diagramCategory&quot;:&quot;general&quot;,&quot;-0-mxGeometry&quot;:{&quot;x&quot;:&quot;620&quot;,&quot;y&quot;:&quot;400&quot;,&quot;width&quot;:&quot;160&quot;,&quot;height&quot;:&quot;40&quot;,&quot;as&quot;:&quot;geometry&quot;}},&quot;hBl2D1xZ&quot;:{&quot;id&quot;:&quot;hBl2D1xZ&quot;,&quot;value&quot;:&quot;Yes&quot;,&quot;style&quot;:&quot;text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;&quot;,&quot;parent&quot;:&quot;JshK4DVV&quot;,&quot;vertex&quot;:&quot;1&quot;,&quot;-0-mxGeometry&quot;:{&quot;x&quot;:&quot;700&quot;,&quot;y&quot;:&quot;360&quot;,&quot;width&quot;:&quot;40&quot;,&quot;height&quot;:&quot;20&quot;,&quot;as&quot;:&quot;geometry&quot;}},&quot;de50YbNh&quot;:{&quot;id&quot;:&quot;de50YbNh&quot;,&quot;value&quot;:&quot;No&quot;,&quot;style&quot;:&quot;text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;&quot;,&quot;parent&quot;:&quot;JshK4DVV&quot;,&quot;vertex&quot;:&quot;1&quot;,&quot;-0-mxGeometry&quot;:{&quot;x&quot;:&quot;770&quot;,&quot;y&quot;:&quot;240&quot;,&quot;width&quot;:&quot;40&quot;,&quot;height&quot;:&quot;20&quot;,&quot;as&quot;:&quot;geometry&quot;}},&quot;8DogO6fS&quot;:{&quot;id&quot;:&quot;8DogO6fS&quot;,&quot;value&quot;:&quot;No&quot;,&quot;style&quot;:&quot;text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;&quot;,&quot;parent&quot;:&quot;JshK4DVV&quot;,&quot;vertex&quot;:&quot;1&quot;,&quot;-0-mxGeometry&quot;:{&quot;x&quot;:&quot;760&quot;,&quot;y&quot;:&quot;390&quot;,&quot;width&quot;:&quot;40&quot;,&quot;height&quot;:&quot;20&quot;,&quot;as&quot;:&quot;geometry&quot;}}},&quot;mxCellList&quot;:[&quot;qjiNImIL&quot;,&quot;JshK4DVV&quot;,&quot;ALwC5ZBF&quot;,&quot;JJvTNGGv&quot;,&quot;HerNl4Am&quot;,&quot;AzImFBqq&quot;,&quot;1tnUQpLf&quot;,&quot;Rz0Vnx00&quot;,&quot;a4ttJ9li&quot;,&quot;ipVMooqw&quot;,&quot;egs1h4iP&quot;,&quot;kQtnq2G9&quot;,&quot;3fGUT9DD&quot;,&quot;V80viOhd&quot;,&quot;adkWaAlq&quot;,&quot;txJ7EXgl&quot;,&quot;SnIyUNHO&quot;,&quot;dcianNJl&quot;,&quot;jc1g9pHF&quot;,&quot;QRs31Xv7&quot;,&quot;yump7Jj5&quot;,&quot;pvM7y1Qi&quot;,&quot;MikdKlim&quot;,&quot;jqaGcsh4&quot;,&quot;pbEfD5m8&quot;,&quot;xunMzPAw&quot;,&quot;6p0yqPY1&quot;,&quot;jyyqNEWR&quot;,&quot;P1lA33A0&quot;,&quot;hBl2D1xZ&quot;,&quot;de50YbNh&quot;,&quot;8DogO6fS&quot;]},&quot;lastEditTime&quot;:0,&quot;snapshot&quot;:&quot;&quot;}" />

<span id="116e81cb"></span>

## Model selection

For models that support function calling, refer to [Function Calling](/docs/ModelArk/1330310#c2b5b30b).
<span id="45418967"></span>

## Tutorial

<span id="510a844f"></span>

### Environment preparation

Before calling a ModelArk model, obtain an API key and configure it in the environment variable for authentication. If you call the model through the official SDK of BytePlus or the OpenAI SDK, install the corresponding SDK in advance. ModelArk provides SDKs in Go, Python, and Java for quick integration.
For details, refer to the following documents and steps:

- [1. Obtaining and Configuring API Key](/docs/ModelArk/1399008#b00dee71)
- [3. Configure the environment and initiate a call](/docs/ModelArk/1399008#99a7c9ca)

- [Obtain an API key](https://console.byteplus.com/ark/apiKey)
- [Enable the model service](https://console.byteplus.com/ark/openManagement)
- Obtain the required Model ID from [Model List](/docs/ModelArk/1330310)

<span id="db7321a0"></span>

### Steps

<span id="4bf7add8"></span>

#### Step 1: Define tools

Use the `tools` field to describe available tools in JSON format to models, including information such as name, description, and parameter definitions.
**Define the tool functions**

```Python
def get_current_weather(location, unit="celsius"):
    # Call the weather API.
    # Example weather data is returned for demonstration purposes.
    return f"{location} today the weather is sunny, temperature 25 {unit}."
```

- In the above example, we defined a tool function named `get_current_weather` in the code to obtain the weather information of a specified location.
  - `location`: The location to query for weather information. (required)
  - `unit`: The temperature unit (optional). Defaults to `Celsius`
- The example function only returns simulated weather data. To obtain real-time weather data, you must call a weather API.

**Define the 'tools' field**

```Python
{
  "type": "function",
  "function": {
    "name": "get_current_weather",
    "description": "Get the weather information of the specified location, supporting two units: Celsius and Fahrenheit",
    "parameters": {
      "type": "object",
      "properties": {
        "location": {
          "type": "string",
          "description": "Location information, e.g., Beijing, Shanghai"
        },
        "unit": {
          "type": "string",
          "enum": ["Celsius", "Fahrenheit"],
          "description": "Temperature unit, optional values are Celsius or Fahrenheit"
        }
      },
      "required": ["location"]
    }
  }
}
```

- `tools`: A list where each of its elements represents a tool. In the example above, we defined a tool named `get_current_weather`.
- `type`: The type of the tool. Use`function` to indicate that the tool is for function calling.
- `function`: Details of the tool, such as its name, description, and parameters.
  - `name`: The name of the tool. This example uses `get_current_weather`.
  - `description`: The description of the tool. The tool used in this example is intended to obtain the weather information of a specified location.
  - `parameters`: The parameters the tool needs. The weather tool requires an object containing two properties: `location` and `unit`
    - `location`: A string that indicates the location.
    - `unit`: A string that indicates the temperature unit. Valid values: `Celsius` and `Fahrenheit`
    - `required`: Specifies the required parameters. In this case, only `location` is required.

For more information about how to define parameters, refer to [Appendix 1: Tool construction specifications](/docs/ModelArk/1262342#4d571c97).
<span id="5bc0af5c"></span>

#### Step 2: Initiate a model request

Include user questions and tool definitions in the request. The model returns tools to call and their parameters as needed.

```Python
from byteplussdkarkruntime import Ark

# Obtain your API key from the environment variable.
api_key = os.getenv('ARK_API_KEY')
# Initialize a ModelArk client.
client = Ark(
    api_key = api_key,
    base_url="https://ark.ap-southeast.bytepluses.com/api/v3"
)

messages = [
    {"role": "user", "content": "What's the weather like in Beijing today?"}
]
tools = [
    {
        //Refer to the tools defined in step 1
    }
]
//Initiate model request
completion = client.chat.completions.create(
    # Enter your inference endpoint ID.
    # Replace <MODEL> with your model ID.
    model="<MODEL>",
    messages=messages,
    tools=tools
)
```

<span id="7532befc"></span>

#### Step 3: Call the external tools

Call the corresponding external tools or APIs based on the tool names and parameters returned by the model to get the tool execution results.

```Python
# Parse the function calling information returned by the model.
tool_call = completion.choices[0].message.tool_calls[0]
# The name of the tool.
tool_name = tool_call.function.name
# If the model determines to call the weather tool, call the weather tool.
if tool_name == "get_current_weather":
    # Extract function parameters.
    arguments = json.loads(tool_call.function.arguments)
    # Call the tool.
    tool_result = get_current_weather(**arguments)
```

- `tool_calls`: The list of tools that the model needs to call.
- If the tool name is `get_current_weather`, parse the parameters needed and call the `get_current_weather` function to get the results.

<span id="7289a843"></span>

#### Step 4: Backfill the tool results and get the final response

Backfill the tool execution results to `messages` and set the `role` field to `tool` for the model to generate the final response.

```Python
messages.append(completion.choices[0].message)
messages.append({
    "role": "tool",
    "tool_call_id": tool_call.id,
    "content": tool_result
})

# Call the model again to get the final response.
final_completion = client.chat.completions.create(
    model="",
    messages=messages
)

print(final_completion.choices[0].message.content)
```

<span id="be370b84"></span>

### Complete sample code

```mixin-react
return (<Tabs>
<Tabs.TabPane title="Python - Arkiteck SDK" key="r2KG4n9PBK"><RenderMd content={`<span id="452157dc"></span>
##### Arkiteck SDK (recommended)
\`\`\`Python
from arkitect.core.component.context.context import Context
from enum import Enum
import asyncio
from pydantic import Field

def get_current_weather(
    location: str = Field(description="Location information, e.g., Beijing, Shanghai"),
    unit: str = Field(description="Temperature unit, optional values are Celsius or Fahrenheit")
):
    """
    Get the weather information of the specified location
    """
    return f"{location} today the weather is sunny, temperature 25 {unit}."

async def chat_with_tool():
    ctx = Context(
            model="", # Replace with your model ID.
            tools=[
                get_current_weather
            ],  # Add all your Python methods to the list as tools. Their descriptions are automatically provided to the model for inference, and their executions are automatically handled within ctx.completions.create.
        )
    await ctx.init()
    completion = await ctx.completions.create(
        messages=[
            {"role": "user", "content": "What's the weather like in Beijing and Shanghai today?"}
        ],
        stream=False
    )
    return completion

completion = asyncio.run(chat_with_tool())
print(completion.choices[0].message.content)
\`\`\`

`}></RenderMd></Tabs.TabPane>
<Tabs.TabPane title="Python - ModelArk SDK" key="jVyDCCTEeF"><RenderMd content={`<span id="aa60ad09"></span>
##### Basic ModelArk SDK
\`\`\`Python
from byteplussdkarkruntime import Ark
from byteplussdkarkruntime.types.chat import ChatCompletion
import json

client = Ark()
messages = [
    {"role": "user", "content": "What's the weather like in Beijing and Shanghai today?"}
]

# Step 1: Define tools.
tools = [{
  "type": "function",
  "function": {
    "name": "get_current_weather",
    "description": "Get the weather information of the specified location",
    "parameters": {
      "type": "object",
      "properties": {
        "location": {
          "type": "string",
          "description": "Location information, e.g., Beijing, Shanghai"
        },
        "unit": {
          "type": "string",
          "enum": ["Celsius", "Fahrenheit"],
          "description": "Temperature unit, optional values are Celsius or Fahrenheit"
        }
      },
      "required": ["location"]
    }
  }
}]

def get_current_weather(location: str, unit="Celsius"):
    # Call the weather API.
    # Here, simulated weather data is returned for demonstration.
    return f"{location} today the weather is sunny, temperature 25 {unit}."

while True:
    # Step 2: Initiate a model request. A model might continue to call tools after receiving a tool execution result. In this case, multiple tool calls are needed.
    completion: ChatCompletion = client.chat.completions.create(
    model="",
    messages=messages,
    tools=tools
    )
    resp_msg = completion.choices[0].message
    # Display the intermediate response from the model.
    print(resp_msg.content)
    if completion.choices[0].finish_reason != "tool_calls":
        # The model has completed summarization without any function calling intentions.
        break
    messages.append(completion.choices[0].message.model_dump())
    tool_calls = completion.choices[0].message.tool_calls
    for tool_call in tool_calls:
        tool_name = tool_call.function.name
        if tool_name == "get_current_weather":
            # Step 3: Call the external tool.
            args = json.loads(tool_call.function.arguments)
            tool_result = get_current_weather(**args)
            # Step 4: Backfill the tool result and get the response summarized by the model.
            messages.append(
                {"role": "tool", "content": tool_result, "tool_call_id": tool_call.id}
            )
\`\`\`

`}></RenderMd></Tabs.TabPane>
<Tabs.TabPane title="Java" key="YG773gCg4D"><RenderMd content={`\`\`\`Java
package com.example;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.byteplus.ark.runtime.model.completion.chat.*;
import com.byteplus.ark.runtime.service.ArkService;

import java.util.*;

public class BytePlusFunctionCallChat {

    // Class for parsing the parameters of the get_current_weather function
    public static class WeatherArgs {
        @JsonProperty("location")
        private String location;

        @JsonProperty("unit")
        private String unit;

        // Default constructor required by Jackson
        public WeatherArgs() {
        }

        public String getLocation() {
            return location;
        }

        public void setLocation(String location) {
            this.location = location;
        }

        public String getUnit() {
            return unit;
        }

        public void setUnit(String unit) {
            this.unit = unit;
        }
    }

    // Class for defining function parameter schemas, which are similar to the parameters dictionary in Python
    public static class FunctionParameterSchema {
        public String type;
        public Map<String, Object> properties;
        public List<String> required;

        public FunctionParameterSchema(String type, Map<String, Object> properties, List<String> required) {
            this.type = type;
            this.properties = properties;
            this.required = required;
        }

        public String getType() {
            return type;
        }

        public Map<String, Object> getProperties() {
            return properties;
        }

        public List<String> getRequired() {
            return required;
        }
    }

    private static final ObjectMapper objectMapper = new ObjectMapper();

    // Implementation of the get_current_weather function
    public static String getCurrentWeather(String location, String unit) {
        // Logic for calling the weather API
        // An example, which returns simulated weather data for demonstration
        String currentUnit = (unit == null || unit.isEmpty()) ? "Celsius" : unit;
        System.out.println(String.format("Calling tool get_current_weather: location=%s, unit=%s", location, currentUnit));
        return String.format("%s today the weather is sunny, temperature 25 %s.", location, currentUnit);
    }

    public static void main(String[] args) {
        String apiKey = System.getenv("ARK_API_KEY");

        if (apiKey == null || apiKey.isEmpty()) {
            System.err.println("Error: ARK_API_KEY environment variable is not set.");
            return;
        }

        ArkService service = ArkService.builder()
                .apiKey(apiKey)
                .build();

        List<ChatMessage> messages = new ArrayList<>();
        messages.add(ChatMessage.builder().role(ChatMessageRole.USER).content("What's the weather like in Beijing and Shanghai today?").build());

        // Step 1: Define tools.
        Map<String, Object> locationProperty = new HashMap<>();
        locationProperty.put("type", "string");
        locationProperty.put("description", "Location information, e.g., Shanghai, Beijing");

        Map<String, Object> unitProperty = new HashMap<>();
        unitProperty.put("type", "string");
        unitProperty.put("enum", Arrays.asList("Celsius", "Fahrenheit"));
        unitProperty.put("description", "Temperature unit");

        Map<String, Object> schemaProperties = new HashMap<>();
        schemaProperties.put("location", locationProperty);
        schemaProperties.put("unit", unitProperty);

        FunctionParameterSchema functionParams = new FunctionParameterSchema(
                "object",
                schemaProperties,
                Collections.singletonList("location") // Define the location parameter as required.
        );

        List<ChatTool> tools = Collections.singletonList(
                new ChatTool(
                        "function", // The type of the tool.
                        new ChatFunction.Builder()
                                .name("get_current_weather")
                                .description("Get the weather information of the specified location")
                                .parameters(functionParams) // The parameter schema of the function.
                                .build()));

        String modelId = "";

        while (true) {
            // Step 2: Initiate a model request.
            ChatCompletionRequest request = ChatCompletionRequest.builder()
                    .model(modelId)
                    .messages(messages)
                    .tools(tools)
                    .build();

            ChatCompletionResult completionResult;
            try {
                completionResult = service.createChatCompletion(request);
            } catch (Exception e) {
                System.err.println("Error calling Ark API: " + e.getMessage());
                e.printStackTrace();
                break;
            }

            if (completionResult == null || completionResult.getChoices() == null
                    || completionResult.getChoices().isEmpty()) {
                System.err.println("Received empty or invalid response from the model.");
                break;
            }

            ChatCompletionChoice choice = completionResult.getChoices().get(0);
            ChatMessage responseMessage = choice.getMessage();

            // Display the intermediate response from the model.
            System.out.println("Model response: " + responseMessage.stringContent());

            // Add the model's response, including function calling requests, to the message history.
            messages.add(responseMessage);
            if (choice.getFinishReason() == null || !"tool_calls".equalsIgnoreCase(choice.getFinishReason())) {
                // The model has completed summarization without any function calling intentions, or exited for other reasons, such as an error.
                break;
            }

            List<ChatToolCall> toolCalls = responseMessage.getToolCalls();
            if (toolCalls == null || toolCalls.isEmpty()) {
                // If finish_reason is "tool_calls" but the tool_calls field is empty, an exception might have arisen.
                System.err.println("Warning: Finish reason is 'tool_calls' but no tool_calls found in message.");
                break;
            }

            for (ChatToolCall toolCall : toolCalls) {
                String toolName = toolCall.getFunction().getName();
                if ("get_current_weather".equals(toolName)) {
                    // Step 3: Call the external tool.
                    String argumentsJson = toolCall.getFunction().getArguments();
                    WeatherArgs tool_args;
                    try {
                        tool_args = objectMapper.readValue(argumentsJson, WeatherArgs.class);
                    } catch (JsonProcessingException e) {
                        System.err.println("Error parsing get_current_weather parameters: " + argumentsJson + " - " + e.getMessage());
                        // Backfill the error message as the tool result.
                        messages.add(ChatMessage.builder()
                                .role(ChatMessageRole.TOOL)
                                .content("Error parsing parameters: " + e.getMessage())
                                .toolCallId(toolCall.getId())
                                .build());
                        continue;
                    }

                    String toolResult = getCurrentWeather(tool_args.getLocation(), tool_args.getUnit());
                    System.out.println("Tool execution result (" + toolCall.getId() + "): " + toolResult);

                    // Step 4: Backfill the tool result and get the response summarized by the model.
                    messages.add(ChatMessage.builder()
                            .role(ChatMessageRole.TOOL)
                            .content(toolResult)
                            .toolCallId(toolCall.getId()) // Associate the tool call ID.
                            .build());
                }
            }
        }

        service.shutdownExecutor();
        System.out.println("\nSession ended.");
    }
}
\`\`\`

`}></RenderMd></Tabs.TabPane>
<Tabs.TabPane title="Golang" key="AY6LlNbGnJ"><RenderMd content={`\`\`\`Go
package main

import (
    "context"
    "encoding/json"
    "fmt"
    "os"

    "github.com/byteplus-sdk/byteplus-go-sdk-v2/service/arkruntime"
    "github.com/byteplus-sdk/byteplus-go-sdk-v2/service/arkruntime/model"
    "github.com/byteplus-sdk/byteplus-go-sdk-v2/byteplus"
)

type WeatherArgs struct {
    Location string \`json:"location"\`
    Unit     string \`json:"unit,omitempty"\` // The omitempty tag allows the unit parameter to be optional.
}

// Function to call
func getCurrentWeather(location string, unit string) string {
    if unit == "" {
        unit = "Celsius" // Default unit
    }
    // Here, simulated weather data is returned for demonstration.
    return fmt.Sprintf("%s today the weather is sunny, temperature 25 %s.", location, unit)
}

func main() {
    // Read the API key from the environment variable. Make sure that ARK_API_KEY has been set.
    apiKey := os.Getenv("ARK_API_KEY")
    if apiKey == "" {
        fmt.Println("Error: Please set the ARK_API_KEY environment variable.")
        return
    }

    client := arkruntime.NewClientWithApiKey(
        apiKey,
    )

    ctx := context.Background()

    // Initialize the message list.
    messages := []*model.ChatCompletionMessage{
        {
            Role: model.ChatMessageRoleUser,
            Content: &model.ChatCompletionMessageContent{
                StringValue: byteplus.String("What's the weather like in Beijing and Shanghai today?"),
            },
        },
    }

    // Step 1: Define tools.
    tools := []*model.Tool{
        {
            Type: model.ToolTypeFunction,
            Function: &model.FunctionDefinition{
                Name:        "get_current_weather",
                Description: "Get the weather information of the specified location",
                Parameters: map[string]interface{}{
                    "type": "object",
                    "properties": map[string]interface{}{
                        "location": map[string]interface{}{
                            "type":        "string",
                            "description": "Location information, e.g., Beijing, Shanghai",
                        },
                        "unit": map[string]interface{}{
                            "type": "string",
                            "enum": []string{
                                "Celsius",
                                "Fahrenheit",
                            },
                            "description": "Temperature unit",
                        },
                    },
                    "required": []string{"location"},
                },
            },
        },
    }

    for {
        // Step 2: Initiate a model request.
        req := model.CreateChatCompletionRequest{
            Model:    "", // Select a model compatible with the current Python version.
            Messages: messages,
            Tools:    tools,
        }

        resp, err := client.CreateChatCompletion(ctx, req)
        if err != nil {
            fmt.Printf("Model request error: %v\n", err)
            return
        }

        if len(resp.Choices) == 0 {
            fmt.Println("Model returned no choices.")
            return
        }

        respMsg := resp.Choices[0].Message

        // Display the intermediate response from the model (if any).
        if respMsg.Content.StringValue != nil && *respMsg.Content.StringValue != "" {
            fmt.Println("Model response:", *respMsg.Content.StringValue)
        }

        if resp.Choices[0].FinishReason != model.FinishReasonToolCalls || len(respMsg.ToolCalls) == 0 {
            break
        }

        // Add the model's response, including function calling requests, to the message history.
        messages = append(messages, &respMsg)

        for _, toolCall := range respMsg.ToolCalls {
            fmt.Printf("Model attempting to call tool: %s, ID: %s\n", toolCall.Function.Name, toolCall.ID)
            fmt.Println("  Parameters:", toolCall.Function.Arguments)

            var toolResult string
            if toolCall.Function.Name == "get_current_weather" {
                // Step 3: Call the external tool.
                var args WeatherArgs
                err := json.Unmarshal([]byte(toolCall.Function.Arguments), &args)
                if err != nil {
                    fmt.Printf("Error parsing tool parameters (%s): %v\n", toolCall.Function.Name, err)
                    toolResult = fmt.Sprintf("Failed to parse parameters: %v", err)
                } else {
                    toolResult = getCurrentWeather(args.Location, args.Unit)
                    fmt.Println("  Tool execution result:", toolResult)
                }

                // Step 4: Backfill the tool result.
                messages = append(messages, &model.ChatCompletionMessage{
                    Role:       model.ChatMessageRoleTool,
                    Content:    &model.ChatCompletionMessageContent{StringValue: byteplus.String(toolResult)},
                    ToolCallID: toolCall.ID,
                })
            }
        }
        fmt.Println("--- Next conversation round ---")
    }

    // Note: The original code did not have a shutdown for the SDK client. In production, consider adding proper cleanup.
    fmt.Println("\nConversation ended.")
}
\`\`\`

`}></RenderMd></Tabs.TabPane></Tabs>);
```

<span id="fa127cf4"></span>

## Configuration and optimization best practices

<span id="cacc0aa8"></span>

### Key integration considerations

1. Clarify business requirements.
   1. If your workflow relies heavily on function calling—e.g., multiple pipelines/plugins and serial tool calls— it is recommended that you use a function calling model.
   2. If function calling is minimal (no serial calls) and you primarily need strong general capabilities, it is recommended that you use a pro model.
2. Prepare an evaluation dataset, tests the performance of the function calling model, and compare the actual accuracy rate with your expectation.
3. Use standard fine-tuning techniques.
   - Define each function precisely—parameters, types, and descriptions. Avoid describing functions in system prompts; instead, describe when each function should be called.
   - Refine function and parameter descriptions, clarify boundaries between functions, remove ambiguity, and include examples.
   - Perform supervised fine-tuning (SFT). Use at least 50 training examples to start; increase the amount as the number of models, parameters, or scenarios grows.
4. Optimize execution speed.
   - For simple, unambiguous functions or parameters, simplify the inputs and outputs.
   - For steady traffic from system prompts and the function list, purchase model units and contact us to enable caching.
   - For time-sensitive scenarios, split the process into two stages:
     1. use an LLM to select the function, then
     2. use an LLM to extract the parameters.
        You can test each stage with **pro** and **lite** models. _Note:_ this approach may reduce overall effectiveness.

<span id="4392ae8d"></span>

### Handle JSON format errors

JSON format error tolerance: For mildly malformed JSON, try repairing it with the `json-repair` library.

```Python
import json_repair

invalid_json = '{"location": "Beijing", "unit": "Celsius"}'
valid_json = json_repair.loads(invalid_json)
```

<span id="83f100d2"></span>

### Clarify requirements

Requirement clarification/confirmation is independent of function calling.
The following methods can be used:

- Add a requirement in a system prompt:

```Python
If the user does not provide sufficient information to call a function, continue asking questions to ensure all necessary information is collected.

Before invoking the function, you must summarize the user's description, provide the summary to the user, and ask if they need to make any modifications.
```

- Add a requirement in the description of the function:

```Python
In addition to extracting a and b, the function parameters should also require the user to provide c, d, e, f, and other relevant details.
```

- Add parameter validation logic to a system prompt. When a parameter is missing, the system guides the model to regenerate all necessary parameters.

```Python
If the user’s input is missing **required tool parameters**, you must ask follow-up questions to collect the missing details before proceeding.
```

<span id="ba983529"></span>

### Support for streaming output

You can use streaming output to progressively deliver function-calling information.

```Python
def function_calling_stream():
    completion = client.chat.completions.create(
        model="",
        messages=messages,
        tools=tools,
        stream=True
    )
    for chunk in completion:
        if chunk.choices[0].delta.tool_calls:
            tool_call = chunk.choices[0].delta.tool_calls[0]
            print(f"Tool name: {tool_call.function.name}, Parameters: {tool_call.function.arguments}")

function_calling_stream()
```

<span id="d2710459"></span>

### Multi-step function calling

When a user’s request requires multiple tool calls, the model can maintain the conversational context and handle each round by invoking the function and feeding its results back into the dialogue.
<span id="678ddf3e"></span>

#### Example

1. **User request**: "Check the weather in Beijing and send the result to John Doe."
2. **Step 1**: Call the `get_current_weather` function to obtain the weather information of Beijing.
3. **Step 2**: Call the `send_message` function to send the weather information to John Doe.
4. **Step 3**: Summarize execution of all the tasks and return the final response.

<span id="23f67db1"></span>

#### Sample code

:::tip
Multi-step function calling applies when a user request requires multiple tool or model calls. It’s a subset of multi-turn conversation.
:::
<span id="54f334fa"></span>

##### Golang

```Go
package main

import (
    "context"
    "encoding/json"
    "fmt"
    "os"
    "strings"

    "github.com/byteplus-sdk/byteplus-go-sdk-v2/service/arkruntime"
    "github.com/byteplus-sdk/byteplus-go-sdk-v2/service/arkruntime/model"
    "github.com/byteplus-sdk/byteplus-go-sdk-v2/byteplus"
)

func main() {
    client := arkruntime.NewClientWithApiKey(
        os.Getenv("ARK_API_KEY"),
        arkruntime.WithBaseUrl("${BASE_URL}"),
    )

    fmt.Println("----- Function call multiple rounds request -----")
    ctx := context.Background()
    // Step 1: Send the conversation and available functions to the model.
    req := model.CreateChatCompletionRequest{
        Model: "%model",
        Messages: []*model.ChatCompletionMessage{
            {
                Role: model.ChatMessageRoleSystem,
                Content: &model.ChatCompletionMessageContent{
                    StringValue: byteplus.String("You are Seed, an AI assistant developed by ByteDance"),
                },
            },
            {
                Role: model.ChatMessageRoleUser,
                Content: &model.ChatCompletionMessageContent{
                    StringValue: byteplus.String("What's the weather like in Shanghai?"),
                },
            },
        },
        Tools: []*model.Tool{
            {
                Type: model.ToolTypeFunction,
                Function: &model.FunctionDefinition{
                    Name:        "get_current_weather",
                    Description: "Get the current weather in a given location",
                    Parameters: map[string]interface{}{
                        "type": "object",
                        "properties": map[string]interface{}{
                            "location": map[string]interface{}{
                                "type":        "string",
                                "description": "The city, e.g. Beijing",
                            },
                            "unit": map[string]interface{}{
                                "type":        "string",
                                "description": "Enumerated values: celsius, fahrenheit",
                            },
                        },
                        "required": []string{
                            "location",
                        },
                    },
                },
            },
        },
    }
    resp, err := client.CreateChatCompletion(ctx, req)
    if err != nil {
        fmt.Printf("chat error: %v\n", err)
        return
    }
    // Extend the conversation with the assistant's reply.
    req.Messages = append(req.Messages, &resp.Choices[0].Message)

    // Step 2: Check whether the model decided to call a function.
    // The model can choose to call one or more functions; if so,
    // the content will be a stringified JSON object adhering to
    // your custom schema. Note that the model may hallucinate parameters.
    for _, toolCall := range resp.Choices[0].Message.ToolCalls {
        fmt.Println("Calling function")
        fmt.Println("    ID:", toolCall.ID)
        fmt.Println("    Name:", toolCall.Function.Name)
        fmt.Println("    Arguments:", toolCall.Function.Arguments)
        functionResponse, err := CallAvailableFunctions(toolCall.Function.Name, toolCall.Function.Arguments)
        if err != nil {
            functionResponse = err.Error()
        }
        // Extend the conversation with the function response.
        req.Messages = append(req.Messages,
            &model.ChatCompletionMessage{
                Role:       model.ChatMessageRoleTool,
                ToolCallID: toolCall.ID,
                Content: &model.ChatCompletionMessageContent{
                    StringValue: &functionResponse,
                },
            },
        )
    }
    // Get a new response from the model where it can see the function response.
    secondResp, err := client.CreateChatCompletion(ctx, req)
    if err != nil {
        fmt.Printf("second chat error: %v\n", err)
        return
    }
    fmt.Println("Dialogue:", MustMarshal(req.Messages))
    fmt.Println("New message:", MustMarshal(secondResp.Choices[0].Message))
}

// CallAvailableFunctions is used to invoke the specified function with given arguments.
func CallAvailableFunctions(name, arguments string) (string, error) {
    if name == "get_current_weather" {
        params := struct {
            Location string `json:"location"`
            Unit     string `json:"unit"`
        }{}
        if err := json.Unmarshal([]byte(arguments), &params); err != nil {
            return "", fmt.Errorf("failed to parse function call (name=%s, arguments=%s): %w", name, arguments, err)
        }
        return GetCurrentWeather(params.Location, params.Unit), nil
    } else {
        return "", fmt.Errorf("unavailable function: name=%s, arguments=%s", name, arguments)
    }
}

// GetCurrentWeather simulates fetching current weather data for a given location.
// In production, this would call a weather API.
func GetCurrentWeather(location, unit string) string {
    if unit == "" {
        unit = "celsius"
    }
    switch strings.ToLower(location) {
    case "beijing":
        return `{"location": "Beijing", "temperature": "10", "unit": "` + unit + `"}`
    case "北京":
        return `{"location": "Beijing", "temperature": "10", "unit": "` + unit + `"}`
    case "shanghai":
        return `{"location": "Shanghai", "temperature": "23", "unit": "` + unit + `"}`
    case "上海":
        return `{"location": "Shanghai", "temperature": "23", "unit": "` + unit + `"}`
    default:
        return fmt.Sprintf(`{"location": "%s", "temperature": "unknown"}`, location)
    }
}

// MustMarshal serializes a value to JSON and panics on failure (for debugging).
func MustMarshal(v interface{}) string {
    b, err := json.MarshalIndent(v, "", "  ")
    if err != nil {
        panic(err)
    }
    return string(b)
}
```

<span id="0817d046"></span>

##### Python

```Python
from byteplussdkarkruntime import Ark
import time

client = Ark(
    base_url="${BASE_URL}",
)

print("----- function call multiple rounds request -----")
messages = [
    {
        "role": "system",
        "content": "You are Seed, an AI assistant developed by ByteDance",
    },
    {
        "role": "user",
        "content": "What's the weather in Beijing today?",
    },
]

req = {
    "model": "${YOUR_ENDPOINT_ID}",
    "messages": messages,
    "temperature": 0.8,
    "tools": [
        {
            "type": "function",
            "function": {
                "name": "MusicPlayer",
                "description": """Song search plugin, used when the user needs to search for a singer or song, returns relevant music given features like artist and song name.\n Example 1: query=Want to listen to Sun Yanzi's 'Meet', outputs {"artist":"Sun Yanzi","song_name":"Meet","description":""}""",
                "parameters": {
                    "properties": {
                        "artist": {"description": "Indicates the singer's name", "type": "string"},
                        "description": {"description": "Indicates descriptive information", "type": "string"},
                        "song_name": {"description": "Indicates the song's name", "type": "string"},
                    },
                    "required": [],
                    "type": "object",
                },
            },
        },
        {
            "type": "function",
            "function": {
                "name": "get_current_weather",
                "description": "",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "location": {"type": "string", "description": "Geographical location, e.g., Beijing"},
                        "unit": {"type": "string", "description": "Enumerated values: [Celsius, Fahrenheit]"},
                    },
                    "required": ["location"],
                },
            },
        },
    ],
}

ts = time.time()
completion = client.chat.completions.create(**req)
if completion.choices[0].message.tool_calls:
    print(
        f"Bot [{time.time() - ts:.3f} s][Use FC]: ",
        completion.choices[0].message.tool_calls[0],
    )
    # ========== Add the function call result =========
    req["messages"].extend(
        [
            completion.choices[0].message.dict(),
            {
                "role": "tool",
                "tool_call_id": completion.choices[0].message.tool_calls[0].id,
                "content": "Beijing's weather is sunny, 24~30 degrees",  # Add content based on the actual function call result, ideally in a natural language.
                "name": completion.choices[0].message.tool_calls[0].function.name,
            },
        ]
    )
    # Call the model again to get a summary. This step is optional.
    ts = time.time()
    completion = client.chat.completions.create(**req)
    print(
        f"Bot [{time.time() - ts:.3f} s][FC Summary]: ",
        completion.choices[0].message.content,
    )
```

<span id="1472b448"></span>

##### Java

```Java
package com.byteplus.ark.runtime;

import com.byteplus.ark.runtime.model.completion.chat.*;
import com.byteplus.ark.runtime.service.ArkService;
import okhttp3.ConnectionPool;
import okhttp3.Dispatcher;

import java.util.*;
import java.util.concurrent.TimeUnit;

public class FunctionCallChatCompletionsExample {
    static String apiKey = System.getenv("ARK_API_KEY");
    static ConnectionPool connectionPool = new ConnectionPool(5, 1, TimeUnit.SECONDS);
    static Dispatcher dispatcher = new Dispatcher();
    static ArkService service = ArkService.builder().dispatcher(dispatcher).connectionPool(connectionPool).baseUrl("${BASE_URL}").apiKey(apiKey).build();

    public static void main(String[] args) {
        System.out.println("\n----- Function call multiple rounds request -----");
        final List<ChatMessage> messages = new ArrayList<>();
        final ChatMessage userMessage = ChatMessage.builder().role(ChatMessageRole.USER).content("What's the weather like in Beijing today?").build();
        messages.add(userMessage);

        final List<ChatTool> tools = Arrays.asList(
                new ChatTool(
                        "function",
                        new ChatFunction.Builder()
                                .name("get_current_weather")
                                .description("Get the weather of the given location")
                                .parameters(new Weather(
                                        "object",
                                        new HashMap<String, Object>() {{
                                            put("location", new HashMap<String, String>() {{
                                                put("type", "string");
                                                put("description", "Location information of the place, e.g., Beijing");
                                            }});
                                            put("unit", new HashMap<String, Object>() {{
                                                put("type", "string");
                                                put("description", "Enumerated values: Celsius, Fahrenheit");
                                            }});
                                        }},
                                        Collections.singletonList("location")
                                ))
                                .build()
                )
        );

        ChatCompletionChoice choice = service.createChatCompletion(chatCompletionRequest).getChoices().get(0);
        messages.add(choice.getMessage());
        choice.getMessage().getToolCalls().forEach(
                toolCall -> {
                messages.add(ChatMessage.builder().role(ChatMessageRole.TOOL).toolCallId(toolCall.getId()).content("Beijing's weather is sunny, 24~30 degrees").name(toolCall.getFunction().getName()).build());
        });
        ChatCompletionRequest chatCompletionRequest2 = ChatCompletionRequest.builder()
                .model("${YOUR_ENDPOINT_ID}")
                .messages(messages)
                .build();

        service.createChatCompletion(chatCompletionRequest2).getChoices().forEach(System.out::println);

        // Shut down the service.
        service.shutdownExecutor();
    }

    public static class Weather {
        public String type;
        public Map<String, Object> properties;
        public List<String> required;

        public Weather(String type, Map<String, Object> properties, List<String> required) {
            this.type = type;
            this.properties = properties;
            this.required = required;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public Map<String, Object> getProperties() {
            return properties;
        }

        public void setProperties(Map<String, Object> properties) {
            this.properties = properties;
        }

        public List<String> getRequired() {
            return required;
        }

        public void setRequired(List<String> required) {
            this.required = required;
        }
    }

}
```

<span id="3fdf8e62"></span>

#### Sample response

```Python
========== Round 1 ==========
user: First, check the weather in Beijing. If it's sunny, send a WeChat message to Alan; otherwise, send it to Peter...


assistant [FC Response]:
name=GetCurrentWeather, args={"location": "Beijing"} [elapsed=2.607 s]


========== Round 2 ==========
tool: Today in Beijing, 20~24 degrees, weather: shower....


assistant [FC Response]:
name=SendMessage, args={"content": "Today's weather in Beijing", "receiver": "Peter"} [elapsed=3.492 s]


========== Round 3 ==========
tool: Successfully sent WeChat message to Peter...


assistant [Final Answer]:
Okay, is there anything else I can help you with? [elapsed=0.659 s]
```

<span id="f118e5a2"></span>

### Fine-tuning

If the performance of function calling doesn't meet expectations, you can use SFT to boost the model's performance.
For more information, see [Creating Model Fine-Tuning Task](/docs/ModelArk/1099459).
<span id="94d88ded"></span>

#### Fine-tuning scenarios

- Improve tool selection accuracy, so the model calls the right tool at the right time.
- Optimize parameter extraction so the model can correctly interpret requests and generate accurate inputs.
- Enhance summarization quality, so the model can produce clear, natural, and accurate summaries from tool outputs.

<span id="27cf081f"></span>

#### Format of fine-tuning data

```SQL
{
  "messages": [
    {
      "role": "system",
      "content": "You are AI Assistant"
    },
    {
      "role": "user",
      "content": "Send the weather in Beijing to Lisi"
    },
    {
      "role": "assistant",
      "content": "",
      "tool_calls": [
        {
          "type": "function",
          "function": {
            "name": "get_current_weather",
            "arguments": "{\"location\": \"Beijing\"}"
          }
        }
      ],
      "loss_weight": 1.0
    },
    {
      "role": "tool",
      "content": "Beijing is sunny today, 25 degrees Celsius"
    },
    {
      "role": "assistant",
      "content": "",
      "tool_calls": [
        {
          "type": "function",
          "function": {
            "name": "send_message",
            "arguments": "{\"receiver\": \"Lisi\", \"content\": \"Beijing is sunny today, 25 degrees Celsius\"}"
          }
        }
      ],
      "loss_weight": 1.0
    },
    {
      "role": "tool",
      "content": "The message was sent successfully"
    },
    {
      "role": "assistant",
      "content": "The weather information for Beijing has been sent to Lisi"
    }
  ],
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "get_current_weather",
        "description": "Get the weather of the specified location",
        "parameters": {
          "type": "object",
          "properties": {
            "location": {"type": "string", "description": "Location information of the place"}
          },
          "required": ["location"]
        }
      }
    }
  ]
}
```

<span id="01ae4b36"></span>

## FAQs

<span id="aefed659"></span>

### Q: What are the main differences between FC and MCP?

**A: Below are the main differences between FC and MCP and when to use each.**

| | | | \

|                                  | **FC**                                                                                                                                                                                                              | **MCP**                                                                                                                                                                                 |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
|                                  |                                                                                                                                                                                                                     |                                                                                                                                                                                         | \   |
| **Essence**                      | FC is a feature that enables models to call external tools or functions for functionality expansion.                                                                                                                | MCP is a protocol that defines how to manage contexts during the interactions between models and external systems.                                                                      |
|                                  |                                                                                                                                                                                                                     |                                                                                                                                                                                         | \   |
| **Purpose**                      | FC is designed to address a model's limitations in areas such as computation, data querying, and task execution.                                                                                                    | MCP is designed to standardize the transmission, parsing, and state management of contexts during interactions.                                                                         |
|                                  |                                                                                                                                                                                                                     |                                                                                                                                                                                         | \   |
| **Key benefit**                  | FC enables models to employ the capabilities of external tools.                                                                                                                                                     | MCP ensures a consistent context, including chat history, parameters, and state, throughout multi-turn interactions.                                                                    |
|                                  |                                                                                                                                                                                                                     |                                                                                                                                                                                         | \   |
| **Protocol and standard**        | FC follows formats defined by vendors, such as OpenAI's JSON Schema.                                                                                                                                                | MCP strictly adheres to JSON-RPC 2.0 for uniformity.                                                                                                                                    |
|                                  |                                                                                                                                                                                                                     |                                                                                                                                                                                         | \   |
| **Architecture**                 | FC is directly integrated into model APIs and is triggered by models after users define functions.                                                                                                                  | MCP is in client-server mode, where MCP Host is separated from MCP Server.                                                                                                              |
|                                  |                                                                                                                                                                                                                     |                                                                                                                                                                                         | \   |
| **Context management**           | For FC, one function call generates one response. Therefore, context management is left to developers.                                                                                                              | MCP supports multi-turn conversations and historical state management, making it suitable for long-context tasks.                                                                       |
|                                  |                                                                                                                                                                                                                     |                                                                                                                                                                                         | \   |
| **Typical application scenario** | External data calls and system operations, such as weather queries or complex calculations. For example, calling a weather API to respond to the following user question: "What is the temperature in Tokyo today?" | Multi-turn conversations and cross-system context management, such as food ordering and customer support. For example, coherently matching selected dishes to their delivery addresses. |

**Relationship between FC and MCP**
**Complementary, not mutually exclusive**

- MCP can incorporate FC logic—for example, defining when and how to trigger function calls within its workflow.
- FC inputs and outputs should follow MCP’s context specifications (e.g., parameter formats and return-value parsing rules).

**Collaboration at different layers**

- **MCP (connectivity):** A standardized protocol that bridges data silos and provides the integration infrastructure (e.g., connecting user order data).
- **FC (execution):** Invokes specific functions over the protocol layer to complete tasks (e.g., calling an inventory API to generate restocking suggestions).

**Architectural differences**

- FC is **a capability interface**.
- MCP is **an interaction framework**.

They are often used together to build complex applications—such as intelligent assistants that both call functions and manage multi-turn conversation state.
**References**

- The official MCP specification defines the core protocol architecture, JSON-RPC message format, state management mechanisms, and security principles—an authoritative reference for API design. See [Model Context Protocol Specification](https://spec.modelcontextprotocol.io/specification/draft/) for more information.
- The MCP development roadmap outlines planned capabilities, including remote connections, sandboxing, and multimodality. See [MCP Development Roadmap](https://modelcontextprotocol.io/development/roadmap) for more information.

<span id="060c2399"></span>

### **Q: Does DeepSeek-R1 support parallel function calling?**

A: DeepSeek-R1 supports automatic parallel function calling. You can configure parallel function calling without the need to configure additional settings. (`parallel_tool_calls` is not supported.)
<span id="6a5f3318"></span>

### **Q: How do I resolve parameter hallucinations in DeepSeek-R1?**

**A: DeepSeek-R1 may generate abnormal nested function calls** (such as `get_weather:{city: get_location()}`) when parsing complex parameters. We recommend that you use the following intervention approaches:

- Explicitly require **multi-step function calling** in the `system prompt`. For example, provide the following guidance: "Call the location tool first, then call the weather tool."
- Use **JSON Schema** to forcibly validate parameter formats.

<span id="72cd8003"></span>

### Q: How do I determine whether a model decides to call a tool?

A: Models automatically determine whether to call tools based on user questions and tool definitions. If the result returned by a model contains the `tool_calls` field, tool calls are needed. If the `content` field contains a direct response, no tool call is needed.
<span id="6cde090d"></span>

### Q: Is parallel function calling supported?

A: Yes. After you set `parallel_tool_calls` to `true`, the model can return the information of multiple tool calls at once for higher processing efficiency.
<span id="e92ed249"></span>

### Q: Why do models sometimes hallucinate tool parameters in their responses?

A: This is a common issue with LLMs. You can use SFT to improve a model's parameter generation capability, or clarify the expected formats and ranges of parameters in the system prompt to reduce hallucinations.
Some models, especially DeepSeek-R1, tend to hallucinate parameters. For example, when the expected behavior is to first call get_location to obtain the city and then call get_weather to query the weather, DeepSeek-R1 may incorrectly generate a nested call, such as get_weather:{city: **get_location()**}. To avoid this, enforce multi-step function calling in the system prompt.
<span id="87aee2fb"></span>

### Q: What do I do when a tool call fails?

A: Backfill the error information of the tool to the model as a message with the `tool` role. The model will generate an appropriate response based on the error, such as "Sorry, the tool call failed. Please try again later."
These optimizations help developers use function calling with higher efficiency, so that they can deeply integrate LLMs with external tools and quickly build intelligent applications.

<span id="4d571c97"></span>

## Appendix 1: Tool construction specifications

For a model to call tools properly, construct a `tools` object based on the following specifications and ensure that the object aligns with the JSON Schema format.
<span id="17410772"></span>

### Overall structure

```JSON
{
  "type": "function",
  "function": {
    "name": "...",          // The name of the function; supports lowercase letters and underscores (_).
    "description": "...",   // The description of the function.
    "parameters": { ... }   // The parameter definitions in JSON Schema format.
  }
}
```

- `type`: The type of the tool. Currently, it is fixed to `function`, indicating that the tool is for function calling.
- `function`: The details of the function, including its name, description, and parameters.

<span id="a3d99114"></span>

### Fields

<span id="7eb52ab1"></span>

#### function

| | | | | \

| **Field**   | **Type** | **Required** | **Description**                                                                                                                                                   |
| ----------- | -------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
|             |          |              |                                                                                                                                                                   | \   |
| name        | String   | Yes          | The name of the function, which is used to uniquely identify the function. We recommend that you use a name consisting of lowercase letters and underscores (\_). |
|             |          |              |                                                                                                                                                                   | \   |
| description | String   | Yes          | The description of the purpose of the function.                                                                                                                   |
|             |          |              |                                                                                                                                                                   | \   |
| parameters  | Object   | Yes          | The parameter definitions of the function, which must be in JSON Schema format.                                                                                   |

<span id="41396457"></span>

#### parameters

`parameters` must be an object in JSON Schema format.

```JSON
{
  "type": "object",
  "properties": {
    "parameter name": {
      "type": "string | number | boolean | object | array",
      "description": "parameter description"
    }
  },
  "required": ["required parameter"]
}
```

- `type`: Its value must be `"object"`.
- `properties`: Specifies the names and types of all parameters.
  - `parameter name` must be a unique English string.
    - `type` must be in [JSON Schema](https://json-schema.org/docs) format. Valid values: string, number, boolean, integer, object, and array.
    - `required`: Specifies the names of the required parameters of the function.
    - Other parameters vary slightly according to `type`. For details, refer to the following table.

| | | \

| `Type`                                                                               | Example                                                                           |
| ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- | --- |
|                                                                                      |                                                                                   | \   |
| string, integer, number, and boolean                                                 | N/A                                                                               | \   |
|                                                                                      |                                                                                   |
|                                                                                      |                                                                                   | \   |
| object                                                                               | \                                                                                 |
|                                                                                      | \                                                                                 |
| \* `description`: Provides a brief description.                                      | \                                                                                 |
| \* `properties`: Describes all properties of the object.                             | \                                                                                 |
| \* `required`: Specifies required properties.                                        | \                                                                                 |
|                                                                                      | \                                                                                 |
|                                                                                      | \* Example 1: Querying a specific user profile by age, gender, and marital status | \   |
|                                                                                      |                                                                                   | \   |
|                                                                                      | ```Python                                                                         | \   |
|                                                                                      | "person": {                                                                       | \   |
|                                                                                      | "type": "object",                                                                 | \   |
|                                                                                      | "description": "Personal characteristics",                                        | \   |
|                                                                                      | "properties": {                                                                   | \   |
|                                                                                      | "age": {"type": "integer", "description": "Age"},                                 | \   |
|                                                                                      | "gender": {"type": "string", "description": "Gender"},                            | \   |
|                                                                                      | "married": {"type": "boolean", "description": "Whether married"}                  | \   |
|                                                                                      | },                                                                                | \   |
|                                                                                      | "required": ["age"]                                                               | \   |
|                                                                                      | }                                                                                 | \   |
|                                                                                      |```                                                                               | \   |
|                                                                                      |                                                                                   |
|                                                                                      |                                                                                   | \   |
| array                                                                                | \                                                                                 |
|                                                                                      | \                                                                                 |
| \* `description`: Provides a brief description.                                      | \                                                                                 |
| \* `"items": {"type": ITEM_TYPE}`: Specifies the data type of elements in the array. | \                                                                                 |
|                                                                                      | \                                                                                 |
|                                                                                      | \* Example 1: A text array consisting of URLs                                     | \   |
|                                                                                      |                                                                                   | \   |
|                                                                                      | ```Bash                                                                           | \   |
|                                                                                      | "url": {                                                                          | \   |
|                                                                                      | "type": "array",                                                                  | \   |
|                                                                                      | "description": "Web links to be parsed, up to 3",                                 | \   |
|                                                                                      | "items": {"type": "string"}                                                       | \   |
|                                                                                      | }                                                                                 | \   |
|                                                                                      |```                                                                               | \   |
|                                                                                      |                                                                                   | \   |
|                                                                                      |                                                                                   | \   |
|                                                                                      | \* Example 2: A two-dimensional array                                             | \   |
|                                                                                      |                                                                                   | \   |
|                                                                                      | ```Go                                                                             | \   |
|                                                                                      | "matrix": {                                                                       | \   |
|                                                                                      | "type": "array",                                                                  | \   |
|                                                                                      | "description": "2D matrix to be calculated",                                      | \   |
|                                                                                      | "items": {"type": "array", "items": {"type": "number"}},                          | \   |
|                                                                                      | }                                                                                 | \   |
|                                                                                      |```                                                                               | \   |
|                                                                                      |                                                                                   | \   |
|                                                                                      |                                                                                   | \   |
|                                                                                      | \* Example 3: Using an array to enable the selection of multiple values           | \   |
|                                                                                      |                                                                                   | \   |
|                                                                                      | ```JSON                                                                           | \   |
|                                                                                      | "grade": {                                                                        | \   |
|                                                                                      | "description": "grade, supports multiple selections",                             | \   |
|                                                                                      | "type": "array",                                                                  | \   |
|                                                                                      | "items": {                                                                        | \   |
|                                                                                      | "type": "string",                                                                 | \   |
|                                                                                      | "description": """Enumerated values include                                       | \   |
|                                                                                      | "First grade",                                                                    | \   |
|                                                                                      | "Second grade",                                                                   | \   |
|                                                                                      | "Third grade",                                                                    | \   |
|                                                                                      | "Fourth grade",                                                                   | \   |
|                                                                                      | "Fifth grade",                                                                    | \   |
|                                                                                      | "Sixth grade"。 """                                                               | \   |
|                                                                                      | }                                                                                 | \   |
|                                                                                      | }                                                                                 | \   |
|                                                                                      |```                                                                               | \   |
|                                                                                      |                                                                                   |

<span id="3f3944f1"></span>

### Complete example

```JSON
{
  "type": "function",
  "function": {
    "name": "get_weather",
    "description": "Get weather information for the specified location",
    "parameters": {
      "type": "object",
      "properties": {
        "location": {
          "type": "string",
          "description": "City and country, e.g., Beijing, China"
        }
      },
      "required": ["location"]
    }
  }
}
```

<span id="8aa9c9ae"></span>

### Important notes

1. **Case sensitivity**: All field and parameter names are case sensitive. We recommend that you use lowercase letters uniformly.
2. **Chinese character**: Define field names in English, and include Chinese descriptions (if any) in `description`. For example, you can describe `location` as "城市和国家."
3. **Format validation**: `parameters` must be a valid JSON Schema object. You can verify it through a JSON Schema validator.

<span id="5f061853"></span>

### Best practices

1. **Core principles for tool description**
   - Describe a tool in detail, including its functionality, scenarios to which it is applicable, scenarios to which it is inapplicable, parameter meanings and impacts, and limitations (such as input length limit). We recommend that each tool description contain three to four sentences.
   - Focus first on describing the tool's functionality and parameters. Examples are optional and should be added with caution for inference models.
2. **Key guidelines for function design**
   - **Names and parameters**: Use self-explanatory function names, such as `parse_product_info`. Include the parameter format (such as `city: string`) and the parameter meaning (such as "full name of the city") in the parameter description. Clarify the output, such as "returns weather data in JSON format."
   - **System prompt**: Specify the conditions that trigger function calling in the system prompt. For example, "Call `get_product_detail` when a user asks for product details."
   - **Engineering design**:
     - Use enumerations such as `StatusEnum` to avoid invalid parameter values, and follow the principle of least astonishment to keep the logic intuitive.
     - Anticipate and answer potential user questions to ensure that a human user can correctly call a function based solely on the documentation.
   - **Call optimization**:
     - Use the coding capability of Byteplus ModelArk to implicitly pass known parameters. For example, you can call `submit_order` without declaring `user_id` again.
     - Merge functions that are executed together in a fixed order. For example, you can combine `query_location` and `mark_location` into `query_and_mark_location`.
   - **Quantity and performance**: Limit the number of functions to 20 or fewer, leverage the debugger of Byteplus ModelArk to improve function schemas, and use fine-tuning to increase accuracy in complex scenarios.

ModelArk offers a variety of models. Use the tutorials or API references provided to easily integrate model services into your applications.

| | | | \
| |\
|![Image](<https://p9-arcosite.byteimg.com/tos-cn-i-goo7wpa0wc/d6ae9122635a4eeaad125b6f5205e3e6~tplv-goo7wpa0wc-image.image> =1000x) |\
|<div style="width:180px"></div> | |\
| |![Image](<https://p9-arcosite.byteimg.com/tos-cn-i-goo7wpa0wc/0a8cffd1b3b3457394ae24aa7f033697~tplv-goo7wpa0wc-image.image> =256x) |\
| |<div style="width:200px"></div> | |\
| | |![Image](<https://p9-arcosite.byteimg.com/tos-cn-i-goo7wpa0wc/70a097c751d2469b8054b0eaeeb036b1~tplv-goo7wpa0wc-image.image> =260x) |\

|                                                                                                               |                                                                                                             | <div style="width:200px"></div>                                                                                     |
| ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | --- |
|                                                                                                               |                                                                                                             |                                                                                                                     | \   |
| <span id="62b9b486"></span>                                                                                   | \                                                                                                           |
| ### [seed-2-0-lite](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=seed-2-0-lite) | \                                                                                                           |
| **Flagship general-purpose agentic model**                                                                    | \                                                                                                           |
| Built for complex reasoning and long-chain, multi-step task execution in the Agent era                        | \                                                                                                           |
|                                                                                                               | <span id="de8b3623"></span>                                                                                 | \                                                                                                                   |
|                                                                                                               | ### [seedream-5-0](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=seedream-5-0) | \                                                                                                                   |
|                                                                                                               | **Leading image generation model**                                                                          | \                                                                                                                   |
|                                                                                                               | Enhanced reference consistency and improved generation quality for professional scenarios                   | <span id="782f1ed2"></span>                                                                                         | \   |
|                                                                                                               |                                                                                                             | ### [seedance-1-5-pro](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=seedance-1-5-pro) | \   |
|                                                                                                               |                                                                                                             | **Mainline video generation model**                                                                                 | \   |
|                                                                                                               |                                                                                                             | High-fidelity audio–visual synchronization, cinematic-level motion quality and emotional expression                 |

<span id="898d064d"></span>

# Deep reasoning

Tutorial: [Deep reasoning](/docs/ModelArk/1449737) | APIs: <a href="https://docs.byteplus.com/en/docs/ModelArk/Chat">Chat API</a>, <a href="https://docs.byteplus.com/en/docs/ModelArk/Create_model_request">Responses API</a>

| | | | | \

| Model ID                                                                                                               | Capabilities              | Length Limits (Tokens)                      | Rate Limits |
| ---------------------------------------------------------------------------------------------------------------------- | ------------------------- | ------------------------------------------- | ----------- | --- |
|                                                                                                                        |                           |                                             |             | \   |
| [seed-2-0-lite-260228](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=seed-2-0-lite)       | Deep Reasoning            | \                                           |
|                                                                                                                        | Text Generation           | \                                           |
|                                                                                                                        | Multi-modal Understanding | \                                           |
|                                                                                                                        | Function Calling          | Context Length: 256K                        | \           |
|                                                                                                                        |                           | Max Input: 256K                             | \           |
|                                                                                                                        |                           | Max Output (incl. CoT): 128K, (Default: 4K) | \           |
|                                                                                                                        |                           | Max CoT: 128K                               | 30K RPM     | \   |
|                                                                                                                        |                           |                                             | 1500K TPM   |
|                                                                                                                        |                           |                                             |             | \   |
| [seed-2-0-mini-260215](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=seed-2-0-mini)       | Deep Reasoning            | \                                           |
|                                                                                                                        | Text Generation           | \                                           |
|                                                                                                                        | Multi-modal Understanding | \                                           |
|                                                                                                                        | Function Calling          | Context Length: 256K                        | \           |
|                                                                                                                        |                           | Max Input: 256K                             | \           |
|                                                                                                                        |                           | Max Output (incl. CoT): 128K, (Default: 4K) | \           |
|                                                                                                                        |                           | Max CoT: 128K                               | 30K RPM     | \   |
|                                                                                                                        |                           |                                             | 1500K TPM   |
|                                                                                                                        |                           |                                             |             | \   |
| [seed-1-8-251228](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=seed-1-8)                 | \                         |
|                                                                                                                        | Deep Reasoning            | \                                           |
|                                                                                                                        | Text Generation           | \                                           |
|                                                                                                                        | Multi-modal Understanding | \                                           |
|                                                                                                                        | Function Calling          | \                                           |
|                                                                                                                        | Structured Output         | Context Length: 256K                        | \           |
|                                                                                                                        |                           | Max Input: 224K                             | \           |
|                                                                                                                        |                           | Max Output (incl. CoT): 64K, (Default: 4K)  | \           |
|                                                                                                                        |                           | Max CoT: 32K                                | 30K RPM     | \   |
|                                                                                                                        |                           |                                             | 1500K TPM   |
|                                                                                                                        |                           |                                             |             | \   |
| [glm-4-7-251222](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=glm-4-7)                   | Deep Reasoning            | \                                           |
|                                                                                                                        | Text Generation           | \                                           |
|                                                                                                                        | Function Calling          | Context Length: 256K                        | \           |
|                                                                                                                        |                           | Max Input: 224K                             | \           |
|                                                                                                                        |                           | Max Output (incl. CoT): 128K, (Default: 4K) | \           |
|                                                                                                                        |                           | Max CoT: 128K                               | \           |
|                                                                                                                        |                           |                                             | 15K RPM     | \   |
|                                                                                                                        |                           |                                             | 1500k TPM   |
|                                                                                                                        |                           |                                             |             | \   |
| [deepseek-v3-2-251201](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=deepseek-v3-2)       | Deep Reasoning            | \                                           |
|                                                                                                                        | Text Generation           | \                                           |
|                                                                                                                        | Function Calling          | Context Length: 128K                        | \           |
|                                                                                                                        |                           | Max Input: 128K                             | \           |
|                                                                                                                        |                           | Max Output (incl. CoT): 32K, (Default: 4K)  | \           |
|                                                                                                                        |                           | Max CoT: 32K                                | \           |
|                                                                                                                        |                           |                                             | 15K RPM     | \   |
|                                                                                                                        |                           |                                             | 1500K TPM   |
|                                                                                                                        |                           |                                             |             | \   |
| [kimi-k2-thinking-251104](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=kimi-k2-thinking) | Deep Reasoning            | \                                           |
|                                                                                                                        | Text Generation           | \                                           |
|                                                                                                                        | Function Calling          | Context Length: 256K                        | \           |
|                                                                                                                        |                           | Max Input: 224K                             | \           |
|                                                                                                                        |                           | Max Output (incl. CoT): 32K, (Default: 4K)  | \           |
|                                                                                                                        |                           | Max CoT: 32K                                | \           |
|                                                                                                                        |                           |                                             | 5K RPM      | \   |
|                                                                                                                        |                           |                                             | 500K TPM    |
|                                                                                                                        |                           |                                             |             | \   |
| [deepseek-v3-1-250821](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=deepseek-v3-1)       | Deep Reasoning            | \                                           |
|                                                                                                                        | Text Generation           | \                                           |
|                                                                                                                        | Function Calling          | Context Length: 128K                        | \           |
|                                                                                                                        |                           | Max Input: 96K                              | \           |
|                                                                                                                        |                           | Max Output (incl. CoT): 32K, (Default: 4K)  | \           |
|                                                                                                                        |                           | Max CoT: 32K                                | \           |
|                                                                                                                        |                           |                                             | 15K RPM     | \   |
|                                                                                                                        |                           |                                             | 800K TPM    |
|                                                                                                                        |                           |                                             |             | \   |
| [gpt-oss-120b-250805](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=gpt-oss-120b)         | Deep Reasoning            | \                                           |
|                                                                                                                        | Text Generation           | \                                           |
|                                                                                                                        | Function Calling          | Context Length: 128K                        | \           |
|                                                                                                                        |                           | Max Input: 96K                              | \           |
|                                                                                                                        |                           | Max Output (incl. CoT): 64K, (Default: 4K)  | \           |
|                                                                                                                        |                           | Max CoT: 32K                                | \           |
|                                                                                                                        |                           |                                             | 15K RPM     | \   |
|                                                                                                                        |                           |                                             | 800K TPM    |
|                                                                                                                        |                           |                                             |             | \   |
| [seed-1-6-250915](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=seed-1-6)                 | Deep Reasoning            | \                                           |
|                                                                                                                        | Text Generation           | \                                           |
|                                                                                                                        | Image Understanding       | \                                           |
|                                                                                                                        | Video Understanding       | \                                           |
|                                                                                                                        | Structured Output         | \                                           |
|                                                                                                                        | Function Calling          | Context Length: 256K                        | \           |
|                                                                                                                        |                           | Max Input: 224K                             | \           |
|                                                                                                                        |                           | Max Output (incl. CoT): 32K, (Default: 4K)  | \           |
|                                                                                                                        |                           | Max CoT: 32K                                | 15K RPM     | \   |
|                                                                                                                        |                           |                                             | 800K TPM    |
|                                                                                                                        |                           |                                             |             | \   |
| [seed-1-6-250615](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=seed-1-6)                 | Deep Reasoning            | \                                           |
|                                                                                                                        | Text Generation           | \                                           |
|                                                                                                                        | Visual Grounding          | \                                           |
|                                                                                                                        | Image Understanding       | \                                           |
|                                                                                                                        | Video Understanding       | \                                           |
|                                                                                                                        | Structured Output         | \                                           |
|                                                                                                                        | Function Calling          | Context Length: 256K                        | \           |
|                                                                                                                        |                           | Max Input: 224K                             | \           |
|                                                                                                                        |                           | Max Output (incl. CoT): 32K, (Default: 4K)  | \           |
|                                                                                                                        |                           | Max CoT: 32K                                | 15K RPM     | \   |
|                                                                                                                        |                           |                                             | 800K TPM    |
|                                                                                                                        |                           |                                             |             | \   |
| [seed-1-6-flash-250715](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=seed-1-6-flash)     | Deep Reasoning            | \                                           |
|                                                                                                                        | Text Generation           | \                                           |
|                                                                                                                        | Visual Grounding          | \                                           |
|                                                                                                                        | Image Understanding       | \                                           |
|                                                                                                                        | Video Understanding       | \                                           |
|                                                                                                                        | Structured Output         | \                                           |
|                                                                                                                        | Function Calling          | Context Length: 256K                        | \           |
|                                                                                                                        |                           | Max Input: 224K                             | \           |
|                                                                                                                        |                           | Max Output (incl. CoT): 32K, (Default: 4K)  | \           |
|                                                                                                                        |                           | Max CoT: 32K                                | 15K RPM     | \   |
|                                                                                                                        |                           |                                             | 800K TPM    |
|                                                                                                                        |                           |                                             |             | \   |
| [seed-1-6-flash-250615](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=seed-1-6-flash)     | Deep Reasoning            | \                                           |
|                                                                                                                        | Text Generation           | \                                           |
|                                                                                                                        | Image Understanding       | \                                           |
|                                                                                                                        | Video Understanding       | \                                           |
|                                                                                                                        | Structured Output         | \                                           |
|                                                                                                                        | Function Calling          | Context Length: 256K                        | \           |
|                                                                                                                        |                           | Max Input: 224K                             | \           |
|                                                                                                                        |                           | Max Output (incl. CoT): 32K, (Default: 4K)  | \           |
|                                                                                                                        |                           | Max CoT: 32K                                | 15K RPM     | \   |
|                                                                                                                        |                           |                                             | 800K TPM    |
|                                                                                                                        |                           |                                             |             | \   |
| [deepseek-r1-250528](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=deepseek-r1)           | Deep Reasoning            | \                                           |
|                                                                                                                        | Function Calling          | Context Length: 128K                        | \           |
|                                                                                                                        |                           | Max Input: 96K                              | \           |
|                                                                                                                        |                           | Max Output (incl. CoT): 48K, (Default: 4K)  | \           |
|                                                                                                                        |                           | Max CoT: 32K                                | 15K RPM     | \   |
|                                                                                                                        |                           |                                             | 800K TPM    |
|                                                                                                                        |                           |                                             |             | \   |
| [deepseek-r1-250120](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=deepseek-r1)           | \                         |
| (Deactivated)                                                                                                          | Deep Reasoning            | \                                           |
|                                                                                                                        | Function Calling          | Context Length: 96K                         | \           |
|                                                                                                                        |                           | Max Input: 64K                              | \           |
|                                                                                                                        |                           | Max Output (incl. CoT): 48K, (Default: 4K)  | \           |
|                                                                                                                        |                           | Max CoT: 32K                                | 15K RPM     | \   |
|                                                                                                                        |                           |                                             | 800K TPM    |

<span id="b318deb2"></span>

# Text generation

Tutorials [Text generation](/docs/ModelArk/1399009) | API: <a href="https://docs.byteplus.com/en/docs/ModelArk/Chat">Chat API</a>, <a href="https://docs.byteplus.com/en/docs/ModelArk/Create_model_request">Responses API</a>

| | | | | \

| Model ID                                                                                                               | Capabilities              | Length Limits (Tokens)                      | Rate Limits |
| ---------------------------------------------------------------------------------------------------------------------- | ------------------------- | ------------------------------------------- | ----------- | --- |
|                                                                                                                        |                           |                                             |             | \   |
| [seed-2-0-lite-260228](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=seed-2-0-lite)       | Deep Reasoning            | \                                           |
|                                                                                                                        | Text Generation           | \                                           |
|                                                                                                                        | Multi-modal Understanding | \                                           |
|                                                                                                                        | Function Calling          | Context Length: 256K                        | \           |
|                                                                                                                        |                           | Max Input: 256K                             | \           |
|                                                                                                                        |                           | Max Output (incl. CoT): 128K, (Default: 4K) | \           |
|                                                                                                                        |                           | Max CoT: 128K                               | 30K RPM     | \   |
|                                                                                                                        |                           |                                             | 1500K TPM   |
|                                                                                                                        |                           |                                             |             | \   |
| [seed-2-0-mini-260215](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=seed-2-0-mini)       | \                         |
|                                                                                                                        | Deep Reasoning            | \                                           |
|                                                                                                                        | Text Generation           | \                                           |
|                                                                                                                        | Multi-modal Understanding | \                                           |
|                                                                                                                        | Function Calling          | Context Length: 256K                        | \           |
|                                                                                                                        |                           | Max Input: 256K                             | \           |
|                                                                                                                        |                           | Max Output (incl. CoT): 128K, (Default: 4K) | \           |
|                                                                                                                        |                           | Max CoT: 128K                               | 30K RPM     | \   |
|                                                                                                                        |                           |                                             | 1500K TPM   |
|                                                                                                                        |                           |                                             |             | \   |
| [seed-1-8-251228](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=seed-1-8)                 | Deep Reasoning            | \                                           |
|                                                                                                                        | Text Generation           | \                                           |
|                                                                                                                        | Multi-modal Understanding | \                                           |
|                                                                                                                        | Function Calling          | \                                           |
|                                                                                                                        | Structured Output         | Context Length: 256K                        | \           |
|                                                                                                                        |                           | Max Input: 224K                             | \           |
|                                                                                                                        |                           | Max Output (incl. CoT): 64K, (Default: 4K)  | \           |
|                                                                                                                        |                           | Max CoT: 32K                                | 30K RPM     | \   |
|                                                                                                                        |                           |                                             | 1500K TPM   |
|                                                                                                                        |                           |                                             |             | \   |
| [glm-4-7-251222](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=glm-4-7)                   | Deep Reasoning            | \                                           |
|                                                                                                                        | Text Generation           | \                                           |
|                                                                                                                        | Function Calling          | Context Length: 256K                        | \           |
|                                                                                                                        |                           | Max Input: 224K                             | \           |
|                                                                                                                        |                           | Max Output (incl. CoT): 128K, (Default: 4K) | \           |
|                                                                                                                        |                           | Max CoT: 128K                               | \           |
|                                                                                                                        |                           |                                             | 15K RPM     | \   |
|                                                                                                                        |                           |                                             | 1500K TPM   |
|                                                                                                                        |                           |                                             |             | \   |
| [deepseek-v3-2-251201](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=deepseek-v3-2)       | Deep Reasoning            | \                                           |
|                                                                                                                        | Text Generation           | \                                           |
|                                                                                                                        | Function Calling          | Context Length: 128K                        | \           |
|                                                                                                                        |                           | Max Input: 128K                             | \           |
|                                                                                                                        |                           | Max Output (incl. CoT): 32K, (Default: 4K)  | \           |
|                                                                                                                        |                           | Max CoT: 32K                                | \           |
|                                                                                                                        |                           |                                             | 15K RPM     | \   |
|                                                                                                                        |                           |                                             | 1500K TPM   |
|                                                                                                                        |                           |                                             |             | \   |
| [deepseek-v3-1-250821](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=deepseek-v3-1)       | Deep Reasoning            | \                                           |
|                                                                                                                        | Text Generation           | \                                           |
|                                                                                                                        | Function Calling          | Context Length: 128K                        | \           |
|                                                                                                                        |                           | Max Input: 96K                              | \           |
|                                                                                                                        |                           | Max Output (incl. CoT): 32K, (Default: 4K)  | \           |
|                                                                                                                        |                           | Max CoT: 32K                                | 15K RPM     | \   |
|                                                                                                                        |                           |                                             | 800K TPM    |
|                                                                                                                        |                           |                                             |             | \   |
| [seed-1-6-250915](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=seed-1-6)                 | Deep Reasoning            | \                                           |
|                                                                                                                        | Text Generation           | \                                           |
|                                                                                                                        | Image Understanding       | \                                           |
|                                                                                                                        | Video Understanding       | \                                           |
|                                                                                                                        | Structured Output         | \                                           |
|                                                                                                                        | Function Calling          | Context Length: 256K                        | \           |
|                                                                                                                        |                           | Max Input: 224K                             | \           |
|                                                                                                                        |                           | Max Output (incl. CoT): 32K, (Default: 4K)  | \           |
|                                                                                                                        |                           | Max CoT: 32K                                | 15K RPM     | \   |
|                                                                                                                        |                           |                                             | 800K TPM    |
|                                                                                                                        |                           |                                             |             | \   |
| [seed-1-6-250615](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=seed-1-6)                 | Deep Reasoning            | \                                           |
|                                                                                                                        | Text Generation           | \                                           |
|                                                                                                                        | Image Understanding       | \                                           |
|                                                                                                                        | Video Understanding       | \                                           |
|                                                                                                                        | Structured Output         | \                                           |
|                                                                                                                        | Function Calling          | Context Length: 256K                        | \           |
|                                                                                                                        |                           | Max Input: 224K                             | \           |
|                                                                                                                        |                           | Max Output (incl. CoT): 32K, (Default: 4K)  | \           |
|                                                                                                                        |                           | Max CoT: 32K                                | 15K RPM     | \   |
|                                                                                                                        |                           |                                             | 800K TPM    |
|                                                                                                                        |                           |                                             |             | \   |
| [seed-1-6-flash-250715](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=seed-1-6-flash)     | Deep Reasoning            | \                                           |
|                                                                                                                        | Text Generation           | \                                           |
|                                                                                                                        | Image Understanding       | \                                           |
|                                                                                                                        | Video Understanding       | \                                           |
|                                                                                                                        | Structured Output         | \                                           |
|                                                                                                                        | Function Calling          | Context Length: 256K                        | \           |
|                                                                                                                        |                           | Max Input: 224K                             | \           |
|                                                                                                                        |                           | Max Output (incl. CoT): 32K, (Default: 4K)  | \           |
|                                                                                                                        |                           | Max CoT: 32K                                | 15K RPM     | \   |
|                                                                                                                        |                           |                                             | 800K TPM    |
|                                                                                                                        |                           |                                             |             | \   |
| [seed-1-6-flash-250615](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=seed-1-6-flash)     | Deep Reasoning            | \                                           |
|                                                                                                                        | Text Generation           | \                                           |
|                                                                                                                        | Image Understanding       | \                                           |
|                                                                                                                        | Video Understanding       | \                                           |
|                                                                                                                        | Structured Output         | \                                           |
|                                                                                                                        | Function Calling          | Context Length: 256K                        | \           |
|                                                                                                                        |                           | Max Input: 224K                             | \           |
|                                                                                                                        |                           | Max Output (incl. CoT): 32K, (Default: 4K)  | \           |
|                                                                                                                        |                           | Max CoT: 32K                                | 15K RPM     | \   |
|                                                                                                                        |                           |                                             | 800K TPM    |
|                                                                                                                        |                           |                                             |             | \   |
| [kimi-k2-thinking-251104](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=kimi-k2-thinking) | Deep Reasoning            | \                                           |
|                                                                                                                        | Text Generation           | \                                           |
|                                                                                                                        | Function Calling          | Context Length: 256K                        | \           |
|                                                                                                                        |                           | Max Input: 224K                             | \           |
|                                                                                                                        |                           | Max Output (incl. CoT): 32K, (Default: 4K)  | \           |
|                                                                                                                        |                           | Max CoT: 32K                                | 5K RPM      | \   |
|                                                                                                                        |                           |                                             | 500K TPM    |
|                                                                                                                        |                           |                                             |             | \   |
| [kimi-k2-250905](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=kimi-k2)                   | Text Generation           | \                                           |
|                                                                                                                        | Function Calling          | Context Length: 256K                        | \           |
|                                                                                                                        |                           | Max Input: 224K                             | \           |
|                                                                                                                        |                           | Max Output: 32K, (Default: 4K)              | \           |
|                                                                                                                        |                           | Max CoT: \-                                 | 5K RPM      | \   |
|                                                                                                                        |                           |                                             | 500K TPM    |
|                                                                                                                        |                           |                                             |             | \   |
| [kimi-k2-250711](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=kimi-k2)                   | \                         |
| (Deactivated)                                                                                                          | Text Generation           | \                                           |
|                                                                                                                        | Function Calling          | Context Length: 256K                        | \           |
|                                                                                                                        |                           | Max Input: 224K                             | \           |
|                                                                                                                        |                           | Max Output: 32K, (Default: 4K)              | \           |
|                                                                                                                        |                           | Max CoT: \-                                 | 5K RPM      | \   |
|                                                                                                                        |                           |                                             | 500K TPM    |
|                                                                                                                        |                           |                                             |             | \   |
| [deepseek-v3-250324](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=deepseek-v3)           | \                         |
| (Deactivated)                                                                                                          | Text Generation           | \                                           |
|                                                                                                                        | Function Calling          | Context Length: 128K                        | \           |
|                                                                                                                        |                           | Max Input: \-                               | \           |
|                                                                                                                        |                           | Max Output: 16K (Default: 4K)               | \           |
|                                                                                                                        |                           | Max CoT: \-                                 | 15K RPM     | \   |
|                                                                                                                        |                           |                                             | 800K TPM    |
|                                                                                                                        |                           |                                             |             | \   |
| [skylark-pro-250415](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=skylark-pro)           | \                         |
| (Deactivated)                                                                                                          | Long text                 | Context Length: 128K                        | \           |
|                                                                                                                        |                           | Max Input: \-                               | \           |
|                                                                                                                        |                           | Max Output (incl. CoT): 12K (Default: 4K)   | \           |
|                                                                                                                        |                           | Max CoT: \-                                 | 15K RPM     | \   |
|                                                                                                                        |                           |                                             | 800K TPM    |

<span id="ff5ef604"></span>

# Visual understanding

Tutorials: [Image understanding](/docs/ModelArk/1362931), [Video understanding](/docs/ModelArk/1895586) and [Document understanding](/docs/ModelArk/1902647) | API: <a href="https://docs.byteplus.com/en/docs/ModelArk/Chat">Chat API</a>, <a href="https://docs.byteplus.com/en/docs/ModelArk/Create_model_request">Responses API</a>

| | | | | \
|Model ID |Capabilities |Length Limits |\

|                                                                                                                    |                           | (Tokens)                                    | Rate Limits |
| ------------------------------------------------------------------------------------------------------------------ | ------------------------- | ------------------------------------------- | ----------- | --- |
|                                                                                                                    |                           |                                             |             | \   |
| [seed-2-0-lite-260228](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=seed-2-0-lite)   | Deep Reasoning            | \                                           |
|                                                                                                                    | Text Generation           | \                                           |
|                                                                                                                    | Multi-modal Understanding | \                                           |
|                                                                                                                    | Function Calling          | Context Length: 256K                        | \           |
|                                                                                                                    |                           | Max Input: 256K                             | \           |
|                                                                                                                    |                           | Max Output (incl. CoT): 128K, (Default: 4K) | \           |
|                                                                                                                    |                           | Max CoT: 128K                               | 30K RPM     | \   |
|                                                                                                                    |                           |                                             | 1500K TPM   |
|                                                                                                                    |                           |                                             |             | \   |
| [seed-2-0-mini-260215](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=seed-2-0-mini)   | \                         |
|                                                                                                                    | Deep Reasoning            | \                                           |
|                                                                                                                    | Text Generation           | \                                           |
|                                                                                                                    | Multi-modal Understanding | \                                           |
|                                                                                                                    | Visual Grounding          | \                                           |
|                                                                                                                    | Function Calling          | Context Length: 256K                        | \           |
|                                                                                                                    |                           | Max Input: 256K                             | \           |
|                                                                                                                    |                           | Max Output (incl. CoT): 128K, (Default: 4K) | \           |
|                                                                                                                    |                           | Max CoT: 128K                               | 30K RPM     | \   |
|                                                                                                                    |                           |                                             | 1500K TPM   |
|                                                                                                                    |                           |                                             |             | \   |
| [seed-1-8-251228](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=seed-1-8)             | Deep Reasoning            | \                                           |
|                                                                                                                    | Text Generation           | \                                           |
|                                                                                                                    | Multi-modal Understanding | \                                           |
|                                                                                                                    | Visual Grounding          | \                                           |
|                                                                                                                    | Function Calling          | \                                           |
|                                                                                                                    | Structured Output         | Context Length: 256K                        | \           |
|                                                                                                                    |                           | Max Input: 224K                             | \           |
|                                                                                                                    |                           | Max Output (incl. CoT): 64K, (Default: 4K)  | \           |
|                                                                                                                    |                           | Max CoT: 32K                                | 30K RPM     | \   |
|                                                                                                                    |                           |                                             | 1500K TPM   |
|                                                                                                                    |                           |                                             |             | \   |
| [seed-1-6-250915](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=seed-1-6)             | Deep Reasoning            | \                                           |
|                                                                                                                    | Text Generation           | \                                           |
|                                                                                                                    | Image Understanding       | \                                           |
|                                                                                                                    | Video Understanding       | \                                           |
|                                                                                                                    | Structured Output         | \                                           |
|                                                                                                                    | Function Calling          | Context Length: 256K                        | \           |
|                                                                                                                    |                           | Max Input: 224K                             | \           |
|                                                                                                                    |                           | Max Output (incl. CoT): 32K, (Default: 4K)  | \           |
|                                                                                                                    |                           | Max CoT: 32K                                | 15K RPM     | \   |
|                                                                                                                    |                           |                                             | 800K TPM    |
|                                                                                                                    |                           |                                             |             | \   |
| [seed-1-6-250615](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=seed-1-6)             | Deep Reasoning            | \                                           |
|                                                                                                                    | Text Generation           | \                                           |
|                                                                                                                    | Image Understanding       | \                                           |
|                                                                                                                    | Video Understanding       | \                                           |
|                                                                                                                    | Visual Grounding          | \                                           |
|                                                                                                                    | Structured Output         | \                                           |
|                                                                                                                    | Function Calling          | Context Length: 256K                        | \           |
|                                                                                                                    |                           | Max Input: 224K                             | \           |
|                                                                                                                    |                           | Max Output (incl. CoT): 32K, (Default: 4K)  | \           |
|                                                                                                                    |                           | Max CoT: 32K                                | 15K RPM     | \   |
|                                                                                                                    |                           |                                             | 800K TPM    |
|                                                                                                                    |                           |                                             |             | \   |
| [seed-1-6-flash-250715](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=seed-1-6-flash) | Deep Reasoning            | \                                           |
|                                                                                                                    | Text Generation           | \                                           |
|                                                                                                                    | Image Understanding       | \                                           |
|                                                                                                                    | Video Understanding       | \                                           |
|                                                                                                                    | Visual Grounding          | \                                           |
|                                                                                                                    | Structured Output         | \                                           |
|                                                                                                                    | Function Calling          | Context Length: 256K                        | \           |
|                                                                                                                    |                           | Max Input: 224K                             | \           |
|                                                                                                                    |                           | Max Output (incl. CoT): 32K, (Default: 4K)  | \           |
|                                                                                                                    |                           | Max CoT: 32K                                | 15K RPM     | \   |
|                                                                                                                    |                           |                                             | 800K TPM    |
|                                                                                                                    |                           |                                             |             | \   |
| [seed-1-6-flash-250615](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=seed-1-6-flash) | Deep Reasoning            | \                                           |
|                                                                                                                    | Text Generation           | \                                           |
|                                                                                                                    | Image Understanding       | \                                           |
|                                                                                                                    | Video Understanding       | \                                           |
|                                                                                                                    | Visual Grounding          | \                                           |
|                                                                                                                    | Structured Output         | \                                           |
|                                                                                                                    | Function Calling          | Context Length: 256K                        | \           |
|                                                                                                                    |                           | Max Input: 224K                             | \           |
|                                                                                                                    |                           | Max Output (incl. CoT): 32K, (Default: 4K)  | \           |
|                                                                                                                    |                           | Max CoT: 32K                                | 15K RPM     | \   |
|                                                                                                                    |                           |                                             | 800K TPM    |
|                                                                                                                    |                           |                                             |             | \   |
| [skylark-vision-250515](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=skylark-vision) | \                         |
| (Deactivated)                                                                                                      | Text Generation           | \                                           |
|                                                                                                                    | Image Understanding       | \                                           |
|                                                                                                                    | Video Understanding       | \                                           |
|                                                                                                                    | Structured Output         | Context Length: 128K                        | \           |
|                                                                                                                    |                           | Max Input: 12K                              | \           |
|                                                                                                                    |                           | Max Output: 12K, (Default: 4K)              | \           |
|                                                                                                                    |                           | Max CoT: \-                                 | 15K RPM     | \   |
|                                                                                                                    |                           |                                             | 800K TPM    |

<span id="243969e9"></span>

# **Tool calling**

| | ||| |||| || \
|**Model ID** |**Tools** | | |**Length limits (tokens)** | | | |**Rate limits** | |
|^^| | | | | | | | | | \
| |Function |\
| |call |Knowledge |\
| | |base |MCP |Context |\
| | | | |window |Max |\
| | | | | |input |Max |\
| | | | | | |output |Max |\

|                                                                                                                    |                                                                                                                                   |                                                                                                                                   |                                                                                                                                   |      |      |      | reasoning | RPM  | TPM    |
| ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ---- | ---- | ---- | --------- | ---- | ------ | --- |
|                                                                                                                    |                                                                                                                                   |                                                                                                                                   |                                                                                                                                   |      |      |      |           |      |        | \   |
| [seed-2-0-lite-260215](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=seed-2-0-lite)   | ![Image](<https://p9-arcosite.byteimg.com/tos-cn-i-goo7wpa0wc/9f2ad4ff8bb84206bc9aeeaf21916004~tplv-goo7wpa0wc-image.image> =22x) | ![Image](<https://p9-arcosite.byteimg.com/tos-cn-i-goo7wpa0wc/bb929c4e1c2443719cf7bc5219198170~tplv-goo7wpa0wc-image.image> =22x) | ![Image](<https://p9-arcosite.byteimg.com/tos-cn-i-goo7wpa0wc/9f2ad4ff8bb84206bc9aeeaf21916004~tplv-goo7wpa0wc-image.image> =22x) | 256k | 256k | 128k | 128k      | 30k  | 30000k |
|                                                                                                                    |                                                                                                                                   |                                                                                                                                   |                                                                                                                                   |      |      |      |           |      |        | \   |
| [seed-2-0-mini-260215](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=seed-2-0-mini)   | ![Image](<https://p9-arcosite.byteimg.com/tos-cn-i-goo7wpa0wc/9f2ad4ff8bb84206bc9aeeaf21916004~tplv-goo7wpa0wc-image.image> =22x) | ![Image](<https://p9-arcosite.byteimg.com/tos-cn-i-goo7wpa0wc/9f2ad4ff8bb84206bc9aeeaf21916004~tplv-goo7wpa0wc-image.image> =22x) | ![Image](<https://p9-arcosite.byteimg.com/tos-cn-i-goo7wpa0wc/9f2ad4ff8bb84206bc9aeeaf21916004~tplv-goo7wpa0wc-image.image> =22x) | 256k | 256k | 128k | 128k      | 30k  | 15000k |
|                                                                                                                    |                                                                                                                                   |                                                                                                                                   |                                                                                                                                   |      |      |      |           |      |        | \   |
| [seed-1-8-251228](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=seed-1-8)             | ![Image](<https://p9-arcosite.byteimg.com/tos-cn-i-goo7wpa0wc/9f2ad4ff8bb84206bc9aeeaf21916004~tplv-goo7wpa0wc-image.image> =22x) | ![Image](<https://p9-arcosite.byteimg.com/tos-cn-i-goo7wpa0wc/9f2ad4ff8bb84206bc9aeeaf21916004~tplv-goo7wpa0wc-image.image> =22x) | ![Image](<https://p9-arcosite.byteimg.com/tos-cn-i-goo7wpa0wc/9f2ad4ff8bb84206bc9aeeaf21916004~tplv-goo7wpa0wc-image.image> =22x) | 256k | 224k | 64k  | 32k       | 30k  | 5000k  |
|                                                                                                                    |                                                                                                                                   |                                                                                                                                   |                                                                                                                                   |      |      |      |           |      |        | \   |
| [seed-1-6-250915](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=seed-1-6)             | ![Image](<https://p9-arcosite.byteimg.com/tos-cn-i-goo7wpa0wc/9f2ad4ff8bb84206bc9aeeaf21916004~tplv-goo7wpa0wc-image.image> =22x) | ![Image](<https://p9-arcosite.byteimg.com/tos-cn-i-goo7wpa0wc/9f2ad4ff8bb84206bc9aeeaf21916004~tplv-goo7wpa0wc-image.image> =22x) | ![Image](<https://p9-arcosite.byteimg.com/tos-cn-i-goo7wpa0wc/9f2ad4ff8bb84206bc9aeeaf21916004~tplv-goo7wpa0wc-image.image> =22x) | 256k | 224k | 32k  | 32k       | 10k  | 5000k  |
|                                                                                                                    |                                                                                                                                   |                                                                                                                                   |                                                                                                                                   |      |      |      |           |      |        | \   |
| [seed-1-6-250615](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=seed-1-6)             | ![Image](<https://p9-arcosite.byteimg.com/tos-cn-i-goo7wpa0wc/9f2ad4ff8bb84206bc9aeeaf21916004~tplv-goo7wpa0wc-image.image> =22x) | ![Image](<https://p9-arcosite.byteimg.com/tos-cn-i-goo7wpa0wc/9f2ad4ff8bb84206bc9aeeaf21916004~tplv-goo7wpa0wc-image.image> =22x) | ![Image](<https://p9-arcosite.byteimg.com/tos-cn-i-goo7wpa0wc/9f2ad4ff8bb84206bc9aeeaf21916004~tplv-goo7wpa0wc-image.image> =22x) | 256k | 224k | 32k  | 32k       | 10k  | 5000k  |
|                                                                                                                    |                                                                                                                                   |                                                                                                                                   |                                                                                                                                   |      |      |      |           |      |        | \   |
| [seed-1-6-flash-250715](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=seed-1-6-flash) | ![Image](<https://p9-arcosite.byteimg.com/tos-cn-i-goo7wpa0wc/9f2ad4ff8bb84206bc9aeeaf21916004~tplv-goo7wpa0wc-image.image> =22x) | ![Image](<https://p9-arcosite.byteimg.com/tos-cn-i-goo7wpa0wc/9f2ad4ff8bb84206bc9aeeaf21916004~tplv-goo7wpa0wc-image.image> =22x) | \                                                                                                                                 |
|                                                                                                                    |                                                                                                                                   |                                                                                                                                   | ![Image](<https://p9-arcosite.byteimg.com/tos-cn-i-goo7wpa0wc/9f2ad4ff8bb84206bc9aeeaf21916004~tplv-goo7wpa0wc-image.image> =22x) | 256k | 224k | 32k  | 32k       | 150k | 10000k |
|                                                                                                                    |                                                                                                                                   |                                                                                                                                   |                                                                                                                                   |      |      |      |           |      |        | \   |
| [seed-1-6-flash-250615](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=seed-1-6-flash) | ![Image](<https://p9-arcosite.byteimg.com/tos-cn-i-goo7wpa0wc/9f2ad4ff8bb84206bc9aeeaf21916004~tplv-goo7wpa0wc-image.image> =22x) | ![Image](<https://p9-arcosite.byteimg.com/tos-cn-i-goo7wpa0wc/9f2ad4ff8bb84206bc9aeeaf21916004~tplv-goo7wpa0wc-image.image> =22x) | \                                                                                                                                 |
|                                                                                                                    |                                                                                                                                   |                                                                                                                                   | ![Image](<https://p9-arcosite.byteimg.com/tos-cn-i-goo7wpa0wc/9f2ad4ff8bb84206bc9aeeaf21916004~tplv-goo7wpa0wc-image.image> =22x) | 256k | 224k | 32k  | 32k       | 150k | 10000k |
|                                                                                                                    |                                                                                                                                   |                                                                                                                                   |                                                                                                                                   |      |      |      |           |      |        | \   |
| [glm-4-7](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=glm-4-7)                      | ![Image](<https://p9-arcosite.byteimg.com/tos-cn-i-goo7wpa0wc/9f2ad4ff8bb84206bc9aeeaf21916004~tplv-goo7wpa0wc-image.image> =22x) | ![Image](<https://p9-arcosite.byteimg.com/tos-cn-i-goo7wpa0wc/9f2ad4ff8bb84206bc9aeeaf21916004~tplv-goo7wpa0wc-image.image> =22x) | ![Image](<https://p9-arcosite.byteimg.com/tos-cn-i-goo7wpa0wc/9f2ad4ff8bb84206bc9aeeaf21916004~tplv-goo7wpa0wc-image.image> =22x) | 200k | 200k | 128k | 128k      | 15k  | 1500k  |
|                                                                                                                    |                                                                                                                                   |                                                                                                                                   |                                                                                                                                   |      |      |      |           |      |        | \   |
| [deepseek-v3-2-251201](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=deepseek-v3-2)   | ![Image](<https://p9-arcosite.byteimg.com/tos-cn-i-goo7wpa0wc/9f2ad4ff8bb84206bc9aeeaf21916004~tplv-goo7wpa0wc-image.image> =22x) | ![Image](<https://p9-arcosite.byteimg.com/tos-cn-i-goo7wpa0wc/9f2ad4ff8bb84206bc9aeeaf21916004~tplv-goo7wpa0wc-image.image> =22x) | ![Image](<https://p9-arcosite.byteimg.com/tos-cn-i-goo7wpa0wc/9f2ad4ff8bb84206bc9aeeaf21916004~tplv-goo7wpa0wc-image.image> =22x) | 128k | 96k  | 32k  | 32k       | 15k  | 1500k  |
|                                                                                                                    |                                                                                                                                   |                                                                                                                                   |                                                                                                                                   |      |      |      |           |      |        | \   |
| [deepseek-v3-1-250821](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=deepseek-v3-1)   | ![Image](<https://p9-arcosite.byteimg.com/tos-cn-i-goo7wpa0wc/9f2ad4ff8bb84206bc9aeeaf21916004~tplv-goo7wpa0wc-image.image> =22x) | ![Image](<https://p9-arcosite.byteimg.com/tos-cn-i-goo7wpa0wc/9f2ad4ff8bb84206bc9aeeaf21916004~tplv-goo7wpa0wc-image.image> =22x) | ![Image](<https://p9-arcosite.byteimg.com/tos-cn-i-goo7wpa0wc/9f2ad4ff8bb84206bc9aeeaf21916004~tplv-goo7wpa0wc-image.image> =22x) | 128k | 96k  | 32k  | 32k       | 15k  | 800k   |

Related documents:

- Supported APIs: [Responses API](https://docs.byteplus.com/en/docs/ModelArk/Create_model_request)
- Tool calling tutorials:
  - [Function calling](/docs/ModelArk/1262342)
  - [Cloud-deployed MCP / remote MCP](/docs/ModelArk/1827534)

<span id="476e6f25"></span>

# Context caching

Overview: [Context caching overview](/docs/ModelArk/1398933) | API：<a href="https://docs.byteplus.com/en/docs/ModelArk/Create_model_request">Responses API</a>, <a href="https://docs.byteplus.com/zh-CN/docs/ModelArk/1346559">Context API</a>
**Note**: Context API is only supported by some legacy models.

| | | | \

| Model ID                                                                                                               | Implicit cache                                                                                       | Explicit cache                                                                   |
| ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | --- |
|                                                                                                                        |                                                                                                      |                                                                                  | \   |
| [seed-2-0-lite-260228](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=seed-2-0-lite)       | \                                                                                                    |
|                                                                                                                        | [Chat API](https://docs.byteplus.com/en/docs/ModelArk/1494384)                                       | [Responses API](https://docs.byteplus.com/en/docs/ModelArk/Create_model_request) | \   |
|                                                                                                                        |                                                                                                      | Prefix Caching                                                                   | \   |
|                                                                                                                        |                                                                                                      | Session Caching                                                                  |
|                                                                                                                        |                                                                                                      |                                                                                  | \   |
| [seed-2-0-mini-260215](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=seed-2-0-mini)       | \                                                                                                    |
|                                                                                                                        | [Chat API](https://docs.byteplus.com/en/docs/ModelArk/1494384)                                       | [Responses API](https://docs.byteplus.com/en/docs/ModelArk/Create_model_request) | \   |
|                                                                                                                        |                                                                                                      | Prefix Caching                                                                   | \   |
|                                                                                                                        |                                                                                                      | Session Caching                                                                  |
|                                                                                                                        |                                                                                                      |                                                                                  | \   |
| [seed-1-8-251228](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=seed-1-8)                 | [Batch API (Chat)](https://docs.byteplus.com/en/docs/ModelArk/1528783)                               | \                                                                                |
|                                                                                                                        | [Batch Inference API (Job)](https://docs.byteplus.com/en/docs/ModelArk/Manage_Batch_Inference_Tasks) | [Responses API](https://docs.byteplus.com/en/docs/ModelArk/Create_model_request) | \   |
|                                                                                                                        |                                                                                                      | Prefix Caching                                                                   | \   |
|                                                                                                                        |                                                                                                      | Session Caching                                                                  |
|                                                                                                                        |                                                                                                      |                                                                                  | \   |
| [glm-4-7-251222](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=glm-4-7)                   | [Batch API (Chat)](https://docs.byteplus.com/en/docs/ModelArk/1528783)                               | \                                                                                |
|                                                                                                                        | [Batch Inference API (Job)](https://docs.byteplus.com/en/docs/ModelArk/Manage_Batch_Inference_Tasks) | [Responses API](https://docs.byteplus.com/en/docs/ModelArk/Create_model_request) | \   |
|                                                                                                                        |                                                                                                      | Prefix Caching                                                                   | \   |
|                                                                                                                        |                                                                                                      | Session Caching                                                                  |
|                                                                                                                        |                                                                                                      |                                                                                  | \   |
| [deepseek-v3-2-251201](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=deepseek-v3-2)       | [Batch API (Chat)](https://docs.byteplus.com/en/docs/ModelArk/1528783)                               | \                                                                                |
|                                                                                                                        | [Batch Inference API (Job)](https://docs.byteplus.com/en/docs/ModelArk/Manage_Batch_Inference_Tasks) | [Responses API](https://docs.byteplus.com/en/docs/ModelArk/Create_model_request) | \   |
|                                                                                                                        |                                                                                                      | Prefix Caching                                                                   | \   |
|                                                                                                                        |                                                                                                      | Session Caching                                                                  |
|                                                                                                                        |                                                                                                      |                                                                                  | \   |
| [seed-1-6-250915](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=seed-1-6)                 | [Batch API (Chat)](https://docs.byteplus.com/en/docs/ModelArk/1528783)                               | \                                                                                |
|                                                                                                                        | [Batch Inference API (Job)](https://docs.byteplus.com/en/docs/ModelArk/Manage_Batch_Inference_Tasks) | [Responses API](https://docs.byteplus.com/en/docs/ModelArk/Create_model_request) | \   |
|                                                                                                                        |                                                                                                      | Prefix Caching                                                                   | \   |
|                                                                                                                        |                                                                                                      | Session Caching                                                                  |
|                                                                                                                        |                                                                                                      |                                                                                  | \   |
| [seed-1-6-250615](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=seed-1-6)                 | [Batch API (Chat)](https://docs.byteplus.com/en/docs/ModelArk/1528783)                               | \                                                                                |
|                                                                                                                        | [Batch Inference API (Job)](https://docs.byteplus.com/en/docs/ModelArk/Manage_Batch_Inference_Tasks) | [Responses API](https://docs.byteplus.com/en/docs/ModelArk/Create_model_request) | \   |
|                                                                                                                        |                                                                                                      | Prefix Caching                                                                   | \   |
|                                                                                                                        |                                                                                                      | Session Caching                                                                  |
|                                                                                                                        |                                                                                                      |                                                                                  | \   |
| [seed-1-6-flash-250715](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=seed-1-6-flash)     | [Batch API (Chat)](https://docs.byteplus.com/en/docs/ModelArk/1528783)                               | \                                                                                |
|                                                                                                                        | [Batch Inference API (Job)](https://docs.byteplus.com/en/docs/ModelArk/Manage_Batch_Inference_Tasks) | [Responses API](https://docs.byteplus.com/en/docs/ModelArk/Create_model_request) | \   |
|                                                                                                                        |                                                                                                      | Prefix Caching                                                                   | \   |
|                                                                                                                        |                                                                                                      | Session Caching                                                                  |
|                                                                                                                        |                                                                                                      |                                                                                  | \   |
| [seed-1-6-flash-250615](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=seed-1-6-flash)     | [Batch API (Chat)](https://docs.byteplus.com/en/docs/ModelArk/1528783)                               | \                                                                                |
|                                                                                                                        | [Batch Inference API (Job)](https://docs.byteplus.com/en/docs/ModelArk/Manage_Batch_Inference_Tasks) | [Responses API](https://docs.byteplus.com/en/docs/ModelArk/Create_model_request) | \   |
|                                                                                                                        |                                                                                                      | Prefix Caching                                                                   | \   |
|                                                                                                                        |                                                                                                      | Session Caching                                                                  |
|                                                                                                                        |                                                                                                      |                                                                                  | \   |
| [kimi-k2-thinking-251104](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=kimi-k2-thinking) | [Batch API (Chat)](https://docs.byteplus.com/en/docs/ModelArk/1528783)                               | \                                                                                |
|                                                                                                                        | [Batch Inference API (Job)](https://docs.byteplus.com/en/docs/ModelArk/Manage_Batch_Inference_Tasks) | [Responses API](https://docs.byteplus.com/en/docs/ModelArk/Create_model_request) | \   |
|                                                                                                                        |                                                                                                      | Prefix Caching                                                                   | \   |
|                                                                                                                        |                                                                                                      | Session Caching                                                                  |
|                                                                                                                        |                                                                                                      |                                                                                  | \   |
| [deepseek-v3-1-250821](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=deepseek-v3-1)       | [Batch API (Chat)](https://docs.byteplus.com/en/docs/ModelArk/1528783)                               | \                                                                                |
|                                                                                                                        | [Batch Inference API (Job)](https://docs.byteplus.com/en/docs/ModelArk/Manage_Batch_Inference_Tasks) | [Responses API](https://docs.byteplus.com/en/docs/ModelArk/Create_model_request) | \   |
|                                                                                                                        |                                                                                                      | Prefix Caching                                                                   | \   |
|                                                                                                                        |                                                                                                      | Session Caching                                                                  |

<span id="25b394c2"></span>

# Structured output (beta)

Overview: [Structured output (beta)](/docs/ModelArk/1568221) | API：<a href="https://docs.byteplus.com/en/docs/ModelArk/Chat">Chat API</a>, <a href="https://docs.byteplus.com/en/docs/ModelArk/Create_model_request">Responses API</a>

:::tip
This capability is still in the beta phase. Proceed with caution when using it in the production environment.
:::

| | | | | \

| Model ID                                                                                                           | Capabilities              | Length Limits (Tokens)                     | Rate Limits |
| ------------------------------------------------------------------------------------------------------------------ | ------------------------- | ------------------------------------------ | ----------- | --- |
|                                                                                                                    |                           |                                            |             | \   |
| [seed-1-8-251228](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=seed-1-8)             | Deep Reasoning            | \                                          |
|                                                                                                                    | Text Generation           | \                                          |
|                                                                                                                    | Multi-modal Understanding | \                                          |
|                                                                                                                    | Function Calling          | \                                          |
|                                                                                                                    | Structured Output         | Context Length: 256K                       | \           |
|                                                                                                                    |                           | Max Input: 224K                            | \           |
|                                                                                                                    |                           | Max Output (incl. CoT): 64K, (Default: 4K) | \           |
|                                                                                                                    |                           | Max CoT: 32K                               | 30K RPM     | \   |
|                                                                                                                    |                           |                                            | 1500K TPM   |
|                                                                                                                    |                           |                                            |             | \   |
| [deepseek-v3-2-251201](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=deepseek-v3-2)   | Deep Reasoning            | \                                          |
|                                                                                                                    | Text Generation           | \                                          |
|                                                                                                                    | Function Calling          | Context Length: 128K                       | \           |
|                                                                                                                    |                           | Max Input: 128K                            | \           |
|                                                                                                                    |                           | Max Output (incl. CoT): 32K, (Default: 4K) | \           |
|                                                                                                                    |                           | Max CoT: 32K                               | \           |
|                                                                                                                    |                           |                                            | 15K RPM     | \   |
|                                                                                                                    |                           |                                            | 1500K TPM   |
|                                                                                                                    |                           |                                            |             | \   |
| [seed-1-6-250915](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=seed-1-6)             | Deep Reasoning            | \                                          |
|                                                                                                                    | Text Generation           | \                                          |
|                                                                                                                    | Image Understanding       | \                                          |
|                                                                                                                    | Video Understanding       | \                                          |
|                                                                                                                    | Structured Output         | \                                          |
|                                                                                                                    | Function Calling          | Context Length: 256K                       | \           |
|                                                                                                                    |                           | Max Input: 224K                            | \           |
|                                                                                                                    |                           | Max Output (incl. CoT): 32K, (Default: 4K) | \           |
|                                                                                                                    |                           | Max CoT: 32K                               | 15K RPM     | \   |
|                                                                                                                    |                           |                                            | 800K TPM    |
|                                                                                                                    |                           |                                            |             | \   |
| [seed-1-6-250615](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=seed-1-6)             | Deep Reasoning            | \                                          |
|                                                                                                                    | Text Generation           | \                                          |
|                                                                                                                    | Image Understanding       | \                                          |
|                                                                                                                    | Video Understanding       | \                                          |
|                                                                                                                    | Structured Output         | \                                          |
|                                                                                                                    | Function Calling          | Context Length: 256K                       | \           |
|                                                                                                                    |                           | Max Input: 224K                            | \           |
|                                                                                                                    |                           | Max Output (incl. CoT): 32K, (Default: 4K) | \           |
|                                                                                                                    |                           | Max CoT: 32K                               | 15K RPM     | \   |
|                                                                                                                    |                           |                                            | 800K TPM    |
|                                                                                                                    |                           |                                            |             | \   |
| [seed-1-6-flash-250715](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=seed-1-6-flash) | Deep Reasoning            | \                                          |
|                                                                                                                    | Text Generation           | \                                          |
|                                                                                                                    | Visual Grounding          | \                                          |
|                                                                                                                    | Image Understanding       | \                                          |
|                                                                                                                    | Video Understanding       | \                                          |
|                                                                                                                    | Structured Output         | \                                          |
|                                                                                                                    | Function Calling          | Context Length: 256K                       | \           |
|                                                                                                                    |                           | Max Input: 224K                            | \           |
|                                                                                                                    |                           | Max Output (incl. CoT): 32K, (Default: 4K) | \           |
|                                                                                                                    |                           | Max CoT: 32K                               | 15K RPM     | \   |
|                                                                                                                    |                           |                                            | 800K TPM    |
|                                                                                                                    |                           |                                            |             | \   |
| [seed-1-6-flash-250615](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=seed-1-6-flash) | Deep Reasoning            | \                                          |
|                                                                                                                    | Text Generation           | \                                          |
|                                                                                                                    | Visual Grounding          | \                                          |
|                                                                                                                    | Image Understanding       | \                                          |
|                                                                                                                    | Video Understanding       | \                                          |
|                                                                                                                    | Structured Output         | \                                          |
|                                                                                                                    | Function Calling          | Context Length: 256K                       | \           |
|                                                                                                                    |                           | Max Input: 224K                            | \           |
|                                                                                                                    |                           | Max Output (incl. CoT): 32K, (Default: 4K) | \           |
|                                                                                                                    |                           | Max CoT: 32K                               | 15K RPM     | \   |
|                                                                                                                    |                           |                                            | 800K TPM    |
|                                                                                                                    |                           |                                            |             | \   |
| [skylark-vision-250515](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=skylark-vision) | \                         |
| (Deactivated)                                                                                                      | Text Generation           | \                                          |
|                                                                                                                    | Image Understanding       | \                                          |
|                                                                                                                    | Video Understanding       | \                                          |
|                                                                                                                    | Structured Output         | Context Length: 128K                       | \           |
|                                                                                                                    |                           | Max Input: 12K                             | \           |
|                                                                                                                    |                           | Max Output: 12K, (Default: 4K)             | \           |
|                                                                                                                    |                           | Max CoT: \-                                | 15K RPM     | \   |
|                                                                                                                    |                           |                                            | 800K TPM    |
|                                                                                                                    |                           |                                            |             | \   |
| [skylark-pro-250415](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=skylark-pro)       | \                         |
| (Deactivated)                                                                                                      | Long text                 | Context Length: 128K                       | \           |
|                                                                                                                    |                           | Max Input: \-                              | \           |
|                                                                                                                    |                           | Max Output (incl. CoT): 12K (Default: 4K)  | \           |
|                                                                                                                    |                           | Max CoT: \-                                | 15K RPM     | \   |
|                                                                                                                    |                           |                                            | 800K TPM    |
|                                                                                                                    |                           |                                            |             | \   |
| [deepseek-r1-250528](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=deepseek-r1)       | Deep Reasoning            | \                                          |
|                                                                                                                    | Function Calling          | Context Length: 128K                       | \           |
|                                                                                                                    |                           | Max Input: 96K                             | \           |
|                                                                                                                    |                           | Max Output (incl. CoT): 48K, (Default: 4K) | \           |
|                                                                                                                    |                           | Max CoT: 32K                               | 15K RPM     | \   |
|                                                                                                                    |                           |                                            | 800K TPM    |
|                                                                                                                    |                           |                                            |             | \   |
| [deepseek-r1-250120](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=deepseek-r1)       | \                         |
| (Deactivated)                                                                                                      | Deep Reasoning            | \                                          |
|                                                                                                                    | Function Calling          | Context Length: 96K                        | \           |
|                                                                                                                    |                           | Max Input: 64K                             | \           |
|                                                                                                                    |                           | Max Output (incl. CoT): 48K, (Default: 4K) | \           |
|                                                                                                                    |                           | Max CoT: 32K                               | 15K RPM     | \   |
|                                                                                                                    |                           |                                            | 800K TPM    |
|                                                                                                                    |                           |                                            |             | \   |
| [deepseek-v3-250324](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=deepseek-v3)       | \                         |
| (Deactivated)                                                                                                      | Text Generation           | \                                          |
|                                                                                                                    | Function Calling          | Context Length: 128K                       | \           |
|                                                                                                                    |                           | Max Input: \-                              | \           |
|                                                                                                                    |                           | Max Output: 16K (Default: 4K)              | \           |
|                                                                                                                    |                           | Max CoT: \-                                | 15K RPM     | \   |
|                                                                                                                    |                           |                                            | 800K TPM    |

<span id="2705b333"></span>

# Video generation

Tutorials: [Video generation](/docs/ModelArk/1366799) | API：<a href="https://docs.byteplus.com/en/docs/ModelArk/Video_Generation_API">Video Generation API</a>

| | | | | | \
|Model ID |\
|<div style="width:150px"></div> |Capabilities |\
| |<div style="width:150px"></div> |Output Video Format |\
| | |<div style="width:150px"></div> |Rate Limits |\
| | | |> default (Online Inference) |\
| | | |> flex (Offline Inference) |\
| | | | |\

|                                                                                                                                            |                                        |                                                 | <div style="width:150px"></div> | Free Credit (Token) |
| ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------- | ----------------------------------------------- | ------------------------------- | ------------------- | --- |
|                                                                                                                                            |                                        |                                                 |                                 |                     | \   |
| [seedance-1-5-pro-251215](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=seedance-1-5-pro) `audio-visual sync` | Image-to-Video - First and Last Frames | \                                               |
|                                                                                                                                            | Image-to-Video - First Frame           | \                                               |
|                                                                                                                                            | Text-to-Video                          | Resolution:                                     | \                               |
|                                                                                                                                            |                                        | 480p, 720p,                                     | \                               |
|                                                                                                                                            |                                        | 1080p                                           | \                               |
|                                                                                                                                            |                                        | Frame Rate: 24 fps                              | \                               |
|                                                                                                                                            |                                        | Duration: 4~12 s                                | \                               |
|                                                                                                                                            |                                        | Video Format: mp4                               | \* default：                    | \                   |
|                                                                                                                                            |                                        |                                                 | \* RPM 600                      | \                   |
|                                                                                                                                            |                                        |                                                 | \* Concurrency:10               | \                   |
|                                                                                                                                            |                                        |                                                 | \* flex：                       | \                   |
|                                                                                                                                            |                                        |                                                 | \* TPD: 500B                    | \* default：200M    | \   |
|                                                                                                                                            |                                        |                                                 |                                 | \* flex：N/A        |
|                                                                                                                                            |                                        |                                                 |                                 |                     | \   |
| [seedance-1-0-pro-250528](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=seedance-1-0-pro)                     | Image-to-Video - First and Last Frames | \                                               |
|                                                                                                                                            | Image-to-Video - First Frame           | \                                               |
|                                                                                                                                            | Text-to-Video                          | Resolution:                                     | \                               |
|                                                                                                                                            |                                        | 480p,                                           | \                               |
|                                                                                                                                            |                                        | 720p,                                           | \                               |
|                                                                                                                                            |                                        | 1080p`Reference image feature is not supported` | \                               |
|                                                                                                                                            |                                        | Frame Rate: 24 fps                              | \                               |
|                                                                                                                                            |                                        | Duration: 2~12 s                                | \                               |
|                                                                                                                                            |                                        | Video Format: mp4                               | \* default：                    | \                   |
|                                                                                                                                            |                                        |                                                 | \* RPM 600                      | \                   |
|                                                                                                                                            |                                        |                                                 | \* Concurrency:10               | \                   |
|                                                                                                                                            |                                        |                                                 | \* flex：                       | \                   |
|                                                                                                                                            |                                        |                                                 | \* TPD: 500B                    | \* default：200M    | \   |
|                                                                                                                                            |                                        |                                                 |                                 | \* flex：N/A        |
|                                                                                                                                            |                                        | ^^                                              |                                 |                     | \   |
| [seedance-1-0-pro-fast-251015](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=seedance-1-0-pro-fast)           | Image-to-Video - First Frame           | \                                               |
|                                                                                                                                            | Text-to-Video                          |                                                 | \* default：                    | \                   |
|                                                                                                                                            |                                        |                                                 | \* RPM 600                      | \                   |
|                                                                                                                                            |                                        |                                                 | \* Concurrency:10               | \                   |
|                                                                                                                                            |                                        |                                                 | \* flex：                       | \                   |
|                                                                                                                                            |                                        |                                                 | \* TPD: 500B                    | \* default：200M    | \   |
|                                                                                                                                            |                                        |                                                 |                                 | \* flex：N/A        |
|                                                                                                                                            |                                        | ^^                                              |                                 |                     | \   |
| [seedance-1-0-lite-t2v-250428](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=seedance-1-0-lite-t2v)           | Text-to-Video                          |                                                 | \* default：                    | \                   |
|                                                                                                                                            |                                        |                                                 | \* RPM 300                      | \                   |
|                                                                                                                                            |                                        |                                                 | \* Concurrency: 5               | \                   |
|                                                                                                                                            |                                        |                                                 | \* flex：                       | \                   |
|                                                                                                                                            |                                        |                                                 | \* TPD: 250B                    | \* default：200M    | \   |
|                                                                                                                                            |                                        |                                                 |                                 | \* flex：N/A        |
|                                                                                                                                            |                                        | ^^                                              |                                 |                     | \   |
| [seedance-1-0-lite-i2v-250428](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=seedance-1-0-lite-i2v)           | Image-to-Video - Reference Images      | \                                               |
|                                                                                                                                            | Image-to-Video - First and Last Frames | \                                               |
|                                                                                                                                            | Image-to-Video - First Frame           |                                                 | \* default：                    | \                   |
|                                                                                                                                            |                                        |                                                 | \* RPM 300                      | \                   |
|                                                                                                                                            |                                        |                                                 | \* Concurrency: 5               | \                   |
|                                                                                                                                            |                                        |                                                 | \* flex：                       | \                   |
|                                                                                                                                            |                                        |                                                 | \* TPD: 250B                    | \* default：200M    | \   |
|                                                                                                                                            |                                        |                                                 |                                 | \* flex：N/A        |

<span id="d3e5e0eb"></span>

# Image generation

Tutorial: [Image Generation](/docs/ModelArk/1548482) | API：<a href="https://docs.byteplus.com/en/docs/ModelArk/1541523">Image generation API</a>

| | | | \
|Model ID |Capabilities |\

|                                                                                                                        | <div style="width:200px"></div>                              | Rate Limits (IPM) |
| ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ----------------- | --- |
|                                                                                                                        |                                                              |                   | \   |
| [seedream-5-0-260128](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=seedream-5-0)         | \                                                            |
| (also supports: seedream-5-0-lite-260128)                                                                              | Text-to-Image                                                | \                 |
|                                                                                                                        | Image-to-Image                                               | \                 |
|                                                                                                                        |                                                              | \                 |
|                                                                                                                        | \* Single Image-to-Image                                     | \                 |
|                                                                                                                        | \* Generate images with multiple reference images            | \                 |
|                                                                                                                        |                                                              | \                 |
|                                                                                                                        | Generate a batch of images                                   | \                 |
|                                                                                                                        |                                                              | \                 |
|                                                                                                                        | \* Generate a batch of images from text                      | \                 |
|                                                                                                                        | \* Generate a batch of images from a single image            | \                 |
|                                                                                                                        | \* Generate a batch of images from multiple reference images | 500               |
|                                                                                                                        | ^^                                                           |                   | \   |
| [seedream-4-5-251128](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=seedream-4-5)         |                                                              | 500               |
|                                                                                                                        | ^^                                                           |                   | \   |
| [seedream-4-0-250828](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=seedream-4-0)         |                                                              | 500               |
|                                                                                                                        |                                                              |                   | \   |
| [seedream-3-0-t2i-250415](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=seedream-3-0-t2i) | Text-to-Image                                                | 500               |
|                                                                                                                        |                                                              |                   | \   |
| [seededit-3-0-i2i-250628](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=seededit-3-0-i2i) | \                                                            |
| (Deactivated)                                                                                                          | Image Editing                                                | 500               |

<span id="ee5ec35c"></span>

# Multimodal embedding

Tutorial: [Multimodal embedding](/docs/ModelArk/1409291) | API：<a href="https://docs.byteplus.com/en/docs/ModelArk/1523520">Embeddings Multimodal API</a>

| | | | | | \
|Model ID |Capabilities |Context Length |\

|                                                                                                                                        |                                                                    | (Token) | Maximum Vector Dimension | Rate Limits |
| -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ------- | ------------------------ | ----------- | --- |
|                                                                                                                                        |                                                                    |         |                          |             | \   |
| [skylark-embedding-vision-251215](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=skylark-embedding-vision) | Videos, Images and Text vectorization, support Chinese and English | 128K    | 2048                     | 1.2K RPM    | \   |
|                                                                                                                                        |                                                                    |         |                          | 1200K TPM   | \   |
|                                                                                                                                        |                                                                    |         |                          |             |
|                                                                                                                                        |                                                                    |         |                          |             | \   |
| [skylark-embedding-vision-250615](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=skylark-embedding-vision) | Videos, Images and Text vectorization, support Chinese and English | 128K    | 2048                     | 1.2K RPM    | \   |
|                                                                                                                                        |                                                                    |         |                          | 1200K TPM   |
|                                                                                                                                        |                                                                    |         |                          |             | \   |
| [skylark-embedding-vision-250328](https://console.byteplus.com/ark/region:ark+ap-southeast-1/model/detail?Id=skylark-embedding-vision) | \                                                                  |
| (Deactivated)                                                                                                                          | Images and text vectorization, support Chinese and English         | 8K      | 2048                     | 1.2K RPM    | \   |
|                                                                                                                                        |                                                                    |         |                          | 1200K TPM   |

<style>
table {
  width: 100%;
  table-layout: fixed;
}

/* 直接针对表头设置宽度（示例4列） */
th:nth-child(1) { width: 12.5% !important; }
th:nth-child(2) { width: 12.5% !important; }
th:nth-child(3) { width: 12.5% !important; }
th:nth-child(4) { width: 12.5% !important; }
th:nth-child(5) { width: 12.5% !important; }
th:nth-child(6) { width: 12.5% !important; }
th:nth-child(7) { width: 12.5% !important; }
th:nth-child(8) { width: 12.5% !important; }

/* 确保单元格继承表头宽度 */
td {
  width: inherit !important;
  box-sizing: border-box;
}

/* 图片自适应 */
img {
    max-width: 100%;
    height: auto;
    border-radius: 6px;
}

</style>

ModelArk APIs fall into two categories: model invocation (data-plane APIs) and control-plane APIs for managing inference endpoints and other control and management tasks They use different authentication methods. The sections below describe authentication for ModelArk APIs
<span id="28e0db57"></span>

# Concepts

- **Data-plane APIs**: interfaces that directly handle **business data transfer, real-time interaction, and user request handling**, focusing on the flow and processing of actual business data, and delivering the system’s core external service capabilities Both the Chat API and Responses API for invoking model services are data-plane APIs
- **Control-plane AP**I: interfaces for **system resource management, configuration control, and status Monitoring**, focusing on managing and scheduling the data plane and system resources, and serving as the control center that ensures stable system operations ModelArk’s management API Key and foundation model management are control-plane APIs
- **Base URL**: the base template for constructing full API request URLs. It includes **the scheme (for example, http/https), host (domain name or IP), port (optional), and base path (optional)**, and serves as the common prefix for all specific API paths You can compose a full API URL by appending the API path, version, and other parameters to the Base URL. Typical structure: `[scheme]://[host]/[base path (optional)]`

<span id="b77a3928"></span>

# Base URL

Base URLs for each API type

- Data plane API:<https://ark.ap-southeast.bytepluses.com/api/v3>

<span id="0fed4817"></span>

# Data plane API authentication

Supports two authentication methods: API key authentication (simple and convenient) and Access Key authentication (traditional cloud resource permission management; managed by resource groups, cloud products, and other dimensions; suitable for fine-grained enterprise management).
<span id="60db1ed6"></span>

## API key

<span id="6011c5a5"></span>

### Prerequisites

- [Obtain an API key](https://console.byteplus.com/ark/apiKey)
- [Enable the model service](https://console.byteplus.com/ark/openManagement)
- In [Model List](/docs/ModelArk/1330310) obtain the required Model ID

<span id="d44d13a6"></span>

### Signature construction

Add the `Authorization` header to the HTTP request header as follows:

```Shell
Authorization: Bearer $ARK_API_KEY
```

<span id="e8bd2618"></span>

### Sample API call

```Shell
curl https://ark.ap-southeast.bytepluses.com/api/v3/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ARK_API_KEY" \
  -d '{
    "model": "seed-1-6-250915",
    "messages": [
        {
            "role": "system",
            "content": "You are a helpful assistant."
        },
        {
            "role": "user",
            "content": "Hello!"
        }
    ]
  }'
```

- Replace the Model ID as needed. To query the Model ID, see [Model List](/docs/ModelArk/1330310).

<span id="21bff83b"></span>

## Access key

<span id="3ad1c414"></span>

### Prerequisites

You have obtained the Access Key. To create or view an Access Key, see [API Access Key Management](https://console.byteplus.com/iam/keymanage).

> Because the primary account's Access Key has elevated permissions, create an IAM user, grant permissions such as ModelArk, then use the IAM user's Access Key to perform operations. For details, see [Access Control Using IAM](/docs/ModelArk/1263493) .

<span id="d03b2bb1"></span>

### Usage example

See [Use Access Key for authentication](/docs/undefined/6906ced5922904054fca577c#fa44b913).

> When using Access Key authentication, set the model field to the Endpoint ID.

<span id="bdd329d5"></span>

# Control plane API authentication

Other APIs include control plane APIs for API key management, inference endpoint management, and more.
<span id="50f355e8"></span>

## Access key

You have obtained the Access Key. To create or view an Access Key, see [API access key management](https://console.byteplus.com/iam/keymanage).
<span id="c04e9b57"></span>

### Method: use samples/documentation (simple, recommended)

See [OpenAPI Center](https://api.byteplus.com/api-explorer?action=GetApiKey&groupName=Manage%20API%20Key&serviceCode=ark&tab=3&tab_sdk=GO&version=2024-01-01).
