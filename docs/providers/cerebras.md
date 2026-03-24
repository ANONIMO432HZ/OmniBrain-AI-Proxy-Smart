> ## Documentation Index [Cerebras](https://inference-docs.cerebras.ai/introduction)
> Fetch the complete documentation index at: https://inference-docs.cerebras.ai/llms.txt
> Use this file to discover all available pages before exploring further.

# Rate Limits

> Learn how rate limits are applied and measured.

Rate limits ensure fair usage and system stability by regulating how often users and applications can access our API within a specified timeframe. They help protect our service from abuse or misuse and keep your access fair and without slowdowns.

## How are rate limits measured?

We measure rate limits in requests sent and tokens used within a specified timeframe:

* Requests per minute/hour/day (RPM, RPH, RPD)
* Tokens per minute/hour/day (TPM, TPH, TPD)

Rate limiting can be triggered by any metric, whichever comes first. For example, you have a rate limit of 50 RPM and 200K TPM. If you submit 50 requests in one minute with just 100 tokens each, you'll hit your limit even though your total token usage (5,000) is far below the 200K token threshold.

Rate limits apply at the organization level, not the user level, and vary based on the model.

### Token Rate Limiting

When you send a request, we estimate the total tokens that will be consumed by:

1. Estimating the input tokens in your prompt
2. Adding either the `max_completion_tokens` parameter or the maximum sequence length (MSL), minus input tokens

If this estimated token consumption would exceed your available token quota, the request is rate limited before processing begins. This ensure fair usage and system stability.

**Best practice**: Set [`max_completion_tokens`](/api-reference/chat-completions#param-max-completion-tokens) appropriately for your use case to avoid overestimating token usage and triggering unnecessary rate limits.

### Quota Replenishment

Your quota is calculated as:

```
Available quota = Rate limit - Usage in current time window
```

We use the [token bucketing](https://en.wikipedia.org/wiki/Token_bucket) algorithm for rate limiting, which means your capacity replenishes continuously rather than resetting at fixed intervals. As you consume tokens or requests, your available capacity automatically refills up to your maximum limit.

This token bucketing approach ensures smoother API access and prevents the "burst at interval start, then idle" pattern.

## Limits by Tier

This provides an overview of general limits, though specific cases may vary. For precise, up-to-date rate limit information applicable to your organization, check the Limits section within your account.

<Tabs>
  <Tab title="Free">
    | Model                            | TPM | TPH | TPD | RPM | RPH | RPD   |
    | -------------------------------- | --- | --- | --- | --- | --- | ----- |
    | `gpt-oss-120b`                   | 64K | 1M  | 1M  | 30  | 900 | 14.4K |
    | `llama3.1-8b`                    | 60K | 1M  | 1M  | 30  | 900 | 14.4K |
    | `qwen-3-235b-a22b-instruct-2507` | 60K | 1M  | 1M  | 30  | 900 | 14.4K |
    | `zai-glm-4.7`                    | 60K | 1M  | 1M  | 10  | 100 | 100   |
  </Tab>

  <Tab title="PayGo">
    | Model                            | TPM  | RPM |
    | -------------------------------- | ---- | --- |
    | `gpt-oss-120b`                   | 1M   | 1K  |
    | `llama3.1-8b`                    | 2M   | 2K  |
    | `qwen-3-235b-a22b-instruct-2507` | 250K | 250 |
    | `zai-glm-4.7`                    | 500K | 500 |

    <Note>Hourly and daily restrictions don't apply to developer tier users. Since this tier uses pay-as-you-go pricing, you can use as many tokens as needed within your budget.</Note>
  </Tab>
</Tabs>

## Rate Limit Headers

To help you monitor your usage in real time, we inject several custom headers into every API response. These headers provide insight into your current usage and when your limits will reset.

You’ll find the following headers in the response:

| Header                                | Description                                                 |
| ------------------------------------- | ----------------------------------------------------------- |
| `x-ratelimit-limit-requests-day`      | Maximum number of requests allowed per day.                 |
| `x-ratelimit-limit-tokens-minute`     | Maximum number of tokens allowed per minute.                |
| `x-ratelimit-remaining-requests-day`  | Number of requests remaining for the current day.           |
| `x-ratelimit-remaining-tokens-minute` | Number of tokens remaining for the current minute.          |
| `x-ratelimit-reset-requests-day`      | Time (in seconds) until your daily request limit resets.    |
| `x-ratelimit-reset-tokens-minute`     | Time (in seconds) until your per-minute token limit resets. |

These values update with each API call, giving you immediate visibility into your current usage.

### Example

You can view these headers by adding the `--verbose` flag to a cURL request:

```bash  theme={null}
curl --location 'https://api.cerebras.ai/v1/chat/completions' \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer ${CEREBRAS_API_KEY}" \
--data '{
  "model": "llama3.1-8b",
  "stream": false,
  "messages": [{"content": "Hello!", "role": "user"}],
  "temperature": 0,
  "max_completion_tokens": -1,
  "seed": 0,
  "top_p": 1
}' \
--verbose
```

In the response, look for headers like these:

```
x-ratelimit-limit-requests-day: 1000000000
x-ratelimit-limit-tokens-minute: 1000000000
x-ratelimit-remaining-requests-day: 999997455
x-ratelimit-remaining-tokens-minute: 999998298
x-ratelimit-reset-requests-day: 33011.382867097855
x-ratelimit-reset-tokens-minute: 11.382867097854614
```

## Notes

<Note>If you exceed your rate limits, you will receive a [429 Too Many Requests error](/support/error).</Note>

If you have questions about your usage or need higher rate limits, [contact us](https://www.cerebras.ai/contact) via our website, or reach out to your account representative.

> ## Documentation Index
> Fetch the complete documentation index at: https://inference-docs.cerebras.ai/llms.txt
> Use this file to discover all available pages before exploring further.

# Authentication

The Cerebras API uses API keys for authentication. Create and manage API keys from our [Inference Cloud Console](https://cloud.cerebras.ai?utm_source=3pi_authentication\&utm_campaign=api_reference).

<Danger>
  **Keep your API key secure.** Never share it publicly or include it in client-side code (such as browsers or mobile apps). Instead, load it safely from an environment variable or a server-side key management service.
</Danger>

API keys are passed using HTTP Bearer authentication:

```
Authorization: Bearer CEREBRAS_API_KEY
```

## Example Request

```bash  theme={null}
curl --location 'https://api.cerebras.ai/v1/chat/completions' \
  --header 'Content-Type: application/json' \
  --header "Authorization: Bearer ${CEREBRAS_API_KEY}" \
  --data '{
    "model": "llama3.1-8b",
    "messages": [
      {"role": "user", "content": "Tell me a fun fact about space."}
    ]
  }'
```

## Using Official SDKs

You can also authenticate automatically when using the official SDKs for Python and Node.js by passing your API key during client initialization:

<CodeGroup>
  ```python Python theme={null}
  import os
  from cerebras.cloud.sdk import Cerebras

  client = Cerebras(
      # This is the default and can be omitted
      api_key=os.environ.get("CEREBRAS_API_KEY"),
  )
  ```

  ```javascript Node.js theme={null}
  import Cerebras from 'cerebras_cloud_sdk';

  const client = new Cerebras({
    apiKey: process.env['CEREBRAS_API_KEY'], // This is the default and can be omitted
  });
  ```
</CodeGroup>

## Set Your API Key

For security reasons, and to avoid configuring your API key each time, we recommend setting your API key as an environment variable. You can do this by running the following command in your terminal:

```bash  theme={null}
export CEREBRAS_API_KEY="your-api-key"
```

> ## Documentation Index
> Fetch the complete documentation index at: https://inference-docs.cerebras.ai/llms.txt
> Use this file to discover all available pages before exploring further.

# Tool Calling

> Learn how to connect models to external tools with tool calling.

Tool calling (also known as tool use or function calling) enables models to interact with external tools, applications, or APIs to perform various actions and access real-time information beyond their initial training data.

## How It Works

1. **Define the tool**: Provide a name, description, and input parameters for each tool you want the model to access.

2. **Send the request**: The prompt is sent along with available tool definitions in your API call.

3. **Model decides**: The model analyzes the prompt and its available tools to decide if a tool can help answer the question. If it decides to use a tool, it responds with a structured output indicating which tool to call and what arguments to use.

4. **Execute the tool**: The client application receives the model's tool call request, executes the specified tool (such as calling an external API), and retrieves the result.

5. **Generate final response**: The result from the tool is sent back to the model, which can then use this new information to generate a final, accurate response to the user.

## Basic Tool Calling

<Steps>
  <Step title="Initial Setup">
    To begin, we need to import the necessary libraries and set up our Cerebras client.

    <Tip>
      If you haven't set up your Cerebras API key yet, please visit our [QuickStart guide](/quickstart) for detailed instructions on how to obtain and configure your API key.
    </Tip>

    ```python  theme={null}
    import os
    import json
    import re
    from cerebras.cloud.sdk import Cerebras

    # Initialize Cerebras client
    client = Cerebras(
        api_key=os.environ.get("CEREBRAS_API_KEY"),
    )
    ```
  </Step>

  <Step title="Setting Up the Tool">
    Our first step is to define the tool that our AI will use. In this example, we're creating a simple calculator function that can perform basic arithmetic operations.

    ```python  theme={null}
    def calculate(expression):
        expression = re.sub(r'[^0-9+\-*/().]', '', expression)
        
        try:
            result = eval(expression)
            return str(result)
        except (SyntaxError, ZeroDivisionError, NameError, TypeError, OverflowError):
            return "Error: Invalid expression"
    ```
  </Step>

  <Step title="Defining the Tool Schema">
    Next, we define the tool schema. This schema acts as a blueprint for the AI, describing the tool's functionality, when to use it, and what parameters it expects. It helps the AI understand how to interact with our custom tool effectively.

    <Note>
      With `strict: true` enabled, tool call arguments are guaranteed to match your schema exactly through constrained decoding.
    </Note>

    ```python  theme={null}
    tools = [
        {
            "type": "function",
            "function": {
                "name": "calculate",
                "strict": True,
                "description": "A calculator tool that can perform basic arithmetic operations. Use this when you need to compute mathematical expressions or solve numerical problems.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "expression": {
                            "type": "string",
                            "description": "The mathematical expression to evaluate"
                        }
                    },
                    "required": ["expression"],
                    "additionalProperties": False
                }
            }
        }
    ]
    ```
  </Step>

  <Step title="Making the API Call">
    With our tool and its schema defined, we can now set up the conversation for our AI. We will prompt the LLM using natural language to conduct a simple calculation, and make the API call.

    This call sends our messages and tool schema to the LLM, allowing it to generate a response that may include tool use.

    ```python  theme={null}
    messages = [
        {"role": "system", "content": "You are a helpful assistant with access to a calculator. Use the calculator tool to compute mathematical expressions when needed."},
        {"role": "user", "content": "What's the result of 15 multiplied by 7?"},
    ]

    response = client.chat.completions.create(
        model="gpt-oss-120b",
        messages=messages,
        tools=tools,
        parallel_tool_calls=False,
    )
    ```
  </Step>

  <Step title="Handling Tool Calls">
    Now that we've made the API call, we need to process the response and handle any tool calls the LLM might have made. Note that the LLM determines based on the prompt if it should rely on a tool to respond to the user. Therefore, we need to check for any tool calls and handle them appropriately.

    In the code below, we first check if there are any tool calls in the model's response. If a tool call is present, we proceed to execute it and ensure that the function is fulfilled correctly. The function call is logged to indicate that the model is requesting a tool call, and the result of the tool call is logged to clarify that this is not the model's final output but rather the result of fulfilling its request. The result is then passed back to the model so it can continue generating a final response.

    ```python  theme={null}
    choice = response.choices[0].message

    if choice.tool_calls:
        function_call = choice.tool_calls[0].function
        if function_call.name == "calculate":
            # Logging that the model is executing a function named "calculate".
            print(f"Model executing function '{function_call.name}' with arguments {function_call.arguments}")

            # Parse the arguments from JSON format and perform the requested calculation.
            arguments = json.loads(function_call.arguments)
            result = calculate(arguments["expression"])

            # Note: This is the result of executing the model's request (the tool call), not the model's own output.
            print(f"Calculation result sent to model: {result}")
           
           # Send the result back to the model to fulfill the request.
            messages.append({
                "role": "tool",
                "content": json.dumps(result),
                "tool_call_id": choice.tool_calls[0].id
            })
     
           # Request the final response from the model, now that it has the calculation result.
            final_response = client.chat.completions.create(
                model="gpt-oss-120b",
                messages=messages,
            )
            
            # Handle and display the model's final response.
            if final_response:
                print("Final model output:", final_response.choices[0].message.content)
            else:
                print("No final response received")
    else:
        # Handle cases where the model's response does not include expected tool calls.
        print("Unexpected response from the model")
    ```
  </Step>
</Steps>

In this case, the LLM determined that a tool call was appropriate to answer the users' question of what the result of 15 multiplied by 7 is. See the output below.

```
Model executing function 'calculate' with arguments {"expression": "15 * 7"}
Calculation result sent to model: 105
Final model output: 15 * 7 = 105
```

## Strict Mode for Tool Calling

Strict mode ensures that the model generates tool call arguments that exactly match your defined schema. This is essential for building reliable agentic workflows where invalid parameters could break your application.

### Why Strict Mode Matters for Tools

Without strict mode, tool calls might include:

* Wrong parameter types (e.g., `"2"` instead of `2`)
* Missing required parameters
* Unexpected extra parameters
* Malformed argument JSON

With strict mode, you get guaranteed schema compliance for every tool call.

### Enabling Strict Mode

Set `strict` to `true` inside the `function` object of your tool definition:

```python Python theme={null}
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "strict": True,  # Enable constrained decoding
            "description": "Get the current weather for a location",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "City and country, e.g., 'San Francisco, USA'"
                    },
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"]
                    }
                },
                "required": ["location", "unit"],
                "additionalProperties": False
            }
        }
    }
]
```

### Schema Requirements

When using strict mode, you must set `additionalProperties: false`. This is required for every object in your schema.

For information about schema limitations that apply when using strict mode, see [Limitations in Strict Mode](/capabilities/structured-outputs#limitations-in-strict-mode).

### Strict Mode with Parallel Tool Calling

Strict mode works with parallel tool calling. When multiple tools are called simultaneously, each tool call's arguments will conform to its respective schema:

```python Python theme={null}
response = client.chat.completions.create(
    model="zai-glm-4.7",
    messages=messages,
    tools=tools,  # Each tool can have strict: true
    parallel_tool_calls=True,
)
```

## Multi-turn Tool Calling

Most real-world workflows require more than one tool invocation. Multi-turn tool calling lets a model call a tool, incorporate its output, and then, within the same conversation, decide whether it needs to call the tool (or another tool) again to finish the task.

It works as follows:

1. After every tool call you append the tool response to `messages`, then ask the model to continue.
2. The model itself decides when enough information has been gathered to produce a final answer.
3. Continue calling `client.chat.completions.create()` until you get a message without `tool_calls`.

The example below demonstrates multi-turn tool calling as an extension of the calculator example above. Before continuing, make sure you’ve completed Steps 1–3 from the calculator setup section.

```python  theme={null}
messages = [
    {
        "role": "system",
        "content": (
            "You are a helpful assistant with a calculator tool. "
            "Use it whenever math is required."
        ),
    },
    {"role": "user", "content": "First, multiply 15 by 7. Then take that result, add 20, and divide the total by 2. What's the final number?"},
]

# Register every callable tool once
available_functions = {
    "calculate": calculate,
}

while True:
    resp = client.chat.completions.create(
        model="gpt-oss-120b",
        messages=messages,
        tools=tools,
    )
    msg = resp.choices[0].message

    # If the assistant didn’t ask for a tool, we’re done
    if not msg.tool_calls:
        print("Assistant:", msg.content)
        break

    # Save the assistant turn exactly as returned
    messages.append(msg.model_dump())    

    # Run the requested tool
    call  = msg.tool_calls[0]
    fname = call.function.name

    if fname not in available_functions:
        raise ValueError(f"Unknown tool requested: {fname!r}")

    args_dict = json.loads(call.function.arguments)  # assumes JSON object
    output = available_functions[fname](**args_dict)

    # Feed the tool result back
    messages.append({
        "role": "tool",
        "tool_call_id": call.id,
        "content": json.dumps(output),
    })
```

## Parallel Tool Calling

Parallel tool calling allows models to call multiple tools simultaneously for reduced latency and faster responses.

For example, if a user asks "Is Toronto warmer than Montreal?", the model needs to check the weather in both cities. Rather than making two separate requests, parallel tool calling enables the model to request both operations at once, reducing latency and improving efficiency.

Parallel tool calling is most beneficial when:

* A single query requires multiple independent data points (e.g., comparing weather in different cities)
* Multiple tools need to be invoked that don't have dependencies on each other
* You want to reduce the number of API calls and overall response time

### Enable Parallel Tool Calling

You can explicitly control this behavior using the `parallel_tool_calls` parameter:

```python highlight={5} theme={null}
response = client.chat.completions.create(
    model="zai-glm-4.7",
    messages=messages,
    tools=tools,
    parallel_tool_calls=True,  # Enable parallel calling (default)
)
```

To disable parallel tool calling and force sequential execution:

```python highlight={5} theme={null}
response = client.chat.completions.create(
    model="zai-glm-4.7",
    messages=messages,
    tools=tools,
    parallel_tool_calls=False,  # Disable parallel calling
)
```

### Example: Weather Comparison

Let's walk through a complete example that demonstrates parallel tool calling by comparing weather in two cities.

<Steps>
  <Step title="Define the Weather Tool">
    First, we'll create a simple weather function and define the tool in our schema:

    ```python  theme={null}
    import os
    import json
    from cerebras.cloud.sdk import Cerebras

    client = Cerebras(
        api_key=os.environ.get("CEREBRAS_API_KEY"),
    )

    def get_weather(location):
        """
        Dummy function that returns mock weather data.
        In production, this would call a real weather API.
        """
        weather_data = {
            "location": location,
            "temperature": 22,
            "condition": "sunny",
            "humidity": 45,
        }
        return json.dumps(weather_data)

    tools = [
        {
            "type": "function",
            "function": {
                "name": "get_weather",
                "strict": True,
                "description": "Get temperature for a given location.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "location": {
                            "type": "string",
                            "description": "City and country e.g. Toronto, Canada"
                        }
                    },
                    "required": ["location"],
                    "additionalProperties": False
                }
            }
        }
    ]
    ```
  </Step>

  <Step title="Make the API Call with Parallel Tool Calling Enabled">
    Now we'll send a query that requires checking weather in two different cities:

    ```python  theme={null}
    messages = [
        {
            "role": "system",
            "content": "You are a helpful Cerebras Assistant."
        },
        {
            "role": "user",
            "content": "Is Toronto warmer than Montreal?"
        }
    ]

    response = client.chat.completions.create(
        model="zai-glm-4.7",
        messages=messages,
        tools=tools,
        parallel_tool_calls=True,
    )
    ```
  </Step>

  <Step title="Handle Multiple Tool Calls">
    When parallel tool calling is enabled, the model's response may contain multiple tool calls in the `tool_calls` array. We need to iterate through all of them:

    ```python  theme={null}
    choice = response.choices[0].message

    if choice.tool_calls:
        # Add the assistant message with tool_calls first
        messages.append(choice)

        # Process all tool calls
        for tool_call in choice.tool_calls:
            function_call = tool_call.function
            print(f"Model executing function '{function_call.name}' with arguments {function_call.arguments}")
            
            # Parse arguments and execute the function
            arguments = json.loads(function_call.arguments)
            result = get_weather(arguments["location"])
            
            print(f"Weather data sent to model: {result}")
            
            # Append each tool result to messages
            messages.append({
                "role": "tool",
                "content": result,
                "tool_call_id": tool_call.id
            })
        
        # Get final response after all tool calls are processed
        final_response = client.chat.completions.create(
            model="zai-glm-4.7",
            messages=messages,
        )
        
        if final_response:
            print("Final model output:", final_response.choices[0].message.content)
        else:
            print("No final response received")
    else:
        print("No tool calls in response")
    ```
  </Step>
</Steps>
